import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import libraryImage from './assets/library.png';

function Home({ getToken }) {

    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
            if (!token) {
            navigate('/');
            }
        }, [getToken, navigate]);

    return (
        <div className="container mt-5 mb-5">
            <h1 className="mb-5 text-center title_consolas">Welcome to the Digital Library</h1>
            <div className="card" style={{ backgroundColor: '#f0f3e0' }}>
                <div className="card-body">
                    <p className="text-justify">
                        Our library offers a wide selection of books and resources, both physical and digital. 
                        We strive to provide a welcoming and inclusive environment for all our members. 
                        Come explore, learn, and discover with us.<br /><br />
                        Please note that this is a fictional library and this website is for educational purposes only.
                        Any resemblance to real products, services, or libraries is purely coincidental. Dont forget to logout after using the library.
                    </p>
                    <div className="d-flex justify-content-center">
                        <img src={libraryImage} alt="Library" className="img-fluid w-50" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;