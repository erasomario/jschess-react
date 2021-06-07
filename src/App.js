import { Route, Switch } from 'react-router';
import { PrivateRoute } from './components/PrivateRoute';
import LoginPage from './components/LoginPage'
import RecoverPage from './components/RecoverPage'

function App() {
  
  return (
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
  );


  function HomePage() {
    return <h3>Home</h3>;
  }

}


export default App;
