import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../services/userService';
import UserItem from './UserItem';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getUsers();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>User List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <UserItem key={user.id} user={user} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;