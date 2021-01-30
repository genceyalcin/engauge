import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface LoginProps extends RouteComponentProps {
    match: {
        isExact: boolean,
        path: string,
        params: {
            userType: string
        },
        url: string
    }
}
 
export interface LoginState {
    userType: string,
    loginInfo: {
        displayName: string,
        roomID: string
    }
}
 
class Login extends React.Component<LoginProps, LoginState> {
    state = { 
        userType: '', 
        loginInfo: {
            displayName: '',
            roomID: ''
        } 
    }

    componentDidMount() {
        this.setState({ userType: this.props.match.params.userType });
    }

    render() { 
        return ( 
            <React.Fragment>
                <h1>Login {this.state.userType}</h1>
                <form></form>
            </React.Fragment> 
        );
    }
}
 
export default Login;