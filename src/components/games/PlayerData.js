import { useAuth } from "../../providers/ProvideAuth"
import { getProfilePictureUrl } from '../../controllers/user-client'
import { useEffect, useState } from "react"

export function PlayerData({ playerInfo, mode }) {
    const { key } = useAuth()
    const [url, setUrl] = useState()
    const { captures, turn, playerId, playerName, hasPicture, color } = playerInfo

    useEffect(() => {
        getProfilePictureUrl(playerId, hasPicture, key).then(setUrl)
    }, [playerId, hasPicture, key])

    if (mode[0] === 'v') {
        const flexDirection = mode[1] !== 't' ? "column" : "column-reverse"
        return <div style={{ display: "flex", flexDirection, alignItems: "flex-end", fontSize: "2.1vh", gap: "0.5em", backgroundColor: "" }}>
            <div style={{ height: "1.8em" }}></div>
            <div style={{ display: "flex", height: '2.5em', fontSize: "0.7em", justifyItems: "flex-end" }}>
                {Object.entries(captures).map(c => {
                    return (c[1] > 0 ? <div key={c[0]}
                        style={{
                            color: '#747474', paddingLeft: "2.2em", marginLeft: "0.5em",
                            width: "2.5em", height: '2.5em', backgroundSize: '2.5em 2.5em',
                            backgroundImage: `url('/assets/${color}${c[0]}.svg')`
                        }}>
                        {c[1]}
                    </div> : null)
                })}
            </div>
            <div style={{ fontSize: "2em" }}>00:00</div>
            <div style={{ display: "flex", alignItems: 'center' }}>
                {turn && <div className='mr-2' style={{ width: '1em', height: '1em', backgroundColor: '#4caf50', borderRadius: '50%' }}></div>}
                <img alt="" src={url} style={{ borderRadius: '15%', width: "5em", height: "5em" }} />
            </div>
            <div style={{ fontSize: '1.2em', fontWeight: (turn ? 'bold' : 'normal') }}>
                {playerName}
            </div>
        </div>
    }

    return <div>
        <div style={{ overflow: "hidden", position: "relative" }}>
            <img alt="" width='55' height='55' className='mr-2' src={url} style={{ borderRadius: '15%', float: "left" }} />
            <div style={{ float: "left" }} >
                <div style={{ fontWeight: (turn ? 'bold' : 'normal') }}>{playerName}</div>
                <div style={{ overflow: 'hidden', height: '30px' }}>
                    {captures.map(c =>
                        <div key={c}
                            style={{ width: "30px", height: '30px', backgroundSize: '30px 30px', float: 'left', backgroundImage: `url('/assets/${c.slice(0, -1)}.svg')` }}>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
}