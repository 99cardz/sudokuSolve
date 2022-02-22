class Board {
	tiles = []
	saves = []
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

		if (this.isSolved()) return

		if (!this.isValid()) {
			console.log(`bord not valid anymore, going back to save`)
			if (!this.loadLastSave()) {
				console.log(`no solution`)
				return
			}
		} else {
			this.split()
		}
		this.solve()
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
		if (changes) this.invalidate() // invalidate as long as we can
	}
	findSingles() {
		let changes = 0
		for (let tile of this.tiles) changes += tile.singleOut()
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
		
		console.log(`splitting bloard at index ${smallest.index} into ${smallest.values.length}  boards`)
			
		let first = smallest.values[0]
		for (let value of smallest.values.splice(1)) {
			smallest.values = [value]
			this.saves.push(this.toString())
		}
		smallest.values = [first]
		smallest.draw()
	}
	toString() {
		let str = ""
		for (let tile of this.tiles) str += tile.value()
		return str
	}
	loadLastSave() {
		if (this.saves.length === 0) return false
		for (let tile of this.tiles) {
			let value = Number(str[tile.index])
			tile.values = value ? [value] : [1,2,3,4,5,6,7,8,9]
		}
		this.invalidate()
		this.draw()
		return true
	}
	draw() {
		for (let tile of this.tiles) tile.draw()
	}

}