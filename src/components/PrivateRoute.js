import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../providers/ProvideAuth'

export function PrivateRoute({ children, ...rest }) {
    const { apiKey } = useAuth()
    return (
        <Route {...rest}
            render={({ location }) => {
                return apiKey ? (children) : (<Redirect
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