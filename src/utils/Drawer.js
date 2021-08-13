import { useEffect, useRef } from "react"
import "./Drawer.css"

const Drawer = ({ children, show = false, onHide = a => a, width, position = "right", animationSecs = 0.25 }) => {

    const bgOverlayRef = useRef()
    const drawerRef = useRef()
    const shown = useRef(false)

    if (!["left", "right"].includes(position)) {
        throw Error("position should be left or right")
    }

    useEffect(() => {
        if (show !== shown.current) {
            if (show) {
                bgOverlayRef.current.style.visibility = "visible"
                bgOverlayRef.current.style.opacity = "1"
                bgOverlayRef.current.style.animation = `fadeIn ${animationSecs}s ease-out`

                drawerRef.current.style.width = width
                drawerRef.current.style.visibility = "visible"
            } else {
                bgOverlayRef.current.style.visibility = "hidden"
                bgOverlayRef.current.style.opacity = "0"
                bgOverlayRef.current.style.animation = `fadeOut ${animationSecs}s ease-out`

                drawerRef.current.style.width = "0"
                setTimeout(() => {
                    drawerRef.current.style.visibility = "hidden"
                }, animationSecs * 1000)
            }
            shown.current = show
        }
    }, [position, show, width, animationSecs])

    const drawerStyle = {
        top: "0",
        position: "absolute", backgroundColor: "white", width: "0", height: "100%",
        boxShadow: "0px 0px 2px 2px rgba(0, 0, 0, 0.2)",
        visibility: "hidden",
        overflowX: "hidden",
        transition: `width ${animationSecs}s ease-out`
    }
    drawerStyle[position] = "0"
    return <>
        <div ref={bgOverlayRef} onClick={onHide}
            style={{ visibility: "hidden", top: "0", left: "0", position: "absolute", backgroundColor: "rgba(0, 0, 0, 0.4)", width: "100%", height: "100%" }} ></div>

        <div ref={drawerRef}
            style={drawerStyle} >
            <div style={(position === "left" ? { width, position: "absolute", right: "0" } : { width, position: "absolute", left: "0" })}>
                {children}
            </div>
        </div>
    </>
}

export default Drawer