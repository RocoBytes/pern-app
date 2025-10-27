import React, { useState, useEffect } from 'react';
import { createUser, updateUser } from '../services/userService';

const UserForm = ({ user, onUserSaved }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { name, email };

        if (user) {
            await updateUser(user.id, userData);
        } else {
            await createUser(userData);
        }

        onUserSaved();
        setName('');
        setEmail('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <button type="submit">{user ? 'Update' : 'Create'} User</button>
        </form>
    );
};

export default UserForm;