import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { ListGroup, Spinner } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next"
import { FaMedal, FaPlus } from "react-icons/fa"
import { toast } from "react-toastify"
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { useAuth } from "../../providers/ProvideAuth"
import { useGame } from "../../providers/ProvideGame"
import { getAsGameList } from "./GamesListLogic"

export function GamesList({ onDataNeeded, height, onSelect, emptyMessage, onItemHighlighted }) {
    const { t, i18n } = useTranslation()
    const { game } = useGame()
    const { user } = useAuth()
    const ref = useRef()
    const [rawData, setRawData] = useState()
    const [loading, setLoading] = useState()

    const data = useMemo(() => getAsGameList(rawData, game, user)
        , [game, rawData, user])

    useLayoutEffect(() => {
        (data && onItemHighlighted) && data.forEach(e => {
            if (e.selected) {
                onItemHighlighted()
            }
        })
    }, [data, onItemHighlighted])

    useEffect(() => {
        setLoading(true)
        onDataNeeded()
            .then(l => setRawData(l))
            .catch(e => toast.error(e.message))
            .finally(() => { setLoading(false) })
    }, [onDataNeeded])

    useEffect(() => {
        ref.current?.scrollIntoView({ block: "nearest", behavior: "auto" });
    })

    return <>
        {loading && <Loading style={{ height }} t={t} />}
        {!loading && data?.length === 0 && <NoData style={{ height }} emptyMessage={emptyMessage} />}
        {!loading && data?.length > 0 &&
            <SimpleBar style={{ height }}>
                <ListGroup>
                    {data.map(g => <GameItem
                        key={g.id} game={g}
                        onSelect={onSelect}
                        i18n={i18n}
                        t={t}
                        ref={ref} />)}
                </ListGroup>
            </SimpleBar>
        }
    </>
}

const GameItem = React.forwardRef((props, ref) => {

    const { game: g, onSelect, i18n, t } = props

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
            {g.isNew && <div className="gameListNew">{t("new_female")}</div>}
            {g.ended &&
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                    {g.draw && <div>{t("draw")}</div>}
                    {new Date(g.createdAt).toLocaleDateString(i18n.language)}
                </div>
            }
        </div>
    </ListGroup.Item>
})

const Pawn = ({ color }) => {
    return <div className="pawn" style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/assets/${color}p.svg')` }} />
}

const Loading = ({ style, t }) => {
    return <div style={{ ...style, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex" }}>
            <Spinner style={{ marginRight: "0.5em" }} animation="border" variant="primary" />
            {t("loading")}
        </div>
        <div style={{ height: "5em" }}></div>
    </div>
}

const NoData = ({ emptyMessage, style }) => {
    return <div style={{ ...style, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p><b>{emptyMessage}</b></p>
        <div>
            <Trans i18nKey="you can start a new game against friends or the computer">
                <FaPlus />
            </Trans>
        </div>
        <div style={{ height: "5em" }}></div>
    </div>
}