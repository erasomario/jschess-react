import { Route, Switch } from 'react-router';
import { PrivateRoute } from './components/PrivateRoute';
import LoginPage from './components/LoginPage'
import RecoverPage from './components/RecoverPage'

function App() {
  return (
    <div>
      <header>
        <div>
          <Switch>
            <Route path="/recover">
              <RecoverPage />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
            <PrivateRoute path="/">
              <HomePage />
            </PrivateRoute>
          </Switch>
        </div>
      </header>
    </div>
  );


  function HomePage() {
    return <h3>Home</h3>;
  }

}


export default App;
