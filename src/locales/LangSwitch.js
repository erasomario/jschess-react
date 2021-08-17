import { useCallback } from "react"
import { ButtonGroup, ToggleButton } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useRadio } from "../hooks/useRadio"

const LangSwitch = ({ style }) => {
    const { i18n } = useTranslation()
    const changeLang = useCallback(l => i18n.changeLanguage(l), [i18n])
    const [makeLangProps] = useRadio(i18n.language, changeLang)
    const langs = [{ label: "Es", key: "es" }, { label: "En", key: "en" }]

    return <ButtonGroup toggle style={style}>
        {langs.map(l => <ToggleButton {...makeLangProps(l.key)} name="lang" variant="primary" key={l.key} style={{ fontSize: "0.85em" }}>
            {l.label}
        </ToggleButton>
        )}
    </ButtonGroup>
}

const getBrowserLang = () => {
    const raw = navigator.language || navigator.userLanguage
    const lang = raw.slice(0, raw.indexOf("-")).toLowerCase()
    return ["en", "es"].includes(lang) ? lang : "en"
}

export { getBrowserLang, LangSwitch }


