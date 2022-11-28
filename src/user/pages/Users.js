import React from 'react';

import UserList from '../components/UserList';

const Users = () => {
    const USERS = [
        {
            id: 'u1',
            name: 'Steven',
            image: 'https://media.licdn.com/dms/image/D5603AQEQRPh6syL9Ow/profile-displayphoto-shrink_200_200/0/1666093221065?e=1672876800&v=beta&t=wN5lQ1zwvxnQFDOdjFZGFtN5pJIk51vIpyRDnAbOvcE',
            places: 8
        }
    ];

    return (
        <UserList items={USERS} />
    );
};

export default Users;