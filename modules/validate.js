


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