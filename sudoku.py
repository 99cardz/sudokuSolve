#!/usr/bin/env python3
import json

def get_board_from_file():
    with open('sudoku.txt') as f:
        board = [int(char) for char in f.read() if char.isdigit()]
    if len(board) != 81:
        raise Exception("board not valid")
    return board

def is_valid(board, position, value):
    if value in board[position % 9 :: 9]:
        return False # in vertical
        
    if value in board[position // 9 * 9 : position // 9 * 9 + 9]:
        return False # in horizontal
        
    board_positions = [i for i in range(81)]
    for chunk_start in [0,3,6,27,30,33,54,57,60]:
        chunk_positions = board_positions[chunk_start:chunk_start+3] + board_positions[chunk_start+9:chunk_start+12] + board_positions[chunk_start+18:chunk_start+21]
        if position in chunk_positions:
            for pos in chunk_positions:
                if value == board[pos]:
                    return False # in 3x3 chunk
            return True # is valid


positions = [i for i in range(81)]
def get_conflicting(pos):

    vertical = positions[pos % 9 :: 9] # vertical

    horizontal = positions[pos // 9 * 9 : pos // 9 * 9 + 9] # horizontal

    for chunk_start in [0,3,6,27,30,33,54,57,60]:
        chunk_positions = positions[chunk_start:chunk_start+3] + positions[chunk_start+9:chunk_start+12] + positions[chunk_start+18:chunk_start+21]
        if pos in chunk_positions:
            chunk = chunk_positions # 3x3 chunk
            break

    # clean
    vertical.remove(pos)
    horizontal.remove(pos)
    chunk.remove(pos)

    return {'v': vertical, 'h': horizontal, 'c': chunk}


if __name__ == '__main__':

    
    # get board
    # board = get_board_from_file()
    # print(board)
    
    # print(is_valid(board, 0, 4))

    out = []

    for pos in [i for i in range(81)]:
        out.append(get_conflicting(pos))

    with open('conflicting.json', "w") as f:
        f.write(json.dumps(out, indent=1))
