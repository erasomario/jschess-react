import React, { useContext, createContext, useState } from "react"
import { apiRequest } from '../utils/ApiClient'

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {

  const loadStoredUser = () => {
    let local = localStorage.getItem('user');
    if (local) {
      return JSON.parse(local);
    }
    let session = sessionStorage.getItem('user');
    if (session) {
      return JSON.parse(session);
    }
    return null;
  }

  console.log('useState: user');
  const [user, setUser] = useState(loadStoredUser());

  const signin = (login, password, remember) => {
    return apiRequest('/v1/api_keys', 'POST', null, { login, password })
      .then(key => {
        if (remember) {
          localStorage.setItem('user', JSON.stringify(key))
          sessionStorage.removeItem('user')
        } else {
          sessionStorage.setItem('user', JSON.stringify(key))
          localStorage.removeItem('user')
        }
        setUser(key)
        return key
      })
  }

  const signout = cb => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    cb();
  };

  const refreshKey = () => {
    return apiRequest('/v1/api_keys', 'PUT', user.api_key, null).then(key => {
      if (localStorage.getItem('user') !== null) {
        localStorage.setItem('user', JSON.stringify(key))
      }
      if (sessionStorage.getItem('user') !== null) {
        sessionStorage.setItem('user', JSON.stringify(key))
      }
      setUser(key)
    })
  }

  return [user, signin, signout, refreshKey]
}