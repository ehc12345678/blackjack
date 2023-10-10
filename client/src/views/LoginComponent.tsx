import React, { ChangeEvent, useState, useEffect } from 'react';

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

export const LoginComponent = ({ onLogin, onRegister }: LoginProperties) => {
    const [registeredUsers, setRegisteredUsers] = useState<Array<UserIdPair>>([]);
    const [chosenUser, setChosenUser] = useState<string | null>(null);
    const [registerName, setRegisterName] = useState<string | null>(null);

    useEffect(() => {
        const getUsers = async () => {
            const { data } = await axios.get("/api/user") as AxiosResponse<Array<UserIdPair>>;
            setRegisteredUsers(data);
            setChosenUser(data.length > 0 ? data[0].id : '');
        };
        getUsers()
    }, []);

    const handleLoginSelectChange = (event : ChangeEvent<HTMLSelectElement>) => {
        setChosenUser(event.target.value);
    };

    const handleRegisterNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRegisterName(event.target.value);
    };

    const handleLogin = () => {
        onLogin(chosenUser || '');
    }

    const handleRegister = () => {
        if (registerName?.length && registerName?.length > 0) {
            onRegister(registerName);
        }
    }

    const getLoginButtonControls = () => {
        if (registeredUsers.length > 0) {
            return (
                <div className="loginButtonDiv">
                    <select onChange={handleLoginSelectChange}>
                        { registeredUsers.map(player => <option key={player.id} id={player.id}>{player.name}</option>)}
                    </select>
                    <button onClick={() => handleLogin()}>Login</button>
                </div>
            );
        }
    }

    return (
        <div className="loginForm">
            {getLoginButtonControls()}
            <div className="registerButtonDiv">
                <input type="text" onChange={handleRegisterNameChange} value={registerName || ""}/>
                <button onClick={() => handleRegister()}>Register</button>
            </div>
        </div>
    )
}