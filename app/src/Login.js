/* eslint-disable no-unused-vars */
// Disables unused variable warnings

import React, {useEffect, useState} from 'react';

function Login() {
    const [login, setLogin] = useState('');
    const [pass, setPass] = useState('');
    const [canLogin, setCanLogin] = useState(false);

    // Called each time the dependencies change
    useEffect(() => {
        console.log("login", login);
        console.log("pass", pass);
    }, [login, pass]);

    // Called when login changes
        // event = event object that changed
        // target = HTML element that triggered the change
        // value = value of the HTML element
    const handleLoginChange = (event) => {
        setLogin(event.target.value);
    };
    
    const handlePassChange = (event) => {
        setPass(event.target.value);
    };

    // Called when login button is clicked
    const handleSubmit = (event) => {
        event.preventDefault(); // Stop the default action of an event from happening. (Here, it prevents the page from refreshing)
        if (login === 'admin' && pass === 'admin') {
            setCanLogin(true);
            console.log("Can login");
        }
        else {
            setCanLogin(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-8">
                    <h2 className="text-center title_consolas mb-2">This is not a responsive webpage</h2>
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