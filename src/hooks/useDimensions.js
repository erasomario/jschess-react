import { useEffect, useState } from "react";

export const useDimensions = () => {
    function getWindowDimensions() {

        
        
        const { clientWidth: width, clientHeight: height } = document.documentElement;
        return {
            width,
            height
        };
    }

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowDimensions
}