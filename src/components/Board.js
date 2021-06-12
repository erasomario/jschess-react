import { useEffect, useState } from "react"
import { useAuth } from "../providers/ProvideAuth"
import { Tile } from "./Tile"

function isMine(myColor, piece) {
    return (myColor === piece[0])
}

export function Board({ reversed = false, game, turn }) {
    const [user] = useAuth()
    const [src, setSrc] = useState(null)
    const [dest, setDest] = useState(null)
    const [high, setHigh] = useState([])

    useEffect(() => {
        setSrc(null)
        setDest(null)
        setHigh([])
    }, [game])

    const myColor = user.id === game.whitePlayerId ? 'w' : 'b'
    const myTurn = game.current[0] === myColor;

    if (!game) {
        return <></>
    }

    const rows = reversed ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1]
    const cols = reversed ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8]
    const board = {}
    Object.entries(game.pieces).forEach((e) => {
        const piece = e[turn];
        const tile = e[1][game.turn]
        board[tile] = piece
    })

    const scanTile = (arr, c, r, cdelta, rdelta) => {
        const cc = c + cdelta
        const rr = r + rdelta
        if (cc >= 1 && cc <= 8 && rr >= 1 && rr <= 8) {
            const tile = `${cc}${rr}`;
            const piece = board[tile];
            if (piece) {
                if (!isMine(myColor, piece)) {
                    arr.push(tile)
                }
            } else {
                arr.push(tile)
            }
        }
    }

    const scanRow = (arr, c, r, cdelta, rdelta) => {
        for (let cc = c + cdelta, rr = r + rdelta; cc >= 1 && cc <= 8 && rr >= 1 && rr <= 8; cc += cdelta, rr += rdelta) {
            const tile = `${cc}${rr}`;
            const piece = board[tile];
            if (piece) {
                if (!isMine(myColor, piece)) {
                    arr.push(tile)
                }
                break
            } else {
                arr.push(tile)
            }
        }
    }

    const onSelect = (c, r) => {
        const tile = `${c}${r}`;
        setSrc(tile)
        const piece = board[tile]
        const type = piece.slice(1, -1)
        const color = piece.slice(0, 1)
        let arr = []
        if (type === 'r') {
            //TODO CASTLING
            scanRow(arr, c, r, 0, 1)
            scanRow(arr, c, r, 0, -1)
            scanRow(arr, c, r, 1, 0)
            scanRow(arr, c, r, -1, 0)
        } else if (type === 'k') {
            //TODO king must not be left on a position where it's under attack
            //TODO castling
            scanTile(arr, c, r, 0, 1)
            scanTile(arr, c, r, 1, 1)
            scanTile(arr, c, r, 1, 0)
            scanTile(arr, c, r, 1, -1)
            scanTile(arr, c, r, 0, -1)
            scanTile(arr, c, r, -1, -1)
            scanTile(arr, c, r, -1, 0)
            scanTile(arr, c, r, -1, 1)
        } else if (type === 'n') {
            scanTile(arr, c, r, 1, 2)
            scanTile(arr, c, r, 2, 1)
            scanTile(arr, c, r, 2, -1)
            scanTile(arr, c, r, 1, -2)
            scanTile(arr, c, r, -1, -2)
            scanTile(arr, c, r, -2, -1)
            scanTile(arr, c, r, -2, 1)
            scanTile(arr, c, r, -1, 2)
        } else if (type === 'b') {
            scanRow(arr, c, r, 1, 1)
            scanRow(arr, c, r, 1, -1)
            scanRow(arr, c, r, -1, 1)
            scanRow(arr, c, r, -1, -1)
        } else if (type === 'q') {
            scanRow(arr, c, r, 1, 1)
            scanRow(arr, c, r, 1, -1)
            scanRow(arr, c, r, -1, 1)
            scanRow(arr, c, r, -1, -1)
            scanRow(arr, c, r, 0, 1)
            scanRow(arr, c, r, 0, -1)
            scanRow(arr, c, r, 1, 0)
            scanRow(arr, c, r, -1, 0)
        } else if (type === 'p') {
            const delta = color === 'w' ? 1 : -1
            //first square
            if (!board[`${c}${r + delta}`]) {
                arr.push(`${c}${r + delta}`)
            }
            //second square
            if (Object.keys(game.pieces[piece]).length === 1) {
                if (!board[`${c}${r + delta + delta}`] && !board[`${c}${r + delta}`]) {
                    arr.push(`${c}${r + delta + delta}`)
                }
            }
            //attack
            if (board[`${c + 1}${r + delta}`]) {
                if (myColor !== board[`${c + 1}${r + delta}`][0]) {
                    arr.push(`${c + 1}${r + delta}`)
                }
            }
            if (board[`${c - 1}${r + delta}`]) {
                if (myColor !== board[`${c - 1}${r + delta}`][0]) {
                    arr.push(`${c - 1}${r + delta}`)
                }
            }
        }
        setHigh(arr);
    }

    return <>
        <table border='0' cellSpacing="0" cellPadding="0">
            <tbody>{rows.map((r) =>
                <tr key={r}>{
                    cols.map((c) => {
                        return <td key={c}>
                            <Tile key={`${c}${r}`} col={c} row={r} piece={board[`${c}${r}`]} reversed={reversed}
                                src={src} dest={dest} myTurn={myTurn} myColor={myColor} highlights={high}
                                onSelect={() => onSelect(c, r)}
                            >
                            </Tile>
                        </td>
                    }
                    )}
                </tr>)
            }
            </tbody>
        </table>
    </>
}