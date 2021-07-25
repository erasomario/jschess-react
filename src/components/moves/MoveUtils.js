const unicode = { K: ['\u2654', '\u265A'], Q: ['\u2655', '\u265B'], R: ['\u2656', '\u265C'], B: ['\u2657', '\u265D'], N: ['\u2658', '\u265E'] }

const getMatElement = (movs, i) => {
    if (!movs[i]) {
        return null;
    }
    let lbl = movs[i].label;
    const firstL = lbl.slice(0, 1)
    if (['K', 'Q', 'R', 'B', 'N'].includes(firstL)) {
        lbl = unicode[firstL][i % 2 === 0 ? 0 : 1] + lbl.slice(1)
    }
    return { turn: i + 1, label: lbl }
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
const getMoveData = (game, user) => {
    let winDetail, winLabel
    if (game?.result) {
        if (game.result === "w") {
            winLabel = "1-0"
            winDetail = "Ganaron las blancas"
        } else if (game.result === "b") {
            winLabel = "0-1"
            winDetail = "Ganaron las negras"
        } else {
            winLabel = "0-0"
            winDetail = "Empate"
        }

        if (game?.endType === 'time') {
            winDetail += `. Las ${game.result === "w" ? "negras" : "blancas"} se quedaron sin tiempo`
        } else if (game?.endType === 'check') {
            winDetail += `. Las ${game.result === "w" ? "blancas" : "negras"} dieron jaque mate`
        } else if (game?.endType === 'stale') {

            winDetail += `. Las ${game.movs.length % 2 === 0 ? "blancas" : "negras"} se quedaron sin opciones`
        }
    }

    return {
        matrix: getMatrix(game?.movs),
        winLabel,
        winDetail,
        prevBtnDisabled: !game?.board || game.board.turn <= 1,
        nextBtnDisabled: !game?.board || game.board.turn === game.movs.length,
        show: (!game ? "noGame" : (!game.movs || game.movs.length === 0 ? "noMovs" : "movs")),
        myColor: game?.whiteId === user?.id ? "w" : "b"
    }
}

export default getMoveData