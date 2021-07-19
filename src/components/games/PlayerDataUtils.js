const getCounters = (pieces) => {
    const cnts = { p: 0, r: 0, n: 0, b: 0, q: 0 }
    pieces.forEach(p => {
        cnts[p[1]]++;
    })
    return cnts
}

export const getPlayersData = (game, user, reversed) => {
    let topCaptures, bottomCaptures, topTurn, bottomTurn, topPlayer, bottomPlayer, topHasPicture, bottomHasPicture, topId, bottomId, topColor, bottomColor

    if (game) {
        const turn = game.board.turn % 2 === 0 ? 'w' : 'b'
        topColor = reversed ? 'w' : 'b'
        bottomColor = reversed ? 'b' : 'w'
        topTurn = topColor === turn
        bottomTurn = bottomColor === turn
        topCaptures = topColor === 'w' ? game.board.blackCaptured : game.board.whiteCaptured
        bottomCaptures = bottomColor === 'w' ? game.board.blackCaptured : game.board.whiteCaptured
        topPlayer = reversed ? game.whiteName : game.blackName
        bottomPlayer = reversed ? game.blackName : game.whiteName
        topHasPicture = reversed ? game.whiteName : game.blackName
        bottomHasPicture = reversed ? game.blackName : game.whiteName
        topId = reversed ? game.whiteId : game.blackId
        bottomId = reversed ? game.blackId : game.whiteId
    } else {
        topCaptures = []
        bottomCaptures = []
        topPlayer = "Oponente"
        topHasPicture = false
        bottomPlayer = user.userName
        bottomHasPicture = user.hasPicture
        topId = null
        bottomId = user.id
        topColor = 'b'
        bottomColor = 'w'
    }

    //    topPieces = ['wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'wp6', 'wp7', 'wp8', 'wr1', 'wr2', 'wn1', 'wn2', 'wb1', 'wb2', 'wq2']
    //   bottomPieces = ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8', 'br1', 'br2', 'bn1', 'bn2', 'bb1', 'bb2', 'bq2']

    return [
        {
            color: topColor,
            captures: getCounters(topCaptures),
            turn: topTurn,
            playerId: topId,
            playerName: topPlayer,
            hasPicture: topHasPicture
        },
        {
            color: bottomColor,
            captures: getCounters(bottomCaptures),
            turn: bottomTurn,
            playerId: bottomId,
            playerName: bottomPlayer,
            hasPicture: bottomHasPicture
        }
    ]
}