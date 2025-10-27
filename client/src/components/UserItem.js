import React from 'react';
import { Link } from 'react-router-dom';

const UserItem = ({ user, onDelete }) => {
    return (
        <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
                <Link to={`/edit/${user.id}`} className="btn btn-primary">Edit</Link>
                <button onClick={() => onDelete(user.id)} className="btn btn-danger">Delete</button>
            </td>
        </tr>
    );
};

export default UserItem;