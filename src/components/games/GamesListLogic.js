export const getAsGameList = (dtoList, selectedGame, user) => {
    return dtoList.map(g => {
        let whiteHighlight, blackHighlight, draw
        if (g.result) {
            if (g.result === "w") {
                whiteHighlight = true
            } else if (g.result === "b") {
                blackHighlight = true
            } else if (g.result === "d") {
                draw = true;
            }
        } else {
            if (g.turn % 2 === 0) {
                whiteHighlight = true
            } else {
                blackHighlight = true
            }
        }
        return {
            id: g.id,
            whiteHighlight,
            blackHighlight,
            draw,
            ended: !!g.result,
            selected: selectedGame?.id === g.id,
            whiteName: g.whiteName,
            blackName: g.blackName,
            isNew: !g.opponentNotified ? (g.whiteId === user.id ? "w" : "b") !== g.createdBy : false,
            createdAt: g.createdAt
        }
    })
}