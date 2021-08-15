import { OverlayTrigger, Tooltip } from "react-bootstrap"

const HelpText = ({ message, children }) => {
    if (children["props"]?.disabled) {
        return children
    }
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