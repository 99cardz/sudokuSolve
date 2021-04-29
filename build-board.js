

let board = document.querySelector('#board')

for (let i = 0; i < 9; i++) {
    let tr = document.createElement('tr')
    for (let i = 0; i < 9; i++) {
        tr.appendChild(document.createElement('th'))
    }
    board.appendChild(tr)
}

