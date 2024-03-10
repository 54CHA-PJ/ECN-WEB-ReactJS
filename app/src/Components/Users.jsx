import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../Context/TokenContext';

const Users = () => {
    const navigate = useNavigate();
    const { getToken } = useContext(TokenContext);

    useEffect(() => {
        const token = getToken();
            if (!token) {
            navigate('/');
            }
        }, [getToken, navigate]);

    const users = [
        { id: 1, name: 'Mark', surname: 'Zuckerberg', email: 'mark.zuckerberg@facebook.com' },
        { id: 2, name: 'Bill', surname: 'Gates', email: 'bill.gates@microsoft.com' },
        { id: 3, name: 'Elon', surname: 'Musk', email: 'elon.musk@tesla.com' },
    ];

    return (
        <div className="container mt-5">
            <h1 className="mb-5 text-center title_consolas">User Database</h1>
            <div className="card">
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name} {user.surname}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button className="btn btn-primary mr-2">Edit</button>
                                        <button className="btn btn-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Users;