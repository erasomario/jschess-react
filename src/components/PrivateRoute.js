import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../providers/ProvideAuth'

export function PrivateRoute({ children, ...rest }) {
    const { apiKey, user } = useAuth()
    console.log(apiKey, user)
    return (
        <Route {...rest}
            render={({ location }) => {
                return (apiKey && user) ? (children) : (<Redirect
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