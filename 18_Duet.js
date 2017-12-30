// You discover a tablet containing some strange assembly code labeled simply "Duet". Rather than
// bother the sound card with it, you decide to run the code yourself. Unfortunately, you don't see any
// documentation, so you're left to figure out what the instructions mean on your own.

// It seems like the assembly is meant to operate on a set of registers that are each named with a
// single letter and that can each hold a single integer. You suppose each register should start with a
// value of 0.

// There aren't that many instructions, so it shouldn't be hard to figure out what they do. Here's what
// you determine:

// snd X plays a sound with a frequency equal to the value of X.

// set X Y sets register X to the value of Y.

// add X Y increases register X by the value of Y.

// mul X Y sets register X to the result of multiplying the value contained in register X by the value
// of Y.

// mod X Y sets register X to the remainder of dividing the value contained in register X by the value
// of Y (that is, it sets X to the result of X modulo Y).

// rcv X recovers the frequency of the last sound played, but only when the value of X is not zero. (If
// it is zero, the command does nothing.)

// jgz X Y jumps with an offset of the value of Y, but only if the value of X is greater than zero. (An
// offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so
// on.)

// Many of the instructions can take either a register (a single letter) or a number. The value of a
// register is the integer it contains; the value of a number is that number.

// After each jump instruction, the program continues with the instruction to which the jump jumped.
// After any other instruction, the program continues with the next instruction. Continuing (or
// jumping) off either end of the program terminates it.

// For example:

// set a 1
// add a 2
// mul a a
// mod a 5
// snd a
// set a 0
// rcv a
// jgz a -1
// set a 1
// jgz a -2

// The first four instructions set a to 1, add 2 to it, square it, and then set it to itself modulo 5,
// resulting in a value of 4.

// Then, a sound with frequency 4 (the value of a) is played.

// After that, a is set to 0, causing the subsequent rcv and jgz instructions to both be skipped (rcv
// because a is 0, and jgz because a is not greater than 0).

// Finally, a is set to 1, causing the next jgz instruction to activate, jumping back two instructions
// to another jump, which jumps again to the rcv, which ultimately triggers the recover operation.

// At the time the recover operation is executed, the frequency of the last sound played is 4.

// What is the value of the recovered frequency (the value of the most recently played sound) the first
// time a rcv instruction is executed with a non-zero value?

// let input = `set a 1
// add a 2
// mul a a
// mod a 5
// snd a
// set a 0
// rcv a
// jgz a -1
// set a 1
// jgz a -2`;


let input = `set i 31
set a 1
mul p 17
jgz p p
mul a 2
add i -1
jgz i -2
add a -1
set i 127
set p 952
mul p 8505
mod p a
mul p 129749
add p 12345
mod p a
set b p
mod b 10000
snd b
add i -1
jgz i -9
jgz a 3
rcv b
jgz b -1
set f 0
set i 126
rcv a
rcv b
set p a
mul p -1
add p b
jgz p 4
snd a
set a b
jgz 1 3
snd b
set f 1
add i -1
jgz i -11
snd a
jgz f -16
jgz a -19`;

input = input
	.split('\n')
	.map(instruction => instruction.split(' '))
	.map(instructions => {
		if (instructions[2]) {
			return isNaN(instructions[2]) ? instructions : [instructions[0],instructions[1],Number(instructions[2])];
		}
		return instructions;
	});

const assembly = (instructions) => {
	let lastSound = null;
	let index = 0;
	let frequencies = {};
	let validRcv = false;

	const operations = {
		snd: frequency => lastSound = frequencies[frequency],
		set: (x,y) => frequencies[x] = isNaN(y) ? frequencies[y] : y,
		add: (x,y) => frequencies[x] = isNaN(y) ? frequencies[x] + frequencies[y] : frequencies[x] + y,
		mul: (x,y) => frequencies[x] = isNaN(y) ? frequencies[x] * frequencies[y] : frequencies[x] * y,
		mod: (x,y) => frequencies[x] = isNaN(y) ? frequencies[x] % frequencies[y] : frequencies[x] % y,
		rcv: frequency => frequencies[frequency] !== 0 ? lastSound : null,
		jgz: (x,y) => {
			let value = isNaN(x) ? frequencies[x] : x;
			if (value > 0) {
				index = isNaN(y) ? index + frequencies[y] : index + y;
			} else index ++;
		}
	}

	while (!validRcv && index <= instructions.length) {
		let instruction = instructions[index].slice();
		if (instruction[0] === 'jgz') {
			operations.jgz(instruction[1], instruction[2]);
		} else {
			if (instruction[0] === 'rcv') {
				if (operations.rcv(instruction[1]) !== null) {
					validRcv = true;
					break;
				}				
			} else if (instruction[0] === 'snd') {
				operations.snd(instruction[1]);
			} else operations[instruction[0]](instruction[1], instruction[2]);
			index++;
		}
	}
	console.log(`Value of last sound: ${lastSound}`);

}

