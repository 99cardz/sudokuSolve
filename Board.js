class Board {
	tiles = []
	saves = []
	constructor(initString) {
		let index = 0;
		for (let char of initString) {
			if (char >= '0' && char <= '9') this.tiles.push(new Tile(index++, Number(char)))
			if (index > 80) break
		}

		this.eachTile(tile => tile.linkColisioningTiles(this))
		this.invalidate()
	}
	solve() {
		while (!this.isSolved()) {
			this.invalidate()
			this.findSingles()
			if (this.isValid()) this.split()
			else if (!this.loadLastSave()) return false
		}
		return true
	}
	isSolved() {
		return this.tiles.every(tile => tile.values.length === 1)
	}
	isValid() {
		return this.tiles.every(tile => tile.isValid())
	}
	invalidate(previous = 0) {
		let changes = 0
		this.eachTile(tile => changes += tile.invalidate())
		if (changes) this.invalidate(previous + changes) // invalidate as long as we can
		return previous + changes
	}
	findSingles() {
		let changes = 0
		while (this.tiles.find(tile => tile.singleOut())) {
			this.invalidate()
			changes++
		}
		return changes
	}
	split() {
		if (this.isSolved() || !this.isValid()) return

		let smallest
		for (let count = 2; count <= 9 && !smallest; count++)
			smallest = this.tiles.find(tile => tile.values.length <= count && tile.values.length > 1)
			
		let first = smallest.values[0]
		for (let value of smallest.values.splice(1)) {
			smallest.values = [value]
			this.saves.push(this.toString())
		}
		smallest.values = [first]
		smallest.draw()
	}
	toString() {
		return this.tiles.map(tile => tile.value()).join("")
	}
	loadLastSave() {
		if (this.saves.length === 0) return false

		let save = this.saves.pop()
		this.eachTile(tile => {
			let value = Number(save[tile.index])
			tile.values = value ? [value] : [1,2,3,4,5,6,7,8,9]
		})
		this.invalidate()
		this.draw()
		return true
	}
	draw() {
		this.eachTile(tile => tile.draw())
	}
	eachTile(func) {
		for (let tile of this.tiles) func(tile)
	}
}