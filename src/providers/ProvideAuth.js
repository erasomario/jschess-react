import React, { useContext, createContext, useState } from "react"
import {apiRequest} from '../utils/ApiClient'

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

  const [user, setUser] = useState(null);

  const signin = (login, password, cb) => {
    apiRequest('/v1/api_keys', 'POST', { login, password }, (error, data) => {
      setUser(data);
      cb(error, data);
    })
  }

  const signout = cb => {
    setUser(null);
    cb();
  };

  return [user, signin, signout]
}