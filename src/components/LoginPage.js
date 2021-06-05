import { useAuth } from '../providers/ProvideAuth'
import { useHistory, useLocation, Link } from 'react-router-dom'
import { useInput } from '../hooks/useInput'
import { useState, UseState } from 'react'

export default function LoginPage() {
  const [error, setError] = useState();
  let history = useHistory();
  let [, signIn] = useAuth();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };

  let login = (e) => {
    e.preventDefault();
    signIn(loginProps.value, passProps.value, (error, usr) => {
      if (usr) {
        history.replace(from);
      } else {
        setError(error);
      }
    });
  };

  let [loginProps] = useInput("");
  let [passProps] = useInput("");

  return (
    <form onSubmit={login}>
      <input {...loginProps} type="text" placeholder="Email o nombre de usuario" required />
      <input {...passProps} type="password" placeholder="Contraseña" required />
      {error && <div>{error}</div>}
      <Link to="/recover">Olvidé mi usuario o Contraseña</Link>
      <button>Log in</button>
    </form>
  );
}