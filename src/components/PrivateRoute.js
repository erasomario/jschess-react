import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../providers/ProvideAuth'

export function PrivateRoute({ children, ...rest }) {
    const [user] = useAuth();
    return (
        <Route {...rest}
            render={({ location }) => {
                return user ? (children) : (<Redirect
                    to={{
                        pathname: "/login",
                        state: { from: location }
                    }}
                />)
            }
            }
        />
    );
}