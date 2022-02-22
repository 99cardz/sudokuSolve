class Board {
	tiles = [];

	constructor(initString) {
		let index = 0;
		for (let char of initString) {
			if (char >= '0' && char <= '9') this.tiles.push(new Tile(index++, Number(char)))
			if (index > 80) break
		}

		for (let tile of this.tiles) tile.linkColisioningTiles(this)

		this.invalidate()
	}
	solve() {
		this.invalidate()
		this.findSingles()
		if (this.isSolved()) {
			console.log(`solved board`)
			return
		}
		console.log(`board is ${this.isValid() ? "valid" : "invalid"}`);
		this.split()
	}
	isSolved() {
		return this.tiles.every((tile) => tile.values.length === 1)
	}
	isValid() {
		return this.tiles.every(tile => tile.isValid())
	}
	invalidate() {
		let changes = 0
		for (let tile of this.tiles) changes += tile.invalidate() 
		console.log(`invalidated ${changes} values`)
		if (changes) this.invalidate() // invalidate as long as we can
	}
	findSingles() {
		let changes = 0
		for (let tile of this.tiles) changes += tile.singleOut()
		console.log(`found ${changes} single possible values`)
		if (changes) { 
			this.invalidate()
			this.findSingles() // find as long as we can
		}
	}
	split() {
		if (this.isSolved()) return
		let smallest
		for (let count = 2; count <= 9 && !smallest; count++)
			smallest = this.tiles.find((tile) => tile.values.length <= count && tile.values.length > 1)
		
		console.log(`found smallest at index ${smallest.index} with possible values: ${smallest.values}`)

		// test

		smallest.values = [smallest.values[1]]
		smallest.draw()
	}
}

function copyInstance (original) {
	return Object.assign(Object.create(Object.getPrototypeOf(original)), original)
}