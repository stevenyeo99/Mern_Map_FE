import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import AuthContext from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import './PlaceItem.css';

const PlaceItem = props => {
    const authCtx = useContext(AuthContext);
    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const history = useHistory();

    const openMapHandler = () => setShowMap(true);

    const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler = () => setShowConfirmModal(true);

    const cancelDeleteWarningHandler = () => setShowConfirmModal(false);

    const confirmDeleteWarningHandler = async () => {
        try {
            await sendRequest(`http://localhost:5000/api/places/${props.id}`, 'DELETE', null, {
                'Content-Type': 'application/json'
            });

            props.onDelete(props.id);
        } catch (err) {
            console.log(err);
        }

        setShowConfirmModal(false);
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onCancel={clearError} />

            {isLoading && <LoadingSpinner asOverlay />}

            <Modal 
                show={showMap} 
                onCancel={closeMapHandler} 
                header={props.address} 
                contentClass="place-item__modal-content" 
                footerClass="place-item__modal-actions" 
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>} 
            >
                <div className='map-container'>
                    <Map center={props.coordinates} zoom={16} />
                </div>
            </Modal>

            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteWarningHandler}
                header={'Are you sure to delete?'}
                footerClass='place-item__modal-actions'
                footer={
                    <React.Fragment>
                        <Button inverse onClick={cancelDeleteWarningHandler}>CANCEL</Button>
                        <Button danger onClick={confirmDeleteWarningHandler}>DELETE</Button>
                    </React.Fragment>
                }
            >
                <p>
                    Are you sure want to delete this place, once delete unable to undone the data.
                </p>
            </Modal>
            
            <li className='place-item'>
                <Card className='place-item__content'>
                    { isLoading && <LoadingSpinner asOverlay />}
                    <div className='place-item__image'>
                        <img src={props.image} alt={props.title} />
                    </div>
                    <div className='place-item__info'>
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className='place-item__actions'>
                        <Button onClick={openMapHandler} inverse>VIEW ON MAP</Button>
                        {
                            authCtx.isLoggedIn && props.creatorId === authCtx.userId && (
                                <React.Fragment>
                                    <Button to={`/places/${props.id}`}>EDIT</Button>
                                    <Button onClick={showDeleteWarningHandler} danger>DELETE</Button>
                                </React.Fragment>
                            )
                        }
                    </div>
                </Card>
            </li>
        </React.Fragment>
    );
};

export default PlaceItem;