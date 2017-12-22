// You come upon a very unusual sight; a group of programs here appear to be dancing.

// There are sixteen programs in total, named a through p. They start by standing in a line: a
// stands in position 0, b stands in position 1, and so on until p, which stands in position 15.

// The programs' dance consists of a sequence of dance moves:

// Spin, written sX, makes X programs move from the end to the front, but maintain their order
// otherwise. (For example, s3 on abcde produces cdeab).

// Exchange, written xA/B, makes the programs at positions A and B swap places.

// Partner, written pA/B, makes the programs named A and B swap places.

// For example, with only five programs standing in a line (abcde), they could do the following
// dance:

// s1, a spin of size 1: eabcd.
// x3/4, swapping the last two programs: eabdc.
// pe/b, swapping programs e and b: baedc.
// After finishing their dance, the programs end up in order baedc.

// You watch the dance for a while and record their dance moves (your puzzle input). In what order
// are the programs standing after their dance?

const dance = require('./16_input.js');
// const dance = [['s','1'],['x','3','4'],['p','e','b']];

let programs = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'];
const startingPosition = 'abcdefghijklmnop';
// let programs = ['a','b','c','d','e'];

const moves = {
	s: (num) => {
		let front = programs.splice(-1*Number(num));
		programs = front.concat(programs);
	},
	x: (a,b) => [ programs[Number(a)], programs[Number(b)] ] = [ programs[Number(b)], programs[Number(a)] ],
	p: (a,b) => {
		const aIndex = programs.indexOf(a);
		const bIndex = programs.indexOf(b);
		[ programs[aIndex], programs[bIndex] ] = [ programs[bIndex], programs[aIndex] ];
	}
};

const startDancing = (reps) => {
	let actual = reps%30;
	for (let i=1; i<=actual; i++) {
		dance.forEach(step => {
			if (step[0] === 's') {
				moves.s(step[1]);
			} else moves[step[0]](step[1],step[2]);
		});
		if (programs.join('') === 'abcdefghijklmnop') {
			console.log(`Cycle after ${i} iterations.`);
			break;
		}

	}
	console.log(programs.join(''));
}

startDancing(1);

// Now that you're starting to get a feel for the dance moves, you turn your attention to the dance
// as a whole.

// Keeping the positions they ended up in from their previous dance, the programs perform it again
// and again: including the first dance, a total of one billion (1000000000) times.

// In the example above, their second dance would begin with the order baedc, and use the same dance
// moves:

// s1, a spin of size 1: cbaed.
// x3/4, swapping the last two programs: cbade.
// pe/b, swapping programs e and b: ceadb.
// In what order are the programs standing after their billion dances?

startDancing(999999999);



