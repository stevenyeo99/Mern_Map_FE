import React, { useEffect, useState } from 'react';

import UserList from '../components/UserList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
    const [loadedUsers, setLoadedUsers] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {
        try {
            const sendData = async () => {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users`,
                    'GET',
                    null,
                    {
                        'Content-Type': 'application/json'
                    }
                );

                setLoadedUsers(responseData.users);
            };

            sendData();
        } catch (err) {
            console.log(err.message);
        }
    }, [sendRequest]);

    return (
        <React.Fragment>
            { error && <ErrorModal error={error} onClear={clearError} /> }
            { isLoading && <div className='center'><LoadingSpinner asOverlay /></div> }
            { !isLoading && loadedUsers && <UserList items={loadedUsers} /> }
        </React.Fragment>
    );
};

export default Users;