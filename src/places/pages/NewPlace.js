import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import AuthContext from '../../shared/context/auth-context';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import './PlaceForm.css';

const NewPlace = () => {
    const [formState, inputHandler] = useForm({
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
        },
        image: {
            value: null,
            isValid: false
        }
    }, false);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    
    const history = useHistory();
    const authCtx = useContext(AuthContext);

    const formSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('image', formState.inputs.image.value);
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places`, 'POST', formData, {
                Authorization: 'Bearer ' + authCtx.token
            });

            console.log(responseData);

            history.push('/');
        } catch (err) {
            console.log(err.message);
        }

        console.log(formState.inputs);
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <form className='place-form' onSubmit={formSubmitHandler}>
                { isLoading && <LoadingSpinner asOverlay /> }
                <Input 
                    id='title' 
                    element='input' 
                    type='text' 
                    label='Title' 
                    validators={[VALIDATOR_REQUIRE()]} 
                    errorMsg={'Please enter a valid title.'} 
                    onInput={inputHandler} 
                />

                <Input 
                    id='description'
                    element='textarea'
                    label='Description' 
                    validators={[VALIDATOR_MINLENGTH(5)]} 
                    errorMsg={'Please enter a valid description (at least 5 characters).'} 
                    onInput={inputHandler} 
                />

                <Input
                    id='address'
                    element='input'
                    label='Address'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorMsg={'Please enter a valid address.'}
                    onInput={inputHandler}
                />

                <ImageUpload
                    id='image'
                    onInput={inputHandler}
                    errorText='Please provide an image.'
                />

                <Button type='submit' disabled={!formState.isValid}>ADD PLACE</Button>
            </form>
        </React.Fragment>
    );
};

export default NewPlace;