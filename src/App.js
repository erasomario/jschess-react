import { Route, Switch } from 'react-router'
import { PrivateRoute } from './components/PrivateRoute'
import HomePage from './components/HomePage'
import { BrowserRouter as Router } from 'react-router-dom'
import { ProvideAuth } from './providers/ProvideAuth'
import { ProvideGame } from './providers/ProvideGame'
import RecoverPage from './components/users/RecoverPage'
import LoginPage from './components/users/LoginPage'
import RegisterPage from './components/users/RegisterPage'
import { ProvideSocket } from './providers/ProvideSocket'

function App() {

  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <Route path={`${process.env.PUBLIC_URL}/recover`}>
            <RecoverPage />
          </Route>
          <Route path={`${process.env.PUBLIC_URL}/login`}>
            <LoginPage />
          </Route>
          <Route path={`${process.env.PUBLIC_URL}/register`}>
            <RegisterPage />
          </Route>
          <PrivateRoute path={`${process.env.PUBLIC_URL}/`}>            
              <ProvideSocket>
                <ProvideGame>
                  <HomePage />
                </ProvideGame>
              </ProvideSocket>            
          </PrivateRoute>
        </Switch>
      </Router>
    </ProvideAuth>
  );
}

export default App;
