const isMine = (myColor, piece) => {
    return (myColor === piece[0])
}

const scanTile = (arr, board, myColor, c, r, cdelta, rdelta) => {
    const cc = c + cdelta
    const rr = r + rdelta
    if (cc >= 1 && cc <= 8 && rr >= 1 && rr <= 8) {
        const tile = `${cc}${rr}`;
        const piece = board[tile];
        if (piece) {
            if (!isMine(myColor, piece)) {
                arr.push(tile)
            }
        } else {
            arr.push(tile)
        }
    }
}

const scanRow = (arr, board, myColor, c, r, cdelta, rdelta) => {
    for (let cc = c + cdelta, rr = r + rdelta; cc >= 1 && cc <= 8 && rr >= 1 && rr <= 8; cc += cdelta, rr += rdelta) {
        const tile = `${cc}${rr}`;
        const piece = board[tile];
        if (piece) {
            if (!isMine(myColor, piece)) {
                arr.push(tile)
            }
            break
        } else {
            arr.push(tile)
        }
    }
}

const getBoard = (pieces, turn) => {
    const board = {}
    Object.entries(pieces).forEach((p) => {
        const maxTurn = Object.keys(p[1]).reduce((p, c) => {
            const ci = parseInt(c)
            return ci > p && ci <= turn ? ci : p
        }, -1)
        const tile = p[1][maxTurn]
        board[tile] = p[0]
    })
    return board
}

const getAttacked = (pieces, board, turn, myColor, c, r) => {
    let arr = []
    const tile = `${c}${r}`
    const piece = board[tile]
    const type = piece.slice(1, -1)
    const color = piece.slice(0, 1)

    if (type === 'r') {
        //TODO CASTLING
        scanRow(arr, board, myColor, c, r, 0, 1)
        scanRow(arr, board, myColor, c, r, 0, -1)
        scanRow(arr, board, myColor, c, r, 1, 0)
        scanRow(arr, board, myColor, c, r, -1, 0)
    } else if (type === 'k') {
        //TODO king must not be left on a position where it's under attack
        //TODO castling
        scanTile(arr, board, myColor, c, r, 0, 1)
        scanTile(arr, board, myColor, c, r, 1, 1)
        scanTile(arr, board, myColor, c, r, 1, 0)
        scanTile(arr, board, myColor, c, r, 1, -1)
        scanTile(arr, board, myColor, c, r, 0, -1)
        scanTile(arr, board, myColor, c, r, -1, -1)
        scanTile(arr, board, myColor, c, r, -1, 0)
        scanTile(arr, board, myColor, c, r, -1, 1)
    } else if (type === 'n') {
        scanTile(arr, board, myColor, c, r, 1, 2)
        scanTile(arr, board, myColor, c, r, 2, 1)
        scanTile(arr, board, myColor, c, r, 2, -1)
        scanTile(arr, board, myColor, c, r, 1, -2)
        scanTile(arr, board, myColor, c, r, -1, -2)
        scanTile(arr, board, myColor, c, r, -2, -1)
        scanTile(arr, board, myColor, c, r, -2, 1)
        scanTile(arr, board, myColor, c, r, -1, 2)
    } else if (type === 'b') {
        scanRow(arr, board, myColor, c, r, 1, 1)
        scanRow(arr, board, myColor, c, r, 1, -1)
        scanRow(arr, board, myColor, c, r, -1, 1)
        scanRow(arr, board, myColor, c, r, -1, -1)
    } else if (type === 'q') {
        scanRow(arr, board, myColor, c, r, 1, 1)
        scanRow(arr, board, myColor, c, r, 1, -1)
        scanRow(arr, board, myColor, c, r, -1, 1)
        scanRow(arr, board, myColor, c, r, -1, -1)
        scanRow(arr, board, myColor, c, r, 0, 1)
        scanRow(arr, board, myColor, c, r, 0, -1)
        scanRow(arr, board, myColor, c, r, 1, 0)
        scanRow(arr, board, myColor, c, r, -1, 0)
    } else if (type === 'p') {
        const delta = color === 'w' ? 1 : -1
        //first square
        if (!board[`${c}${r + delta}`]) {
            arr.push(`${c}${r + delta}`)
        }
        //second square
        if (Object.keys(pieces[piece]).length === 1) {
            if (!board[`${c}${r + delta + delta}`] && !board[`${c}${r + delta}`]) {
                arr.push(`${c}${r + delta + delta}`)
            }
        }
        //attack
        if (board[`${c + 1}${r + delta}`]) {
            if (myColor !== board[`${c + 1}${r + delta}`][0]) {
                arr.push(`${c + 1}${r + delta}`)
            }
        }
        if (board[`${c - 1}${r + delta}`]) {
            if (myColor !== board[`${c - 1}${r + delta}`][0]) {
                arr.push(`${c - 1}${r + delta}`)
            }
        }
    }
    return arr
}

module.exports = { getBoard, getAttacked }