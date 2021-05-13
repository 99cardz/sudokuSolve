function drawBoard(backtrack = false) {

    let table = document.querySelector('table#board')
    table.style.display = 'none'

    let i = 0;
    for (cube of allCubes) {
        let tile = board[i]
        i++


        cube.classList.remove('changed')
        cube.classList.remove('backtracked')
        if (cube.dataset.content == tile) continue // nothing changed

        
        // clear cube
        cube.innerHTML = ''
        cube.className = ''

        if (typeof tile === 'number') {
            cube.textContent = tile
            cube.classList.add('original')
        } else {
            if (tile.length === 1) {
                cube.textContent = tile[0]
                cube.classList.add('single')
            } else {
                for (let possibleValue of tile) {
                    let span = document.createElement('span')
                    span.textContent = possibleValue
                    span.classList.add(`possible-${possibleValue}`)
                    cube.appendChild(span)
                }
            }
            
        }

        if (cube.dataset.content !== undefined) cube.classList.add('changed')
        if (backtrack) cube.classList.add('backtracked')
    
        cube.dataset.content = tile

        
    }

    
    table.style.display = 'block'


}

function clearBoard() {

    
    console.log('clearing board')


    board = [...Array(81)].map(x => [1,2,3,4,5,6,7,8,9])
    possibleBoards = [board]

    drawBoard()
    drawBoard()
}

function resetBoard() {

    for (let tile of board) {
        console.log(typeof tile)
        if (typeof tile === 'object') tile = [1,2,3,4,5,6,7,8,9]
    }

    let referenceBoard = JSON.parse(JSON.stringify(board))

    invalidatePossibleValues(referenceBoard)

    drawBoard()
}