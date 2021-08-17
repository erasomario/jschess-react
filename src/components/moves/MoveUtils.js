import { getEndingMessage } from '../games/GameEndedLogic'

const unicode = { K: ['\u2654', '\u265A'], Q: ['\u2655', '\u265B'], R: ['\u2656', '\u265C'], B: ['\u2657', '\u265D'], N: ['\u2658', '\u265E'] }

const getUnicodeLabel = (mov, i) => {
    if (!mov) {
        return
    }
    let lbl = mov.label;
    const firstL = lbl.slice(0, 1)
    if (["K", "Q", "R", "B", "N"].includes(firstL)) {
        lbl = unicode[firstL][i % 2 === 0 ? 0 : 1] + lbl.slice(1)
    }
    return lbl
}

const getMatElement = (movs, i) => {
    if (!movs[i]) {
        return null;
    }
    return { turn: i + 1, label: getUnicodeLabel(movs[i], i) }
}

const getMatrix = (movs) => {
    if (!movs) {
        return null
    }
    const mat = []
    for (let i = 0; i < Math.ceil(movs.length / 2); i++) {
        mat.push([getMatElement(movs, i * 2), getMatElement(movs, (i * 2) + 1)])
    }
    return mat
}

/**
 * Returns data to fill the move UI
 * @param {*} game 
 * @returns always returns an object
 */
const getMoveData = (game, user, t) => {
    let winDetail, winLabel
    const message = getEndingMessage(game, t)
    if (game?.result) {
        if (game.result === "w") {
            winLabel = "1-0"
        } else if (game.result === "b") {
            winLabel = "0-1"
        } else {
            winLabel = "0-0"
        }
        winDetail = message.msg + ". " + message.detail
    }

    return {
        matrix: getMatrix(game?.movs),
        winLabel,
        winDetail,
        prevBtnDisabled: !game?.board || game.board.turn <= 1,
        nextBtnDisabled: !game?.board || game.board.turn === game.movs.length,
        show: (!game ? "noGame" : (!game.movs || game.movs.length === 0 ? "noMovs" : "movs")),
        myColor: game ? (game.whiteId === user?.id ? "w" : (game.blackId === user?.id ? "b" : null)) : null,
        selectedRow: Math.floor((game?.board?.turn - 1) / 2),
        lastMovLabel: game?.movs && getUnicodeLabel(game.movs[game.board.turn - 1], game.turn)
    }
}

export default getMoveData