import React from 'react'

export interface LoginProps {
    userType: String
}
 
export interface LoginState {
    
}
 
class Login extends React.Component<LoginProps, LoginState> {
    state = { userType: '' }
    render() { 
        return ( <div>Login</div> );
    }
}
 
export default Login;