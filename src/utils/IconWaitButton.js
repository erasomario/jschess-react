import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import { useTranslation } from 'react-i18next'

export default function IconWaitButton({ variant, className, children, label, workingLabel, working = false, style = {}, disabled = false, onClick = a => a, type = "button" }) {
    const { t } = useTranslation()

    return <Button className={className} variant={variant || "primary"} type={type} onClick={onClick} disabled={disabled || working}
        style={{ display: "flex", ...style }}>
        {working ? workingLabel || t("working...") : label}
        <div className='ml-2'>
            {!working && children}
            {working && <Spinner size="sm" animation="border" variant="light" />}
        </div>
    </Button>


}