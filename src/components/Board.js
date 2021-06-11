import { useEffect, useState } from "react"
import { useAuth } from "../providers/ProvideAuth"
import { Tile } from "./Tile"

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

    const myColor = user.id === game.whitePlayerId ? 'white' : 'black'
    const myTurn = game.current === myColor;

    if (!game) {
        return <></>
    }

    const rows = reversed ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1]
    const cols = reversed ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8]
    const map = {}
    Object.entries(game.board).forEach((e) => {
        const piece = e[turn];
        const tile = e[1][game.turn]
        map[tile] = piece
    })

    const onSelect = (c, r) => {
        const tile = `${c}${r}`;
        setSrc(tile)
        const piece = map[tile]
        const type = piece.slice(1, -1)
        let arr = []
        if (type === 'n') {
            arr.push(`${c + 1}${r + 2}`)
            arr.push(`${c + 2}${r + 1}`)
            arr.push(`${c + 2}${r - 1}`)
            arr.push(`${c + 1}${r - 2}`)
            arr.push(`${c - 1}${r - 2}`)
            arr.push(`${c - 2}${r - 1}`)
            arr.push(`${c - 2}${r + 1}`)
            arr.push(`${c - 1}${r + 2}`)
            arr = arr.filter((t) => {
                if (map[t]) {
                    return myColor === 'white' && map[t][0] === 'b' || myColor === 'black' && map[t][0] === 'w'
                } else {
                    return true
                }
            })
        }
        setHigh(arr);
    }

    return <>
        <table border='0' cellSpacing="0" cellPadding="0">
            <tbody>{rows.map((r) =>
                <tr key={r}>{
                    cols.map((c) => {
                        return <td key={c}>
                            <Tile key={`${c}${r}`} col={c} row={r} piece={map[`${c}${r}`]} reversed={reversed}
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