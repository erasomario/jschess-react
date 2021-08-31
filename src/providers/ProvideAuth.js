import React, {useContext, createContext, useState, useEffect} from "react"
import {findUserByApiKey, login} from "../clients/user-client";

const authContext = createContext()

export function ProvideAuth({children}) {
    const [remember, setRemember] = useState(() => {
        const local = localStorage.getItem('key')
        return local ? true : false
    })

    const getStoredKey = () => {
        const local = localStorage.getItem('key')
        if (local) {
            return local
        }
        const session = sessionStorage.getItem('key')
        if (session) {
            return session
        }
        return null
    }

    const [user, setUser] = useState()
    const [key, setKey] = useState(getStoredKey)

    useEffect(() => {
        refreshKey(key)
    }, [key])

    const loggedIn = async apiKey => {
        setRemember(true)
        localStorage.setItem('key', apiKey)
        sessionStorage.removeItem('key')
        setKey(apiKey)
        return key
    }

    const signIn = async (loginParam, password, lang, remember) => {
        const apiKey = await login(loginParam, password, lang)
        console.log(apiKey)
        if (remember) {
            setRemember(true)
            localStorage.setItem('key', apiKey)
            sessionStorage.removeItem('key')
        } else {
            setRemember(false)
            sessionStorage.setItem('key', apiKey)
            localStorage.removeItem('key')
        }
        setKey(apiKey)
        return key
    }

    const signOut = () => {
        setUser(null)
        setKey(null)
        localStorage.clear()
        sessionStorage.clear()
        return Promise.resolve()
    }

    const refreshKey = async apiKey => {
        if (!apiKey) {
            return
        }
        const user = await findUserByApiKey(apiKey)
        if (localStorage.getItem('key') !== null) {
            localStorage.setItem('key', apiKey)
        }
        if (sessionStorage.getItem('key') !== null) {
            sessionStorage.setItem('key', apiKey)
        }
        setUser(user)
    }
    const auth = {user, apiKey: key, remember, signIn, loggedIn, signOut, refreshKey}
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    )
}

export function useAuth() {
    return useContext(authContext)
}