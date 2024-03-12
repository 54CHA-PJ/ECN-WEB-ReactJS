import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../Context/TokenContext';
import { postServiceData } from '../server/util';

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
                            <th className="actions">Actions &nbsp;&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.person_id}>
                                <td>{user.person_id}</td>
                                <td>{user.person_firstname} {user.person_lastname}</td>
                                <td className="actions">
                                <button 
                                    type="submit" 
                                    className="btn btn-light-primary"
                                    onClick={() => navigate(`/user/${user.person_id}`)} // Moved onClick here
                                >
                                    <img 
                                        className="icon"
                                        src="../assets/edit.png" 
                                        alt="Edit" 
                                    />
                                </button>
                                &nbsp;
                                <button 
                                    type="submit" 
                                    className="btn btn-light-primary"
                                    onClick={() => console.log("delete")} // Moved onClick here
                                >
                                    <img 
                                        className="icon"
                                        src="../assets/delete.png" 
                                        alt="Edit" 
                                    />
                                </button>
                                &nbsp;
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