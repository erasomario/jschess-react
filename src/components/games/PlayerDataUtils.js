const getCounters = (pieces) => {
    const cnts = { p: 0, n: 0, b: 0, r: 0, q: 0 }
    pieces.forEach(p => {
        cnts[p[1]]++;
    })
    return cnts
}

const getRemainingTime = (game, color) => {
    if (!game.time) {
        return null
    }
    let secs = game.time * 60
    for (let i = 0; i < game.movs.length; i++) {
        if ((color === 'w' && i % 2 === 0) || (color === 'b' && i % 2 !== 0)) {
            if (game.movs[i].time) {
                secs -= game.movs[i].time
                secs += game.addition
            }
        }
    }
    return parseInt(secs)
}

const getResultLabel = (game, color) => {
    if (!game.result) {
        return null
    } else if (game.result === 'd') {
        return "Empate"
    } else if (game.result === color) {
        return "Ganador"
    }
}

export const secsToStr = secs => {
    if (secs === null) {
        return "∞"
    }
    const min = secs < 0
    const asecs = Math.abs(secs)
    const s = asecs % 60
    const m = (asecs - s) / 60
    return (min ? "-" : "") + m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0")
}

export const getPlayersData = (game, user, reversed) => {
    const top = {}, bottom = {}
    if (game) {
        const turn = game.board.turn % 2 === 0 ? 'w' : 'b'
        top.color = reversed ? 'w' : 'b'
        top.turn = top.color === turn
        top.captures = getCounters(top.color === 'w' ? game.board.blackCaptured : game.board.whiteCaptured)
        top.playerName = reversed ? game.whiteName : game.blackName
        top.hasPicture = reversed ? game.whiteHasPicture : game.blackHasPicture
        top.playerId = reversed ? game.whiteId : game.blackId
        top.remainingTime = getRemainingTime(game, top.color)
        top.tick = top.turn && game.movs.length >= 2 && game.board.turn === game.movs.length && !game.result && game.time
        top.result = getResultLabel(game, top.color)

        bottom.color = reversed ? 'b' : 'w'
        bottom.turn = bottom.color === turn
        bottom.captures = getCounters(bottom.color === 'w' ? game.board.blackCaptured : game.board.whiteCaptured)
        bottom.playerName = reversed ? game.blackName : game.whiteName
        bottom.hasPicture = reversed ? game.blackHasPicture : game.whiteHasPicture
        bottom.playerId = reversed ? game.blackId : game.whiteId
        bottom.remainingTime = getRemainingTime(game, bottom.color)
        bottom.tick = bottom.turn && game.movs.length >= 2 && game.board.turn === game.movs.length && !game.result && game.time
        bottom.result = getResultLabel(game, bottom.color)
    } else {
        top.captures = {}
        top.playerName = "Oponente"
        top.hasPicture = false
        top.playerId = null
        top.color = 'b'
        top.remainingTime = 300
        top.tick = false
        top.result = null

        bottom.captures = {}
        bottom.playerName = user.username
        bottom.hasPicture = user.hasPicture
        bottom.playerId = user.id
        bottom.color = 'w'
        bottom.remainingTime = 300
        bottom.tick = false
        bottom.result = null
    }

    if (game?.endType === "time") {
        if (top.color === game.result) {
            bottom.remainingTime = 0
        } else {
            top.remainingTime = 0
        }
    }

    return [top, bottom]
}