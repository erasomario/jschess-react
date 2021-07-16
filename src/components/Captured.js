import { useAuth } from "../providers/ProvideAuth"
import { getProfilePictureUrl } from '../controllers/user-client'
import { useEffect, useState } from "react"

export function Captured({ player, pieces, myTurn, mode }) {
    const { user } = useAuth()
    const [url, setUrl] = useState()

    const cnts = { p: 0, r: 0, n: 0, b: 0, q: 0 }
    const capCol = (pieces && pieces[0]) ? pieces[0][0] : null

    pieces.forEach(p => {
        cnts[p[1]]++;
    });

    const ptypes = ['p', 'n', 'b', 'r', 'q'].filter(t => cnts[t] > 0)

    useEffect(() => {
        getProfilePictureUrl(player?.id, player?.hasPicture, user?.api_key).then(setUrl)
    }, [user, player])

    if (mode[0] === 'v') {
        const flexDirection = mode[1] !== 't' ? "column" : "column-reverse"
        return <div style={{ display: "flex", flexDirection, alignItems: "flex-end", fontSize: "2.1vh", gap: "0.5em", backgroundColor: "" }}>
            <div style={{ height: "1.8em" }}></div>
            <div style={{ display: "flex", height: '2.5em', fontSize: "0.7em", justifyItems: "flex-end" }}>
                {ptypes.map(c => <div key={c}
                    style={{
                        color: '#747474', paddingLeft: "2.2em", marginLeft: "0.5em",
                        width: "2.5em", height: '2.5em', backgroundSize: '2.5em 2.5em',
                        backgroundImage: `url('/assets/${capCol}${c}.svg')`
                    }}>
                    {cnts[c]}
                </div>
                )}
            </div>
            <div style={{ fontSize: "2em" }}>00:00</div>
            <div style={{ display: "flex", alignItems: 'center' }}>
                {myTurn && <div className='mr-2' style={{ width: '1em', height: '1em', backgroundColor: '#4caf50', borderRadius: '50%' }}></div>}
                <img alt="" src={url} style={{ borderRadius: '15%', width: "5em", height: "5em" }} />
            </div>
            <div style={{ fontSize: '1.2em', fontWeight: (myTurn ? 'bold' : 'normal') }}>
                {player?.username || "Oponente"}
            </div>
        </div>
    }

    return <div>
        <div style={{ overflow: "hidden", position: "relative" }}>
            <img alt="" width='55' height='55' className='mr-2' src={url} style={{ borderRadius: '15%', float: "left" }} />
            <div style={{ float: "left" }} >
                <div style={{ fontWeight: (myTurn ? 'bold' : 'normal') }}>{player?.username || "Oponente"}</div>
                <div style={{ overflow: 'hidden', height: '30px' }}>
                    {pieces.map(c =>
                        <div key={c}
                            style={{ width: "30px", height: '30px', backgroundSize: '30px 30px', float: 'left', backgroundImage: `url('/assets/${c.slice(0, -1)}.svg')` }}>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
}