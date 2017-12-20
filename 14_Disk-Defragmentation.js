// Suddenly, a scheduled job activates the system's disk defragmenter. Were the situation different,
// you might sit and watch it for a while, but today, you just don't have that kind of time. It's
// soaking up valuable system resources that are needed elsewhere, and so the only option is to help
// it finish its task as soon as possible.

// The disk in question consists of a 128x128 grid; each square of the grid is either free or used.
// On this disk, the state of the grid is tracked by the bits in a sequence of knot hashes.

// A total of 128 knot hashes are calculated, each corresponding to a single row in the grid; each
// hash contains 128 bits which correspond to individual grid squares. Each bit of a hash indicates
// whether that square is free (0) or used (1).

// The hash inputs are a key string (your puzzle input), a dash, and a number from 0 to 127
// corresponding to the row. For example, if your key string were flqrgnkx, then the first row would
// be given by the bits of the knot hash of flqrgnkx-0, the second row from the bits of the knot
// hash of flqrgnkx-1, and so on until the last row, flqrgnkx-127.

// The output of a knot hash is traditionally represented by 32 hexadecimal digits; each of these
// digits correspond to 4 bits, for a total of 4 * 32 = 128 bits. To convert to bits, turn each
// hexadecimal digit to its equivalent binary value, high-bit first: 0 becomes 0000, 1 becomes 0001,
// e becomes 1110, f becomes 1111, and so on; a hash that begins with a0c2017... in hexadecimal
// would begin with 10100000110000100000000101110000... in binary.

// Continuing this process, the first 8 rows and columns for key flqrgnkx appear as follows, using #
// to denote used squares, and . to denote free ones:

// ##.#.#..-->
// .#.#.#.#   
// ....#.#.   
// #.#.##.#   
// .##.#...   
// ##..#..#   
// .#...#..   
// ##.#.##.-->
// |      |   
// V      V   
// In this example, 8108 squares are used across the entire 128x128 grid.

// Given your actual key string, how many squares are used?

// Your puzzle input is ffayrhll.

const input = 'ffayrhll-';

const reverser = (list,startIndex,count) => {
	let left = startIndex;
	let right = startIndex + count - 1;
	while (left < right) {
		let leftTarget = left%list.length;
		let rightTarget = right%list.length;
		[ list[leftTarget], list[rightTarget] ] = [ list[rightTarget], list[leftTarget] ]
		left ++;
		right --;
	}
};

const knotMaker = (input) => {
	const newSeq = input.split('').map(char => char.charCodeAt());
	newSeq.push(17,31,73,47,23);
	let list = [];
		for (let i=0; i<=255; i++) {
		list[i] = i;
	}
	let skipSize = 0;
	let position = 0;
	for (let i=1; i<=64; i++) {
		newSeq.forEach(len => {
			reverser(list,position,len);
			position = (position + len + skipSize)%list.length;
			skipSize++;
		})
	}
	let dense = [];
	while (list.length) {
		dense.push(list.splice(0,16));
	}
	dense = dense.map(sixteenth => sixteenth.reduce((a,b) => a^b,0));
	return dense.reduce((knot,num) => {
		let hex = num.toString(16);
		return hex.length === 2 ? knot + hex : knot + '0' + hex;
	},'');
};

(() => {
	let ones = 0;
	for (let i=0; i<128; i++) {
		let hashInput = input + i;
		const hash = knotMaker(hashInput);
		for (let bit of hash) {
			const dec = parseInt(bit,16);
			let bin = dec.toString(2).split('');
			bin.unshift('0','0','0');
			bin = bin.slice(-4);
			ones += bin.filter(bit => bit === '1').length;
		}
	}
	console.log(ones);
})();
