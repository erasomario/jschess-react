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

  const signin = (login, password, remember, cb) => {
    apiRequest('/v1/api_keys', 'POST', null, { login, password }, (error, data) => {
      if (remember) {
        localStorage.setItem('user', JSON.stringify(data))
      } else {
        sessionStorage.setItem('user', JSON.stringify(data))
      }
      setUser(data)
      cb(error, data)
    })
  }

  const signout = cb => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    cb();
  };
  return [user, signin, signout]
}