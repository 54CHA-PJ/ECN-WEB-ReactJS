import React, { useEffect, useState, useContext } from 'react';
import { TokenContext } from '../Context/TokenContext';
import { getServiceData } from '../server/util';
import { useNavigate } from 'react-router-dom';

const User = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const { getToken } = useContext(TokenContext);

    useEffect(() => {
        const tokenString = getToken();
        const token = JSON.parse(tokenString);
        if (!token || token.status !== 'USER_LOGGED') {
            navigate('/');
        }
    }, [getToken, navigate]);

    const fetchUser = async (id) => {
        try {
            const user = await getServiceData(`user/${id}`);
            setUserId(user.person_id || '');
            setFirstName(user.person_firstname || '');
            setLastName(user.person_lastname || '');
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    useEffect(() => {
        fetchUser(2);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-5 text-center title_consolas">Edit User Information</h1>
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="userId">User ID:</label>
                            <input type="text" id="userId" className="form-control" value={userId} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name:</label>
                            <input type="text" id="firstName" className="form-control" value={firstName} onChange={e => setFirstName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name:</label>
                            <input type="text" id="lastName" className="form-control" value={lastName} onChange={e => setLastName(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Save Changes</button>
                    </form>
                </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <a href="home.html" className="btn btn-warning">HOME</a>
            </div>
        </div>
    );
};

export default User;