class Tile {
	row = []
	column = []
	block = []
	index
	values
	isPreSet = false
	element
	constructor(index, value) {
		this.index = index
		this.element = document.querySelectorAll("table#board td")[index]
		if (value) {
			this.values = [value]
			this.element.classList.add("original")
			this.element.textContent = value
			this.isPreSet = true
		} else {
			this.values = [1,2,3,4,5,6,7,8,9]
		}
	}
	linkColisioningTiles(board) {
		for (let row_i of colisions.row.find(row => row.includes(this.index)))
			if (row_i !== this.index) this.row.push(board.tiles[row_i])
		for (let column_i of colisions.column.find(column => column.includes(this.index)))
			if (column_i !== this.index) this.column.push(board.tiles[column_i])
		for (let block_i of colisions.block.find(block => block.includes(this.index)))
			if (block_i !== this.index) this.block.push(board.tiles[block_i])
	}
	value() {
		return (this.values.length === 1) ? this.values[0] : null
	}
	invalidate() {
		if (this.isPreSet) return 0

		let length = this.values.length
		var remove = otherValue => { if (otherValue) this.values = this.values.filter(v => v !== otherValue) }

		for (let other of this.row) remove(other.value())
		for (let other of this.column) remove(other.value())
		for (let other of this.block) remove(other.value())

		let changes = length - this.values.length
		if (changes) this.draw()
		return changes
	}
	singleOut() {
		if (this.isPreSet || this.values.length === 1) return false

		var setSingle = value => { 
			this.values = [value]
			this.draw()
		}

		for (let value of this.values) {
			var excludes = otherTile => !otherTile.values.includes(value)
			if (this.row.every(excludes)) { setSingle(value); return true }
			if (this.column.every(excludes)) { setSingle(value); return true }
			if (this.block.every(excludes)) { setSingle(value); return true }
		}
		return false
	}
	isValid() {
		if (this.isPreSet || this.values.length > 1) return true
		var isDifferent = otherTile => otherTile.value() !== this.value()
		return this.row.every(isDifferent) && this.column.every(isDifferent) && this.block.every(isDifferent)
	}
	draw() {
		if (this.isPreSet) return

		this.element.className = ""
		this.element.innerHTML = ""

		if (this.values.length === 1) {
			this.element.textContent = this.values[0]
			this.element.classList.add("single")
		} else {
			for (let v of this.values) this.element.innerHTML += `<span class='possible-${v}'>${v}</span>`
		}
	}
}


const colisions = {
	row: [
		[0,1,2,3,4,5,6,7,8],
		[9,10,11,12,13,14,15,16,17],
		[18,19,20,21,22,23,24,25,26],
		[27,28,29,30,31,32,33,34,35],
		[36,37,38,39,40,41,42,43,44],
		[45,46,47,48,49,50,51,52,53],
		[54,55,56,57,58,59,60,61,62],
		[63,64,65,66,67,68,69,70,71],
		[72,73,74,75,76,77,78,79,80]

	],
	column: [
		[0,9,18,27,36,45,54,63,72],
		[1,10,19,28,37,46,55,64,73],
		[2,11,20,29,38,47,56,65,74],
		[3,12,21,30,39,48,57,66,75],
		[4,13,22,31,40,49,58,67,76],
		[5,14,23,32,41,50,59,68,77],
		[6,15,24,33,42,51,60,69,78],
		[7,16,25,34,43,52,61,70,79],
		[8,17,26,35,44,53,62,71,80]
	],
	block: [
		[0,1,2,9,10,11,18,19,20],
		[3,4,5,12,13,14,21,22,23],
		[6,7,8,15,16,17,24,25,26],
		[27,28,29,36,37,38,45,46,47],
		[30,31,32,39,40,41,48,49,50],
		[33,34,35,42,43,44,51,52,53],
		[54,55,56,63,64,65,72,73,74],
		[57,58,59,66,67,68,75,76,77],
		[60,61,62,69,70,71,78,79,80]
	]
}