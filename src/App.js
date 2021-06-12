import { Route, Switch } from 'react-router';
import { PrivateRoute } from './components/PrivateRoute';
import LoginPage from './components/LoginPage'
import RecoverPage from './components/RecoverPage'
import HomePage from './components/HomePage'
import RegisterPage from './components/RegisterPage'
import { BrowserRouter as Router } from 'react-router-dom'
import { ProvideAuth } from './providers/ProvideAuth'
import { ProvideGame } from './providers/ProvideGame'

function App() {

  return (
    <ProvideAuth>
      <Router>
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
          <PrivateRoute path="/secret">
            <h1>Secret</h1>
          </PrivateRoute>
          <PrivateRoute path="/">
            <ProvideGame>
              <HomePage />
            </ProvideGame>
          </PrivateRoute>
        </Switch>
      </Router>
    </ProvideAuth>
  );
}

export default App;
