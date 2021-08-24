const capital = str => str.slice(0, 1).toUpperCase() + str.slice(1)

const getEndingMessage = (game, t) => {
    let detail, msg
    if (game) {
        if (game.result === "d") {
            msg = t("draw")
        } else {
            msg = t("{{winner}} won!", { winner: game.result === "w" ? game.whiteName : game.blackName })
        }

        if (game.endType === "time") {
            detail = t("{{looser}} ran out of time", { looser: capital(game.result === "b" ? game.whiteName : game.blackName) })
        } else if (game.endType === "check") {
            detail = t("{{winner}} checkmated", { winner: capital(game.result === "w" ? game.whiteName : game.blackName) })
        } else if (game.endType === "stale") {
            detail = t("{{looser}} ran out of options", { looser: capital(game.result === "b" ? game.whiteName : game.blackName) })
        } else if (game.endType === "material") {
            detail = t("not enough pieces to reach checkmate")
        } else if (game.endType === "agreed") {
            detail = t("player came to an agreement")
        } else if (game.endType === "surrender") {
            detail = t("{{looser}} surrendered", { looser: capital(game.result === "b" ? game.whiteName : game.blackName) })
        } else if (game.endType === "threefold") {
            detail = t("same board positions repeated three times")
        }        
    }
    return { msg, detail }
}

export { getEndingMessage }