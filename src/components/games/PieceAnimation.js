export function animate(fake, piece, reversed, size, sCol, sRow, dCol, dRow, cb) {
    if (!fake) {
        return
    }
    let begW, begH, endW, endH
    if (reversed) {
        begW = size * (7 - sCol + 1)
        begH = size * (sRow + 1)
        endW = size * (7 - dCol + 1)
        endH = size * (dRow + 1)
    } else {
        begW = size * (sCol + 1)
        begH = size * (7 - sRow + 1)
        endW = size * (dCol + 1)
        endH = size * (7 - dRow + 1)
    }

    const time = (150 + (350 * (Math.sqrt(Math.pow(endW - begW, 2) + Math.pow(endH - begH, 2)) / (Math.sqrt(Math.pow(size, 2) * 2) * 8))))

    fake.style.backgroundImage = `url('${process.env.PUBLIC_URL}/assets/${piece.slice(0, -1)}.svg')`
    fake.style.transition = "width 0s, height 0s"
    fake.style.width = `${begW}px`
    fake.style.height = `${begH}px`
    fake.style.display = "block"

    setTimeout(() => {
        fake.style.transition = `width ${time / 1000}s, height ${time / 1000}s`
        fake.style.width = `${endW}px`
        fake.style.height = `${endH}px`
    }, 0)

    setTimeout(() => {
        fake.style.display = "none"
        cb()
    }, time)
}