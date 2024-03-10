import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setToken, removeToken }) { // Receive the setToken and removeToken functions as props
    const navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [pass, setPass] = useState('');

    useEffect(() => {
        removeToken();
    }, [removeToken]);

    const handleLoginChange = (event) => {
        setLogin(event.target.value);
    };
    
    const handlePassChange = (event) => {
        setPass(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (login === 'admin' && pass === 'admin') {
            const token = 'USER_LOGGED';
            setToken(token); 
            navigate('/home');     
        }
        else {
            alert("Invalid username or password");
        }
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