import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import { useForm } from '../../shared/hooks/form-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import AuthContext from '../../shared/context/auth-context';

import './PlaceForm.css';

const UpdatePlace = () => {
    const authCtx = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [ isPlaceExist, setIsPlaceExist ] = useState(false);
    const history = useHistory();
    const placeId = useParams().placeId;

    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        }
    }, false);

    useEffect(() => {
        try {
            const fetchPlace = async () => {
                const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`, 'GET', null, {
                    'Content-Type': 'application/json'
                });

                const { place } = responseData;

                if (place) {
                    setFormData({
                        title: {
                            value: place.title,
                            isValid: true
                        },
                        description: {
                            value: place.description,
                            isValid: true
                        },
                        address: {
                            value: place.address,
                            isValid: true
                        }
                    }, true);

                    setIsPlaceExist(true);
                }
            };

            fetchPlace();
        } catch (err) {
            console.log(err);
        }
    }, [sendRequest, setFormData, placeId]);

    if (!isPlaceExist && !error) {
        return (
            <div className='center'>
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }

    const formSubmitHandler = async event => {
        event.preventDefault();

        try {
            await sendRequest(`http://localhost:5000/api/places/${placeId}`, 'PATCH', JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value,
                address: formState.inputs.address.value
            }), {
                'Content-Type': 'application/json'
            });

            history.push(`/${authCtx.userId}/places`);
        } catch (err) {
            console.log(err);
        }

        console.log(formState.inputs);
    };

    if (isLoading) {
        return (
            <div className='center'>
                <LoadingSpinner asOverlay />
            </div>
        );
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            { !isLoading && isPlaceExist && <form className='place-form' onSubmit={formSubmitHandler}>
                <Input
                    id='title'
                    element='input'
                    type='text'
                    label='Title'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorMsg={'Please enter a valid title.'}
                    initialValue={formState.inputs.title.value}
                    initialIsValid={formState.inputs.title.isValid}
                    onInput={inputHandler}
                />

                <Input 
                    id='description'
                    element='textarea'
                    label='Description' 
                    validators={[VALIDATOR_MINLENGTH(5)]} 
                    errorMsg={'Please enter a valid description (at least 5 characters).'} 
                    initialValue={formState.inputs.description.value}
                    initialIsValid={formState.inputs.description.isValid}
                    onInput={inputHandler}
                />

                <Input
                    id='address'
                    element='input'
                    label='Address'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorMsg={'Please enter a valid address.'}
                    initialValue={formState.inputs.address.value}
                    initialIsValid={formState.inputs.address.isValid}
                    onInput={inputHandler}
                />

                <Button type='submit' disabled={!formState.isValid}>UPDATE PLACE</Button>
            </form> }
        </React.Fragment>
        
    );
};

export default UpdatePlace;