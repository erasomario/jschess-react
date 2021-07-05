import React, { useContext, createContext, useState, useEffect } from "react"
import { apiRequest } from '../utils/ApiClient'

const authContext = createContext();

export function ProvideAuth({ children }) {
  const [user, setUser] = useState()
  const [key, setKey] = useState(getStoredKey())

  useEffect(() => {
    refreshKey(key)
  }, [key])

  const signIn = async (login, password, remember) => {
    const user = await apiRequest('/v1/api_keys', 'POST', null, { login, password })
    if (remember) {
      localStorage.setItem('key', user.api_key)
      sessionStorage.removeItem('key')
    } else {
      sessionStorage.setItem('key', user.api_key)
      localStorage.removeItem('key')
    }
    setKey(user.api_key)
    return key
  }

  const signOut = () => {
    setUser(null)
    setKey(null)
    localStorage.removeItem('key')
    sessionStorage.removeItem('key')
    return Promise.resolve()
  }

  const refreshKey = async (apiKey) => {
    if (!apiKey) {
      return
    }
    const usr = await apiRequest('/v1/api_keys', 'PUT', apiKey, null);
    if (localStorage.getItem('key') !== null) {
      localStorage.setItem('key', apiKey);
    }
    if (sessionStorage.getItem('key') !== null) {
      sessionStorage.setItem('key', apiKey);
    }
    setUser(usr);
  }
  const auth = { user, key, signIn, signOut, refreshKey }
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  )
}

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

export function useAuth() {
  return useContext(authContext);
}