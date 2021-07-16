export const getPlayersData = (game, board, user) => {
    let topPieces, bottomPieces, topTurn, bottomTurn
    if (board) {
        const turn = board.turn % 2 === 0 ? 'w' : 'b'
        const myColor = user.id === game.whiteId ? 'w' : 'b'
        const topColor = myColor === 'w' ? 'b' : 'w'
        const bottomColor = myColor === 'w' ? 'w' : 'b'
        topTurn = topColor === turn
        bottomTurn = bottomColor === turn
        topPieces = topColor === 'w' ? board.blackCaptured : board.whiteCaptured
        bottomPieces = bottomColor === 'w' ? board.blackCaptured : board.whiteCaptured
    } else {
        topPieces = []
        bottomPieces = []
    }

//    topPieces = ['wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'wp6', 'wp7', 'wp8', 'wr1', 'wr2', 'wn1', 'wn2', 'wb1', 'wb2', 'wq2']
 //   bottomPieces = ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8', 'br1', 'br2', 'bn1', 'bn2', 'bb1', 'bb2', 'bq2']

    return { topPieces, bottomPieces, topTurn, bottomTurn }
}