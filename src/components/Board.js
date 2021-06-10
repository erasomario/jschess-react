import { Tile } from "./Tile"

export function Board({ reverse = false, game, turn }) {
    if (!game) {
        return <></>
    }

    const rows = reverse ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1]
    const cols = reverse ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const map = {}
    Object.entries(game.board).forEach((e) => {
        const piece = e[turn];
        const tile = e[1][game.turn]
        map[tile] = piece
    })

    return <table>
        <tbody>{rows.map((e) =>
            <tr key={e}>{
                cols.map((d) => {
                    return <td key={d}>
                        <Tile key={d + e} col={d} row={e} piece={map[d + e]}>
                        </Tile>
                    </td>
                }
                )}
            </tr>)
        }
        </tbody>
    </table>
}