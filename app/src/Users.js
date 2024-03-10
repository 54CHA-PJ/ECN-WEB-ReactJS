import React from 'react';

const Users = () => {
    const users = [
        { id: 1, name: 'Mark', surname: 'Zuckerberg', email: 'mark.zuckerberg@facebook.com' },
        { id: 2, name: 'Bill', surname: 'Gates', email: 'bill.gates@microsoft.com' },
        { id: 3, name: 'Elon', surname: 'Musk', email: 'elon.musk@tesla.com' },
    ];

    return (
        <div>
            <h1>User Database</h1>
            <table>
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
                            <td>{user.name}</td>
                            <td>{user.surname}</td>
                            <td>{user.email}</td>
                            <td>
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;