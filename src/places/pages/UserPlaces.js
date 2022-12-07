import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import AuthContext from '../../shared/context/auth-context';

const UserPlaces = props => {
    const authCtx = useContext(AuthContext);
    const [loadedPlaces, setLoadedPlaces] = useState([]);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const userId = useParams().userId;

    useEffect(() => {
        try {
            const fetchPlaces = async () => {
                const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`, 'GET', null, {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authCtx.token
                });

                setLoadedPlaces(responseData.places);
            };

            fetchPlaces();
        } catch (err) {
            console.log(err);
        }
    }, [sendRequest, userId]);

    const placeDeletedHandler = (placeId) => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(prevPlace => prevPlace.id !== placeId));
    }; 

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            { isLoading && <div className='center'><LoadingSpinner asOverlay /></div> }
            { !isLoading && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} /> }
        </React.Fragment>
    );
};

export default UserPlaces;