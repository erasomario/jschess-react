import { Route, Switch } from 'react-router';
import { PrivateRoute } from './components/PrivateRoute';
import HomePage from './components/HomePage'
import { BrowserRouter as Router } from 'react-router-dom'
import { ProvideAuth } from './providers/ProvideAuth'
import { ProvideGame } from './providers/ProvideGame'
import RecoverPage from './components/users/RecoverPage'
import LoginPage from './components/users/LoginPage'
import RegisterPage from './components/users/RegisterPage'
import { ProvideSocket } from './providers/ProvideSocket';
import { YesNoDialog } from './components/games/YesNoDialog';

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
          <PrivateRoute path="/">            
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
