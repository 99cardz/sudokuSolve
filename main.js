

var board = [...Array(81)].map(x => [1,2,3,4,5,6,7,8,9]);
var allCubes;

var possibleBoards = []
var interval = 50
var conflicting;

async function main() {
    let rawBoard = await fetch('sudoku.txt').then(r => r.text())

    conflicting = await fetch('conflicting.json').then(r => r.json())
    

    // build board
    let i = 0
    for (let char of rawBoard) {
        if (i > 80) break

        if (char >= '1' && char <= '9') {
            board[i] = Number(char)
            i++
        } else if (char == '0') {
            i++
        }
    }
    while (true) {
        let referenceBoard = JSON.parse(JSON.stringify(board))
        let changes = 0

        changes += invalidatePossibleValues(referenceBoard)
        changes += findSingles(referenceBoard)

        if (changes === 0) break
    }
    

    

    allCubes = document.querySelectorAll('table#board td')

    if (!boardValid()) {
        console.error('board invalid')
    }

    drawBoard()
    i = 0;
    for (cube of allCubes) {
        cube.dataset.index = i
        i++
    }


    // enableBoardInput()
    

}
window.addEventListener('load', main)





function solve() {

    let referenceBoard = JSON.parse(JSON.stringify(board))


    let changes = 0;

    // invalidate Board until no changes can be made
    changes += invalidatePossibleValues(referenceBoard)

    // find positions where only one value can be
    changes += findSingles(referenceBoard)


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




