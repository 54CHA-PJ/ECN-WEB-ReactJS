import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../Context/TokenContext';
import { postServiceData, formatDate } from '../server/util';

const fetchUsers = async (setUsersFunc) => {
    try {
        const data = await postServiceData('users');
        if (Array.isArray(data)) {
            setUsersFunc(data);
        } else {
            console.error('Unexpected server response:', data);
        }
    } catch (error) {
        console.error(error);
    }
};

const deleteUser = async (userId) => {
    try {
        const deleteResponse = await postServiceData("deleteUser", { person_id: userId });
        if (deleteResponse && deleteResponse.ok === 'SUCCESS') {
            return true;
        }
        else {
            throw new Error('Delete failed');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

const Users = () => {
    const navigate = useNavigate();
    const { getToken } = useContext(TokenContext);
    const [users, setUsers] = useState([]); 

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate('/');
        }
    }, [getToken, navigate]);

    useEffect(() => {
        fetchUsers(setUsers);
    }, []);

    const refreshUsers = () => fetchUsers(setUsers);

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            await deleteUser(userId);
            refreshUsers();
        }
    }

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
                            <th>Birthdate</th>
                            <th className="actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.person_id}>
                                <td>{user.person_id}</td>
                                <td>{user.person_firstname} {user.person_lastname}</td>
                                <td>{formatDate(user.person_birthdate) || 'N/A'}</td>
                                <td className="actions">
                                    <button 
                                        type="submit" 
                                        className="btn btn-light-primary mr-2"
                                        onClick={() => navigate(`/user/${user.person_id}`)}
                                    >
                                        <img 
                                            className="icon"
                                            src="../assets/edit.png" 
                                            alt="Edit" 
                                        />
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-light-primary"
                                        onClick={() => handleDelete(user.person_id)}
                                    >
                                        <img 
                                            className="icon"
                                            src="../assets/delete.png" 
                                            alt="Delete" 
                                        />
                                    </button>
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