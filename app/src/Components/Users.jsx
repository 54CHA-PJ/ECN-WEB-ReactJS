import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../Context/TokenContext';
import { postServiceData, formatDate, stringToDate } from '../server/util';

const Users = () => {
    const navigate = useNavigate();
    const { getToken } = useContext(TokenContext);
    const [users, setUsers] = useState([]);

    const fetchUsers = useCallback(async () => {
        try {
            const data = await postServiceData('users');
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error('Unexpected server response:', data);
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate('/');
        }

        fetchUsers();
    }, [getToken, navigate, fetchUsers]);

    const deleteUser = async (userId) => {
        try {
            const deleteResponse = await postServiceData("deleteUser", { person_id: userId });
            if (deleteResponse && deleteResponse.ok === 'SUCCESS') {
                fetchUsers(); // Refresh users after successful delete
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

    const createUser = async () => {
        const params = {
            person_firstname: '',
            person_lastname: '',
            person_birthdate: stringToDate('01/01/1970')
        };
        try {
            const response = await postServiceData('createUser', params);
            if (response) {
                const new_id = (response.data)[0].person_id;
                console.log('USER CREATED:', new_id);
                navigate(`/user/${new_id}`);
                fetchUsers(); // Refresh users after successful create
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };
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
        <div className="d-flex flex-column align-items-center justify-content-center mb-5">
            <h1 className="text-center title_consolas mb-5">User Database</h1>
            <button 
                type="button" 
                className="btn btn-success" 
                onClick={createUser}> 
                Create a new User
                </button>
            </div>
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