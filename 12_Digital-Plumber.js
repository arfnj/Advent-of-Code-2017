// Walking along the memory banks of the stream, you find a small village that is experiencing a
// little confusion: some programs can't communicate with each other.

// Programs in this village communicate using a fixed system of pipes. Messages are passed between
// programs using these pipes, but most programs aren't connected to each other directly. Instead,
// programs pass messages between each other until the message reaches the intended recipient.

// For some reason, though, some of these messages aren't ever reaching their intended recipient,
// and the programs suspect that some pipes are missing. They would like you to investigate.

// You walk through the village and record the ID of each program and the IDs with which it can
// communicate directly (your puzzle input). Each program has one or more programs with which it can
// communicate, and these pipes are bidirectional; if 8 says it can communicate with 11, then 11
// will say it can communicate with 8.

// You need to figure out how many programs are in the group that contains program ID 0.

// For example, suppose you go door-to-door like a travelling salesman and record the following list:

// 0 <-> 2
// 1 <-> 1
// 2 <-> 0, 3, 4
// 3 <-> 2, 4
// 4 <-> 2, 3, 6
// 5 <-> 6
// 6 <-> 4, 5
// In this example, the following programs are in the group that contains program ID 0:

// Program 0 by definition.
// Program 2, directly connected to program 0.
// Program 3 via program 2.
// Program 4 via program 2.
// Program 5 via programs 6, then 4, then 2.
// Program 6 via programs 4, then 2.

// Therefore, a total of 6 programs are in this group; all but program 1, which has a pipe that
// connects it to itself.

// How many programs are in the group that contains program ID 0?

const input = require('./12_input.js');

const test = `0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5`;

// function Graph() {
// 	this.vertices = [];
// 	this.edges = [];
// };

// Graph.prototype.addNode = function(vertex,edges) {
// 	this.vertices.push(vertex);
// 	this.edges[vertex] = edges;
// };

// Graph.prototype.report = function() {
// 	console.log(`${this.vertices.length} vertices`);
// 	console.log('Node 0:', this.vertices[0], this.edges[0]);
// };

class Graph {

	constructor() {
		this.vertices = [];
		this.edges = [];
	}

	addNode(vertex,edges) {
		this.vertices.push(vertex);
		this.edges[vertex] = edges;
	}

	report() {
		console.log(`${this.vertices.length} vertices`);
		console.log('Node 0:', this.vertices[0], this.edges[0]);
	}

	findLinks(target,visited,tracker,current,previous) {
		// console.log(current,this.edges[current]);
		if (current === target || tracker.has(current) || this.edges[current].includes(target)) {
			// console.log('match', current === target, tracker.has(current), this.edges[current].includes(target))
			let wins = new Set([current,...this.edges[current],...visited])
			wins.forEach(win => tracker.add(win));
			return;
		}
		// if (visited.includes(current) || deadEnds.has(current)) {
		// 	// console.log('fail', current);
		// 	// let baddies = new Set(visited.slice(visited.indexOf(current)));
		// 	let baddies = new Set([current, ...visited]);
		// 	let logged = false;
		// 	for (let dud of baddies) {
		// 		if (deadEnds.has(dud)) {
		// 			logged = true;
		// 		} else deadEnds.add(dud);
		// 	}
		// 	this.loops = logged ? this.loops : this.loops+1;
		// 	return;
		// }
		// console.log('mystery');
		visited.push(current);
		this.edges[current].forEach(edge => {
			if (edge !== previous) {
				this.findLinks(target,visited,tracker,edge,current);
			}
		});
	}

	findLoops(current,deadEnds,baddies,visited) {
		if (deadEnds.has(current)) return;
		if (visited.includes(current)) {
			visited.forEach(node => deadEnds.add(node));
			// console.log(current,Math.min(...visited),visited);
			baddies.add(Math.min(...visited));
			return;
		}
		visited.push(current);
		this.edges[current].forEach(edge => this.findLoops(edge,deadEnds,baddies,visited));
	}

}


(() => {
	const arrays = input
		.split('\n')
		.map(line => line.split(' <-> '))
		.map(pair => {
			const edges = pair[1].split(', ').map(edge => Number(edge));
			return [ Number(pair[0]), edges ];
		});
	let matches = new Set();
	let deadEnds = new Set();
	let baddies = new Set();
	let graph = new Graph();
	arrays.forEach(pair => graph.addNode(pair[0],pair[1]));
	graph.vertices.forEach(vertex => 	graph.findLinks(0,[],matches,vertex,null));
	console.log('Part one answer:', matches.size);
	graph.vertices.forEach(vertex => {
		if (!matches.has(vertex)) {
			graph.findLoops(vertex,deadEnds,baddies,[]);
		}
	})
	console.log('Part two answer:', baddies.size + 1);
})();

// --- Part Two ---

// There are more programs than just the ones in the group containing program ID 0. The rest of them
// have no way of reaching that group, and still might have no way of reaching each other.

// A group is a collection of programs that can all communicate via pipes either directly or
// indirectly. The programs you identified just a moment ago are all part of the same group. Now,
// they would like you to determine the total number of groups.

// In the example above, there were 2 groups: one consisting of programs 0,2,3,4,5,6, and the other
// consisting solely of program 1.

// How many groups are there in total?