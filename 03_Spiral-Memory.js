// You come across an experimental new kind of memory stored on an infinite two-dimensional grid.

// Each square on the grid is allocated in a spiral pattern starting at a location marked 1 and then
// counting up while spiraling outward. For example, the first few squares are allocated like this:

// 17  16  15  14  13
// 18   5   4   3  12
// 19   6   1   2  11
// 20   7   8   9  10
// 21  22  23---> ...

// While this is very space-efficient (no squares are skipped), requested data must be carried back
// to square 1 (the location of the only access port for this memory system) by programs that can
// only move up, down, left, or right. They always take the shortest path: the Manhattan Distance
// between the location of the data and square 1.

// For example:

// Data from square 1 is carried 0 steps, since it's at the access port.
// Data from square 12 is carried 3 steps, such as: down, left, left.
// Data from square 23 is carried only 2 steps: up twice.
// Data from square 1024 must be carried 31 steps.

// How many steps are required to carry the data from the square identified in your puzzle input all
// the way to the access port?

// Your puzzle input is 277678.

// const squareFinder = target => {
// 	let square = 1;
// 	let i = -1;
// 	while (square<target) {
// 		i += 2
// 		square = i*i;
// 	}
// 	return i;
// }

const squareFinder = target => Math.ceil(Math.sqrt(target))%2 ? Math.ceil(Math.sqrt(target)) : Math.ceil(Math.sqrt(target)) + 1;

const distance = target => {
	let square = squareFinder(target);
	let center = Math.floor(square/2);
	const rangeStart = (square-2) * (square-2) + 1;
	let upperRight = rangeStart + square - 2;
	let upperLeft = upperRight + square - 1;
	let lowerLeft = upperLeft + square -1;
	if (target >= lowerLeft) {
		return Math.abs(target - (lowerLeft+center)) + center;
	}
	if (target >= upperLeft) {
		return Math.abs(target - (upperLeft+center)) + center;
	}
	if (target >= upperRight) {
		return Math.abs(target - (upperRight+center)) + center;
	}
	return Math.abs(target - (rangeStart-1+center)) + center;
}

// --- Part Two ---

// As a stress test on the system, the programs here clear the grid and then store the value 1 in
// square 1. Then, in the same allocation order as shown above, they store the sum of the values in
// all adjacent squares, including diagonals.

// So, the first few squares' values are chosen as follows:

// Square 1 starts with the value 1.
// Square 2 has only one adjacent filled square (with value 1), so it also stores 1.
// Square 3 has both of the above squares as neighbors and stores the sum of their values, 2.
// Square 4 has all three of the aforementioned squares as neighbors and stores the sum of their values, 4.
// Square 5 only has the first and fourth squares as neighbors, so it gets the value 5.

// Once a square is written, its value does not change. Therefore, the first few squares would
// receive the following values:

// 147  142  133  122   59
// 304    5    4    2   57
// 330   10    1    1   54
// 351   11   23   25   26
// 362  747  806--->   ...
// What is the first value written that is larger than your puzzle input?

// Your puzzle input is still 277678.

const stressTest = target => {
	const square = squareFinder(target);
	const center = Math.floor(square/2);
	let matrix = [];
	let found = false;
	let index = 1;
	let response;
	let origin = {row: center, col: center+1};

	const adder = (row,col) => {
		let sum = 0;
		sum = matrix[row-1][col] ? sum+=matrix[row-1][col] : sum;
		sum = matrix[row+1][col] ? sum+=matrix[row+1][col] : sum;
		sum = matrix[row][col-1] ? sum+=matrix[row][col-1] : sum;
		sum = matrix[row][col+1] ? sum+=matrix[row][col+1] : sum;
		sum = matrix[row-1][col-1] ? sum+=matrix[row-1][col-1] : sum;
		sum = matrix[row+1][col-1] ? sum+=matrix[row+1][col-1] : sum;
		sum = matrix[row-1][col+1] ? sum+=matrix[row-1][col+1] : sum;
		sum = matrix[row+1][col+1] ? sum+=matrix[row+1][col+1] : sum;
		return sum;
	}

	const pathMaker = (index,startRow,startCol) => {
		const steps = 2*index;
		for (let i=0; i<steps; i++) {
			matrix[startRow+i][startCol] = adder(startRow+i,startCol);
			if (matrix[startRow][startCol+i] > target) {
				found = true;
				response = matrix[startRow][startCol+i];
				break;
			}
		}
		if (!found) {
			for (let i=0; i<steps; i++) {
				matrix[startRow+steps-1][startCol-1-i] = adder(startRow+steps-1,startCol-1-i);
				if (matrix[startRow+steps-1][startCol-1-i] > target) {
					found = true;
					response = matrix[startRow+steps-1][startCol-1-i];
					break;
				}
			}
		}
		if (!found) {
			for (let i=0; i<steps; i++) {
				matrix[startRow+steps-2-i][startCol-steps] = adder(startRow+steps-2-i,startCol-steps);
				if (matrix[startRow+steps-2-i][startCol-steps] > target) {
					found = true;
					response = matrix[startRow+steps-2-i][startCol-steps];
					break;
				}
			}
		}
		if (!found) {
			for (let i=0; i<steps; i++) {
				matrix[startRow-1][startCol-steps+1+i] = adder(startRow-1,startCol-steps+1+i);
				if (matrix[startRow-1][startCol-steps+1+i] > target) {
					found = true;
					response = matrix[startRow-1][startCol-steps+1+i];
				}
 			}
		}
		return [startRow-1,startCol+1];
	}

	for (let i = 0; i < square; i++) {
		matrix.push(new Array(square));
	}
	matrix[center][center] = 1;

	while (!found) {
		[ origin.row, origin.col ] = pathMaker(index,origin.row,origin.col);
		index++;
	}

	return response;
	
}
