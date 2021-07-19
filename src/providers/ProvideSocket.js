import { createContext, useCallback, useContext, useEffect, useRef } from "react"
import { useAuth } from "./ProvideAuth"
import socketIOClient from "socket.io-client"
import { getAddress } from "../utils/ApiClient"

const SocketContext = createContext();

export function ProvideSocket({ children }) {
    const socket = useRef()
    const { user } = useAuth()

    useEffect(() => {
        if (!user) {
            return
        }
        const opts = { query: { id: user.id } }
        if (!socket.current || !socket.current.connected) {
            console.log('Connecting to socket.io')
            socket.current = process.env.NODE_ENV === 'development' ? socketIOClient(getAddress(), opts) : socketIOClient(opts)
        }

        return () => {
            console.log('disconnecting from socket.io')
            socket.current.disconnect()
        }
    }, [user])

    const addSocketListener = useCallback((event, cb) => {
        if (!socket.current) {
            return
        }
        socket.current.removeAllListeners(event)
        socket.current.on(event, cb)
    }, [])

    return <SocketContext.Provider value={{ addSocketListener }}>
        {children}
    </SocketContext.Provider>
}

export function useSocket() {
    return useContext(SocketContext);
}