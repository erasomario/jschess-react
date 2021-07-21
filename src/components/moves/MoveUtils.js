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
        return []
    }
    const mat = []
    for (let i = 0; i < Math.ceil(movs.length / 2); i++) {
        mat.push([getMatElement(movs, i * 2), getMatElement(movs, (i * 2) + 1)])
    }
    return mat
}

const getMoveData = (game) => {

    let winDetail, winLabel
    if (game?.result) {
        if (game.result === "w") {
            winLabel = "1-0"
        } else if (game.result === "b") {
            winLabel = "0-1"
        } else {
            winLabel = "0-0"
        }
        winLabel = game.result === "w" ? "1-0" : "0-1"
        winDetail = `Ganaron las ${game.result === "w" ? "blancas" : "negras"}`
        if (game?.endType === 'time') {
            winDetail += `. Las ${game.result === "w" ? "negras" : "blancas"} se quedaron sin tiempo`
        }
    }

    return {
        matrix: getMatrix(game?.movs),
        winLabel,
        winDetail,
        prevBtnDisabled: !game?.board || game.board.turn === 1,
        nextBtnDisabled: !game?.board || game.board.turn === game.movs.length,
    }
}

export default getMoveData