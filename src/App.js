import { Route, Switch } from 'react-router'
import { PrivateRoute } from './components/PrivateRoute'
import HomePage from './components/HomePage'
import { BrowserRouter as Router } from 'react-router-dom'
import { ProvideAuth } from './providers/ProvideAuth'
import { ProvideGame } from './providers/ProvideGame'
import { ProvideSocket } from './providers/ProvideSocket'
import "./App.scss"
import LoginFrame from './components/users/LoginFrame'

function App() {

  return (
    <ProvideAuth>
      <Router basename="/chess">
        <Switch>
          <Route path="/login">
            <LoginFrame />
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
