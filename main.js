var board;

async function main() {
	board = new Board(await fetch("sudoku.txt").then(r => r.text()))
}
window.addEventListener("load", main)