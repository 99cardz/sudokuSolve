
function enableBoardInput() {
    

    // add click-event to possible values
    for (let span of document.querySelectorAll('table#board span')) {
        span.addEventListener('click', setValueClick)
        span.classList.add('choose-number')
    }

    document.querySelector('table#board').classList.add('input-enabled')

}

function disableBoardInput() {

    document.querySelector('table#board').classList.remove('input-enabled')

}

let setValueClick = (event) => {

    
    

    let span = event.target
    // let tile = span.parentElement
    let index = Number(span.parentElement.dataset.index)
    
    let number = span.innerText

    board[index] = Number(number)

    console.log(`setting position ${index} to ${number}`)

    console.log(board[1])

    let referenceBoard = JSON.parse(JSON.stringify(board))
    
    invalidatePossibleValues(referenceBoard)
    console.log(board[1])
    // findSingles(referenceBoard)
    drawBoard()

    enableBoardInput()


    // let nextIndex = index == 80 ? 0 : index+1
    // let nextTile = document.querySelectorAll('table#board td')[nextIndex]

    // let blank = document.createElement('span')
    // blank.style.display = 'none'
    // nextTile.appendChild(blank)
    // blank.remove()

    // console.log(nextTile)
}




















function fillPossibleValuesInput() {

    boardInput = true


    let i = 0
    for (let cube of allCubes) {

        cube.dataset.index = i
        let tile = board[i]
        i++

        if (typeof tile === 'number') continue
        if (tile.length === 0) {
            for (let v = 1; v < 10; v++) {
                if (valuePossible(v, cube.dataset.index, board)) {
                    let span = document.createElement('span')
                    span.classList.add('choose-number', `possible-${v}`)
                    span.innerText = v
        
                    span.addEventListener('click', setValueClick)
        
                    cube.appendChild(span)
                }
            }
        } else {

            cube.innerHTML = ''

            for (let value of tile) {
                if (valuePossible(value, cube.dataset.index, board)) {
                    let span = document.createElement('span')
                    span.classList.add('choose-number', `possible-${value}`)
                    span.innerText = value
        
                    span.addEventListener('click', setValueClick)
        
                    cube.appendChild(span)
                }
            }
        }


        
    }
}