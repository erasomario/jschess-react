import { Route, Switch } from 'react-router';
import { PrivateRoute } from './components/PrivateRoute';
import LoginPage from './components/LoginPage'
import RecoverPage from './components/RecoverPage'
import HomePage from './components/HomePage'
import RegisterPage from './components/RegisterPage'

function App() {
  
  return (
    <Switch>
      <Route path="/recover">
        <RecoverPage />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/register">
        <RegisterPage />
      </Route>
      <PrivateRoute path="/">
        <HomePage />
      </PrivateRoute>
    </Switch>
  );
}

export default App;
