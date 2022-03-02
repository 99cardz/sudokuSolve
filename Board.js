class Board {
	tiles = []
	saves = []
	constructor(initString) {
		for (let index = 0; index < 81; index++) this.tiles.push(new Tile(index))

		if (initString) this.loadString(initString, true)
		else this.enableInput()

		this.eachTile(tile => tile.linkColisioningTiles(this))
		this.invalidate()
		this.draw()
	}
	iterateOnce() {
		this.invalidate()
		this.findSingles()
		if (this.isValid()) {
			this.split()
			return true
		} else {
			return this.loadLastSave()
		}
	}
	solve() {
		this.disableInput()
		while (!this.isSolved()) {
			if (!this.iterateOnce()) return false
		}
		return true
	}
	isSolved() {
		return this.tiles.every(tile => tile.values.length === 1)
	}
	isValid() {
		return this.tiles.every(tile => tile.isValid())
	}
	invalidate() {
		let changes = 0, pass
		do {
			pass = 0
			this.eachTile(tile => pass += tile.invalidate())
			changes += pass
		}
		while (pass)
		return changes
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
	enableInput() {
		this.eachTile(tile => tile.enableInput())
	}
	disableInput() {
		this.eachTile(tile => tile.disableInput())
	}
	loadLastSave() {
		if (this.saves.length === 0) return false

		this.loadString(this.saves.pop())
		this.invalidate()
		this.draw()
		return true
	}
	loadString(str, initial) {
		this.eachTile(tile => tile.setValue(Number(str[tile.index]), initial))
	}
	draw() {
		this.eachTile(tile => tile.draw())
	}
	eachTile(func) {
		for (let tile of this.tiles) func(tile)
	}
}