// import { valuePossible } from './modules/validate.js'



function invalidatePossibleValues(referenceBoard) {

    changeCount = 0

    for (i = 0; i < 81; i++) {

        let tile = board[i]


        if (typeof tile === 'number') continue // is set
        if (tile.length === 1) continue // only one is possible

        // remove value if not possible anymore
        for (let v of tile) {
            if (valuePossible(v, i, referenceBoard) == false) {
                // console.log(`removeing ${v} from ${tile} at index ${i}`)
                tile.splice(tile.indexOf(v), 1)
                changeCount++
            }
        }
    }
    return changeCount
}

function findSingles(referenceBoard) {


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