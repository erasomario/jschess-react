export function animate(fake, game, reversed, size, cb) {
    const m = game.movs[game.board.turn - 1]
    let begX, begY, endX, endY
    if (reversed) {
        begX = size * (7 - m.sCol)
        begY = size * m.sRow
        endX = size * (7 - m.dCol)
        endY = size * m.dRow
    } else {
        begX = size * m.sCol
        begY = size * (7 - m.sRow)
        endX = size * m.dCol
        endY = size * (7 - m.dRow)
    }

    const piece = game.board.inGameTiles[m.dRow][m.dCol]
    fake.style.backgroundImage = `url('/assets/${piece.slice(0, -1)}.svg')`
    fake.style.left = `${begX}px`
    fake.style.top = `${begY}px`
    fake.style.display = "block"

    let start = null
    const time = 200
    const step = t => {
        if (!start) {
            start = t
        }
        const elapsed = (t - start)
        const progress = elapsed / time;
        const curX = (begX * (1 - progress)) + (endX * progress)
        const curY = (begY * (1 - progress)) + (endY * progress)

        fake.style.left = `${curX}px`
        fake.style.top = `${curY}px`

        if (elapsed < time) {
            requestAnimationFrame(step)
        } else {
            fake.style.display = "none"
            cb()
        }
    }
    requestAnimationFrame(step)
}