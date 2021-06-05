import { useAuth } from '../providers/ProvideAuth'
import { useHistory, useLocation } from 'react-router-dom'
import { useInput } from '../hooks/useInput'
import { useState } from 'react'

import { apiRequest } from '../utils/ApiClient'

export default function RecoverPage() {

  const [error, setError] = useState();
  let history = useHistory();
  let [, signIn] = useAuth();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };

  let startRecover = (e) => {
    e.preventDefault();
    apiRequest('/v1/recovery_keys/', 'POST', { login: loginProps.value }, (error, data) => {
      if (error) {
        setError(error);
      } else {
        
      }
    })
  };

  let [loginProps] = useInput("");

  return (
    <>
      <h1>Recuperar</h1>
      <form onSubmit={startRecover}>
        <input {...loginProps} type="text" placeholder="Email o nombre de usuario" required />
        {error && <div>{error}</div>}
        <button>Recuperar</button>
      </form>
    </>
  );
}