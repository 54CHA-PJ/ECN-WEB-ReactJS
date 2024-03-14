import React, {useEffect, useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../Context/TokenContext';
import { postServiceData } from '../server/util';

const Login = () => {
    const navigate = useNavigate();
    const { getToken, setToken, removeToken } = useContext(TokenContext);
    const [login, setLogin] = useState('');
    const [pass, setPass] = useState('');

    useEffect(() => {
        const tokenString = getToken();
        const token = JSON.parse(tokenString);
        if (token && token.status === 'USER_LOGGED') {
            navigate('/home');
        }
    }, [getToken, navigate, removeToken]);

    const handleLoginChange = (event) => {
        setLogin(event.target.value);
    };
    
    const handlePassChange = (event) => {
        setPass(event.target.value);
    };

    const checkLogin = async (event) => {
        event.preventDefault();
        const params = {login: login, password: pass};
        const data = await postServiceData("authenticate", params);
        if (data.ok === 'SUCCESS') {
            const token = JSON.stringify({login: login, status:'USER_LOGGED', id:1 });
            // TODO : ID is fixed to 1, it should be the user id from the database
            // TODO : token status should depend on the user role
            setToken(token); 
            navigate('/home'); 
        } else {
            alert("Invalid username or password");
        }
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        checkLogin(event);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center title_consolas mb-2">This is not a responsive webpage</h2>
            <div className="row justify-content-center">
                <div className="col-8">
                    <div className="card mt-5">
                        <div className="card-body">
                            <div className="row justify-content-center">
                                <div className="col-6">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="login">Username:</label>
                                            <input 
                                                type="text" 
                                                id="login" 
                                                name="login" 
                                                placeholder="Enter your username" 
                                                required 
                                                className="form-control"
                                                onChange={handleLoginChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password:</label>
                                            <input 
                                                type="password" 
                                                id="password" 
                                                name="password" 
                                                placeholder="Enter your password" 
                                                required 
                                                className="form-control"
                                                onChange={handlePassChange} />
                                        </div>
                                        <div className="d-flex justify-content-center">
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary btn-block" 
                                                style={{minWidth: '100px'}}
                                                >Login</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;