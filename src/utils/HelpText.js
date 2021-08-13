import { OverlayTrigger, Tooltip } from "react-bootstrap"

const HelpText = ({ message, children }) => {
    return <OverlayTrigger
        key="right"
        placement="right"
        delay="250"
        trigger={["hover", "hover"]}
        overlay={
            <Tooltip id={`tooltip-right`}>
                {message}
            </Tooltip>
        }>
        {children}
    </OverlayTrigger>
}
export default HelpText