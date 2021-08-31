import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useAuth } from "./ProvideAuth"
import socketIOClient from "socket.io-client"
import { getAddress } from "../utils/ApiClient"

const SocketContext = createContext();

export function ProvideSocket({ children }) {
    const socket = useRef()
    const [open, setOpen] = useState(false)
    const { user, apiKey } = useAuth()

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
        console.log("listening for: ", event);
        socket.current.removeAllListeners(event)
        socket.current.on(event, cb)
    }, [open])

    const emit = useCallback((event, payload) => {
        if (!open) {
            return
        }
        console.log("emitting", event);
        socket.current.emit(event, payload)        
    }, [open])

    return <SocketContext.Provider value={{ addSocketListener, emit }}>
        {children}
    </SocketContext.Provider>
}

export function useSocket() {
    return useContext(SocketContext);
}