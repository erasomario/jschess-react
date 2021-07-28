import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useAuth } from "./ProvideAuth"
import socketIOClient from "socket.io-client"
import { getAddress } from "../utils/ApiClient"

const SocketContext = createContext();

export function ProvideSocket({ children }) {
    const socket = useRef()
    const [open, setOpen] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        if (!user) {
            return
        }
        const opts = { query: { id: user.id } }
        if (!socket.current || !socket.current.connected) {
            console.log('Connecting to socket.io')
            socket.current = process.env.NODE_ENV === 'development' ? socketIOClient(getAddress(), opts) : socketIOClient(opts)
            setOpen(true)
        }

        return () => {
            console.log('disconnecting from socket.io')
            socket.current.disconnect()
            setOpen(false)
        }
    }, [user])

    const addSocketListener = useCallback((event, cb) => {
        if (!open) {
            return
        }        
        socket.current.removeAllListeners(event)
        socket.current.on(event, cb)
    }, [open])

    return <SocketContext.Provider value={{ addSocketListener, isSocketOpen: open }}>
        {children}
    </SocketContext.Provider>
}

export function useSocket() {
    return useContext(SocketContext);
}