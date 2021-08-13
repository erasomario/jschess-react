import { useEffect, useRef } from "react"

const Drawer = ({ children, show = false, onHide = a => a, width }) => {

    const bgOverlayRef = useRef()
    const drawerRef = useRef()
    const shown = useRef(false)

    useEffect(() => {
        if (show !== shown.current) {
            if (show) {
                bgOverlayRef.current.style.visibility = "visible"
                bgOverlayRef.current.style.opacity = "1"
                bgOverlayRef.current.style.animation = "fadeIn 0.25s ease-out"

                drawerRef.current.style.visibility = "visible"
                drawerRef.current.style.left = "0"
                drawerRef.current.style.animation = "slideIn 0.25s ease-out"
            } else {
                bgOverlayRef.current.style.visibility = "hidden"
                bgOverlayRef.current.style.opacity = "0"
                bgOverlayRef.current.style.animation = "fadeOut 0.5s linear"

                drawerRef.current.style.visibility = "hidden"
                drawerRef.current.style.left = "-100%"
                drawerRef.current.style.animation = "slideOut 0.5s linear"
            }
            shown.current = show
        }
    }, [show])

    return <>
        <div ref={bgOverlayRef} onClick={onHide}
            style={{ visibility: "hidden", top: "0", left: "0", position: "absolute", backgroundColor: "rgba(0, 0, 0, 0.4)", width: "100%", height: "100%" }} ></div>
        <div ref={drawerRef}
            style={{
                top: "0", left: "-100%", position: "absolute", backgroundColor: "white", width, height: "100%",
                boxShadow: "0px 0px 2px 2px rgba(0, 0, 0, 0.2)"
            }} >
            {children}
        </div>
    </>
}

export default Drawer