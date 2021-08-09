import React, { useLayoutEffect, useRef } from "react"
import { ListGroup } from "react-bootstrap"
import { FaMedal, FaPlus } from "react-icons/fa"
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

const Pawn = ({ color }) => {
    return <div className="pawn" style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/assets/${color}p.svg')` }} />
}

const Loading = ({ style }) => {
    return <div style={style}>Cargando</div>
}

const NoData = ({ type, style }) => {
    return <div style={{ ...style, display: "flex", flexDirection: "column", justifyContent: "center", gap: "1em" }}>
        <b>{type === "open" ? "No tiene partidas en curso" : "Aun no tiene partidas finalizadas"}</b>
        <div>Puede iniciar un juego contra amigos o contra el computador en la opción <FaPlus /> del inicio.</div>
        <div style={{ height: "5em" }}></div>
    </div>
}

const GameItem = React.forwardRef((props, ref) => {

    const { game: g, onSelect } = props


    return <ListGroup.Item
        ref={g.selected ? ref : null}
        active={g.selected}
        onClick={() => onSelect(g.id)}
        style={{ cursor: 'pointer', margin: "0", padding: "0.4em" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
                <div className="playerSubRow">
                    <Pawn color={"w"} />{g.whiteName}
                    {(g.whiteHighlight && !g.ended) && <div className="gameListDot" />}
                    {(g.whiteHighlight && g.ended) && <FaMedal style={{ marginLeft: "0.5em" }} />}
                </div>
                <div className="playerSubRow">
                    <Pawn color={"b"} />{g.blackName}
                    {(g.blackHighlight && !g.ended) && <div className="gameListDot" />}
                    {(g.blackHighlight && g.ended) && <FaMedal style={{ marginLeft: "0.5em" }} />}
                </div>
            </div>
            {g.isNew && <div className="gameListNew">Nueva</div>}
            {g.ended &&
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                    {g.draw && <div>Empate</div>}
                    {new Date(g.createdAt).toLocaleDateString("es-CO")}
                </div>
            }
        </div>
    </ListGroup.Item>
})

export function GamesList({ data, height, onSelect, loading }) {
    const ref = useRef()
    useLayoutEffect(() => {
        ref.current?.scrollIntoView({ block: "nearest", behavior: "auto" })
    })
    return <>
        {loading && <Loading style={{ height }} />}
        {!loading && data?.length === 0 && <NoData style={{ height }} type="open" />}
        {!loading && data?.length > 0 &&
            <SimpleBar style={{ height }}>
                <ListGroup>
                    {data.map(g => <GameItem
                        key={g.id} game={g}
                        onSelect={onSelect}
                        ref={ref} />)}
                </ListGroup>
            </SimpleBar>
        }
    </>
}