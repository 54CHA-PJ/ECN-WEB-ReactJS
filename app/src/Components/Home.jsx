import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import libraryImage from '../assets/library.png';
import { TokenContext } from '../Context/TokenContext';

const Home = () => {
    const navigate = useNavigate();
    const { getToken } = useContext(TokenContext);

    useEffect(() => {
        const tokenString = getToken();
        const token = JSON.parse(tokenString);
        if (!token || token.status !== 'USER_LOGGED') {
            navigate('/');
        }
    }, [getToken, navigate]);

    const tokenString = getToken();
    const token = JSON.parse(tokenString);
    const name = token? token.login : 'Unknown User';

    return (
        <div className="container mt-5 mb-5">
            <h1 className="mb-5 text-center title_consolas">Welcome, {name}</h1>
            <div className="d-flex justify-content-center mb-5">
                <div className="col-sm-3">
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        onClick={() => navigate('/borrow')}> 
                        Borrow a book ?
                    </button> 
                </div>
                <div className="col-sm-3">
                    <button 
                        type="button" 
                        className="btn btn-primary w-100" 
                        onClick={() => navigate('/userBooks')}> 
                        My books
                    </button>
                </div>
            </div>
            <div className="card" style={{ backgroundColor: '#f0f3e0' }}>
                <div className="card-body">
                    <p className="text-justify">
                        Our library offers a wide selection of books and resources, both physical and digital. 
                        We strive to provide a welcoming and inclusive environment for all our members. 
                        Come explore, learn, and discover with us.<br /><br />
                        Please note that this is a fictional library and this website is for educational purposes only.
                        Any resemblance to real products or services is coincidental. <br /><br />
                        Don't forget to logout after using the library !
                    </p>
                    <div className="d-flex justify-content-center">
                        <img src={libraryImage} alt="Library" className="img-fluid w-25" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;