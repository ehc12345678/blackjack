import React, { Component, ChangeEvent } from 'react';

import axios, { AxiosResponse } from 'axios';

type LoginProperties = {
    onLogin: (loginId: string) => void,
    onRegister: (name: string) => void
};

type LoginState = {
    registeredUsers: Array<UserIdPair>;
    chosenUser: string,
    registerName: string;
};

type UserIdPair = {
    id: string,
    name: string
};

export class LoginComponent extends Component<LoginProperties, LoginState> {
    constructor(props: LoginProperties) {
        super(props);
        this.state = { registeredUsers: [], chosenUser: '', registerName: '' };
    }

    async componentDidMount() {
        const { data } = await axios.get("/api/user") as AxiosResponse<Array<UserIdPair>>;
        this.setState({...this.state, registeredUsers: data});
    }

    handleLoginSelectChange = (event : ChangeEvent<HTMLSelectElement>) => {
        this.setState({...this.state, chosenUser: event.target.value});
    };

    handleRegisterNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({...this.state, registerName: event.target.value})
    };

    handleLogin() {
        this.props.onLogin(this.state.chosenUser);
    }

    handleRegister() {
        if (this.state.registerName.length > 0) {
            this.props.onRegister(this.state.registerName);
        }
    }

    getLoginButtonControls() {
        if (this.state.registeredUsers.length > 0) {
            return (
                <div className="loginButtonDiv">
                    <select onChange={this.handleLoginSelectChange}>
                        { this.state.registeredUsers.map(player => <option id={player.id}>{player.name}</option>)}
                    </select>
                    <button onClick={() => this.handleLogin()}>Login</button>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="loginForm">
                {this.getLoginButtonControls()}
                <div className="registerButtonDiv">
                    <input type="text" onChange={this.handleRegisterNameChange} value={this.state.registerName}/>
                    <button onClick={() => this.handleRegister()}>Register</button>
                </div>
            </div>
        )
    }
}