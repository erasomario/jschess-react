import { useCallback } from "react"
import { ButtonGroup, ToggleButton } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { editLang } from "../clients/user-client"
import { useRadio } from "../hooks/useRadio"

const LangSwitch = ({ style, user, apiKey }) => {
    const { i18n } = useTranslation()
    const changeLang = useCallback(l => {
        i18n.changeLanguage(l)
        if (user) {
            editLang(user, l, apiKey)
        }
    }, [i18n, user])
    const [makeLangProps] = useRadio(i18n.language, changeLang)
    let langs
    if (user) {
        langs = [{ label: "Español", key: "es" }, { label: "English", key: "en" }]
    } else {
        langs = [{ label: "Es", key: "es" }, { label: "En", key: "en" }]
    }

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


