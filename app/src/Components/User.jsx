import React, { useEffect, useState, useContext } from 'react';
import { TokenContext } from '../Context/TokenContext';
import { getServiceData } from '../server/util';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'; // Import useParams

const User = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const { getToken } = useContext(TokenContext);
    const { id } = useParams(); // Get the id from the URL

    useEffect(() => {
        const tokenString = getToken();
        const token = JSON.parse(tokenString);
        if (!token || token.status !== 'USER_LOGGED') {
            navigate('/');
        }
    }, [getToken, navigate]);

    const fetchUser = async (id) => {
        try {
            console.log('Fetching user with ID:', id); // Add this line
            const request = await getServiceData(`user/${id}`);
            const user = request[0];
            setUserId(user.person_id || '');
            setFirstName(user.person_firstname || '');
            setLastName(user.person_lastname || '');
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    useEffect(() => {
        fetchUser(id); // Fetch the user with the id from the URL
    }, [id]);

    useEffect(() => {
        if (userId && firstName && lastName) {
            console.log('USER: (' + userId + ', ' + firstName + ', ' + lastName + ')' );
        }
    }, [userId, firstName, lastName]);

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
                        <div className="d-flex justify-content-center ">
                            <button 
                                type="submit" 
                                className="btn btn-primary mr-5">
                                Save Changes
                            </button> 
                            <button 
                                type="button" 
                                className="btn btn-warning ml-5" 
                                onClick={() => navigate('/users')}> 
                                Back to Users
                            </button>
                        </div>
                    </form>
                </div>

            </div>

        </div>
    );
};

export default User;