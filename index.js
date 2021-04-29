var board = [];
var allCubes;
var conflicting;
var possibleBoards = []
var interval = 50

async function main() {
    let rawBoard = await fetch('sudoku.txt').then(r => r.text())

    conflicting = await fetch('conflicting.json').then(r => r.json())
    

    // build board
    for (let char of rawBoard) {
        if (char >= '1' && char <= '9') {
            board.push(Number(char))
        } else if (char == '0') {
            board.push([])
        }

        if (board.length === 81) break
    }

    

    // insert possible values
    let referenceBoard = board.valueOf()
    for (i = 0; i < 81; i++) {
        let tile = board[i]

        if (typeof tile === 'number') continue
        
        for (v = 1; v < 10; v++) {
            if (valuePossible(v, i, referenceBoard)) tile.push(v)
        }
        
    }

    

    possibleBoards.push(board.valueOf())

    

    allCubes = document.querySelectorAll('table#board td')

    if (!boardValid()) {
        console.error('board invalid')
    }

    drawBoard()


    

}
window.addEventListener('load', main)


function solve() {


    




    let changes = 0;

    // invalidate Board until no changes can be made
    changes += invalidatePossibleValues()

    // find positions where only one value can be
    changes += findSingles()


    drawBoard()


    
    if (changes) {
        console.log(`changes: ${changes}`)
        setTimeout(solve, interval)
        return
    }



    if (boardValid()) {
        let finished = true
        for (let tile of board) {
            
            if (typeof tile === 'number') continue
            if (tile.length === 1) continue

            if (tile.length > 1) {
                finished = false
                break
            }
        }
        if (finished) {
            // board is solved!!
            console.log(`solved board`)
            drawBoard()
            return 
        }
    } else {
        
        possibleBoards.shift()

        if (possibleBoards.length === 0) {
            console.log('board has no possible solutions!')
            return
        }

        console.log('going to next possible board')
        // go to the next possible board
        board = [...possibleBoards[0]]


        drawBoard(backtrack = true)
        setTimeout(solve, interval)
        return
    }

    

    // if we made 0 changes and the board is valid, get new possible boards


    console.log('brute forcing')
    // find the next best position to start brute Forcing
    for (let s = 2; s < 9; s++) {
        for (let i = 0; i < 81; i++) {


            let tile = board[i]
    
            if (typeof tile === 'number') continue
            if (tile.length === 1) continue
            if (tile.length > s) continue

            // we found the smallest
            console.log(`smallest found at index ${i}, with ${tile.length} possible`)

            possibleBoards.shift()
            

            for (let possibleValue of tile) {
                let currentBoard = JSON.parse(JSON.stringify(board))
                
                currentBoard[i] = [possibleValue]
                possibleBoards.push(currentBoard)
            }

            // console.log(`possible Boards: ${possibleBoards.length}`)
    
            
            board = possibleBoards[0].valueOf()
    
            setTimeout(solve, interval)
            return
    
        }
    }



}

function drawBoard(backtrack = false) {
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
            cube.innerText = tile
            cube.className = 'original'
        } else {
            if (tile.length === 1) {
                cube.innerText = tile[0]
                cube.className = 'single'
            } else {
                for (let possibleValue of tile) {
                    let span = document.createElement('span')
                    span.innerText = possibleValue
                    span.className = `possible-${possibleValue}`
                    cube.appendChild(span)
                }
            }
            
        }

        if (cube.dataset.content !== undefined) cube.classList.add('changed')
        if (backtrack) cube.classList.add('backtracked')
        cube.dataset.content = tile

        
    }
}

function invalidatePossibleValues() {

    changeCount = 0

    let referenceBoard = board.valueOf() // compare the values to the same reference

    for (i = 0; i < 81; i++) {

        let tile = board[i]

        if (typeof tile === 'number') continue // is set
        if (tile.length === 1) continue // only one is possible

        // remove value if not possible anymore
        for (let v of tile) {
            if (valuePossible(v, i, referenceBoard) == false) {
                tile.splice(tile.indexOf(v), 1)
                changeCount++
            }
        }
    }
    return changeCount
}

function findSingles() {

    let referenceBoard = board.valueOf()

    let changeCount = 0

    tile:
    for (let i = 0; i < 81; i++) {
        let tile = referenceBoard[i]
        let tileConfliction = conflicting[i]

        if (typeof tile === 'number') continue
        if (tile.length === 1) continue


        let allV = []
        for (let pos of tileConfliction.v) {
            
            allV = allV.concat(referenceBoard[pos])
        }

        let allH = []
        for (let pos of tileConfliction.h) allH = allH.concat(referenceBoard[pos])

        let allC = []
        for (let pos of tileConfliction.c) allC = allC.concat(referenceBoard[pos])
        
        
        
        // console.log(allV, allH, allC)
        for (let possibleValue of tile) {
            if (!allV.includes(possibleValue)) {
                // only possible in vertical
                board[i] = [possibleValue]
                changeCount++
                continue tile
            }
            if (!allH.includes(possibleValue)) {
                // only possible in horizontal
                board[i] = [possibleValue]
                changeCount++
                continue tile
            }
            if (!allC.includes(possibleValue)) {
                // only possible in chunk
                board[i] = [possibleValue]
                changeCount++
                continue tile
            }
        }
        

    }
    return changeCount
}

function valuePossible(v, i, referenceBoard) {

    // get all conflicting positions
    let positions = conflicting[i].v.concat(conflicting[i].h).concat(conflicting[i].c)

    for (let pos of positions) {

        let conflictingTile = referenceBoard[pos]
        let conflictingValue;
        if (typeof conflictingTile === 'number') conflictingValue = conflictingTile
        else if (conflictingTile.length === 1) conflictingValue = conflictingTile[0]

        if (v === conflictingValue) return false
    }
    return true
}

function boardValid() {
    for (i = 0; i < 81; i++) {

        let value;
        let tile = board[i]
        
        if (typeof tile === 'number') value = tile
        else if (tile.length === 1) value = tile[0]

        if (value) if (!valuePossible(value, i, board)) return false
    }
    return true
}