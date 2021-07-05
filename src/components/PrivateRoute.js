import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../providers/ProvideAuth'

export function PrivateRoute({ children, ...rest }) {
    const { key } = useAuth();
    return (
        <Route {...rest}
            render={({ location }) => {
                return key ? (children) : (<Redirect
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