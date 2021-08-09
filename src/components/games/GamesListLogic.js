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

        let isNew
        if (g.result) {
            isNew = false
        } else {
            if (!g.opponentNotified) {
                if (g.whiteId === user.id) {
                    isNew = g.createdBy === "b"
                } else if (g.blackId === user.id) {
                    isNew = g.createdBy === "w"
                } else {
                    isNew = false
                }
            } else {
                isNew = false
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
            isNew,
            createdAt: g.createdAt
        }
    })
}