assembly(input);

// --- Part Two ---

// As you congratulate yourself for a job well done, you notice that the documentation has been on
// the back of the tablet this entire time. While you actually got most of the instructions correct,
// there are a few key differences. This assembly code isn't about sound at all - it's meant to be
// run twice at the same time.

// Each running copy of the program has its own set of registers and follows the code independently
// - in fact, the programs don't even necessarily run at the same speed. To coordinate, they use the
// send (snd) and receive (rcv) instructions:

// snd X sends the value of X to the other program. These values wait in a queue until that program
// is ready to receive them. Each program has its own message queue, so a program can never receive
// a message it sent.

// rcv X receives the next value and stores it in register X. If no values are in the queue, the
// program waits for a value to be sent to it. Programs do not continue to the next instruction
// until they have received a value. Values are received in the order they are sent.

// Each program also has its own program ID (one 0 and the other 1); the register p should begin
// with this value.

// For example:

// snd 1
// snd 2
// snd p
// rcv a
// rcv b
// rcv c
// rcv d

// Both programs begin by sending three values to the other. Program 0 sends 1, 2, 0; program 1
// sends 1, 2, 1. Then, each program receives a value (both 1) and stores it in a, receives another
// value (both 2) and stores it in b, and then each receives the program ID of the other program
// (program 0 receives 1; program 1 receives 0) and stores it in c. Each program now sees a
// different value in its own copy of register c.

// Finally, both programs try to rcv a fourth time, but no data is waiting for either of them, and
// they reach a deadlock. When this happens, both programs terminate.

// It should be noted that it would be equally valid for the programs to run at different speeds;
// for example, program 0 might have sent all three values and then stopped at the first rcv before
// program 1 executed even its first instruction.

// Once both of your programs have terminated (regardless of what caused them to do so), how many
// times did program 1 send a value?


const duet = (instructions) => {
	let registers = [ {p:0}, {p:1} ];
	let queues = [ [], [] ];
	let isWaiting = [ false, false ]
	let indexes = [ 0, 0 ];
	let sentBy1 = 0;

	const operations = {
		snd: (frequency,program) => {
			if (program === 0) {
				queues[1].push(registers[0][frequency]);
			} else {
				queues[0].push(registers[1][frequency]);
				sentBy1++;
			}
		},
		set: (x,y,program) => registers[program][x] = isNaN(y) ? registers[program][y] : y,
		add: (x,y,program) => registers[program][x] = isNaN(y) ? registers[program][x] + registers[program][y] : registers[program][x] + y,
		mul: (x,y,program) => registers[program][x] = isNaN(y) ? registers[program][x] * registers[program][y] : registers[program][x] * y,
		mod: (x,y,program) => registers[program][x] = isNaN(y) ? registers[program][x] % registers[program][y] : registers[program][x] % y,
		rcv: (frequency,program) => {
			if (!queues[program].length) {
					isWaiting[program] = true;
				} else {
					let nextValue = queues[program].shift();
					registers[program][frequency] = nextValue;
				}
		},
		jgz: (x,y,program) => {
			let value = isNaN(x) ? registers[program][x] : x;
			if (value > 0) {
				indexes[program] = isNaN(y) ? indexes[program] + registers[program][y] : indexes[program] + y;
			} else indexes[program] ++;
		}
	}

	const evaluate = (program, index) => {
		let instruction = instructions[index];
		if (instruction[0] === 'jgz') {
			operations.jgz(instruction[1], instruction[2], program);
		} else {
			if (instruction[0] === 'rcv' || instruction[0] === 'snd') {
				operations[instruction[0]](instruction[1], program);
				if (isWaiting[program]) {
					return;
				}
			} else {
				operations[instruction[0]](instruction[1], instruction[2], program);
			}
			indexes[program]++;
		}
	}

	while (true) {
		while (!isWaiting[0]) {
			evaluate(0, indexes[0]);
		}
		while (!isWaiting[1]) {
			evaluate(1, indexes[1]);
		}
		if (!queues[0].length && !queues[1].length) {
			break;
		}
		isWaiting = [ false, false ];
	}


	console.log(`Program One sent ${sentBy1} values`);

};

duet(input);

