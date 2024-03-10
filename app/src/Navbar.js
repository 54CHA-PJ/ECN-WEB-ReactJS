import React from 'react';
import { useNavigate } from 'react-router-dom';

import logoImage from './assets/logo_w.png';
import logoutImage from './assets/logout.png';

function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="d-flex w-100 justify-content-between">
            <div className="logo-bg-dark rounded mr-3">
            <button className="navbar-brand pl-4" style={{background: 'none', border: 'none', outline: 'none'}} onClick={() => navigate('/home')}>
                <img src={logoImage} alt="Home" className="logo" />
            </button>
            </div>
            <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item active nav-item">
                <button className="nav-link" style={{background: 'none', border: 'none', outline: 'none'}} onClick={() => navigate('/users')}>Users<span className="sr-only">(current)</span></button>
                </li>
                <li className="nav-item">
                <button className="nav-link" style={{background: 'none', border: 'none', outline: 'none'}} onClick={() => navigate('/books')}>Books<span className="sr-only">(current)</span></button>
                </li>
                <li className="nav-item">
                <button className="nav-link" style={{background: 'none', border: 'none', outline: 'none'}} onClick={() => navigate('/borrows')}>Borrows<span className="sr-only">(current)</span></button>
                </li>
            </ul>
            </div>
            <div className="logo-bg-dark rounded">
            <button className="navbar-brand pl-3" style={{background: 'none', border: 'none', outline: 'none'}} onClick={() => navigate('/')}>
                <img src={logoutImage} alt="Logout" className="logo" />
            </button>
            </div>
        </div>
        </nav>
    );
}

export default Navbar;