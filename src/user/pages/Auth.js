import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import { useForm } from '../../shared/hooks/form-hook';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import AuthContext from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';

import './Auth.css';

const Auth = props => {
    const authCtx = useContext(AuthContext);

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const authSubmitHandler = async event => {
        event.preventDefault();

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/login', 
                    'POST', 
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }), 
                    {
                        'Content-Type': 'application/json'
                    }
                );

                console.log(responseData);

                authCtx.login(responseData.user.id);
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/signup',
                    'POST',
                    JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );

                console.log(responseData);
                authCtx.login(responseData.user.id);
            } catch (err) {
                console.log(err.message);
            }
        }
    };

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined
            }, (formState.inputs.email.isValid && formState.inputs.password.isValid))
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                }
            }, false);
        }

        setIsLoginMode(prevMode => !prevMode);
    };

    return (
        <React.Fragment>
            { error && <ErrorModal error={error} onClear={clearError} /> }
            <Card className='authentication'>
                { isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {
                        !isLoginMode && (
                            <Input
                                id='name'
                                type='text'
                                element='input'
                                label='Your Name'
                                validators={[VALIDATOR_REQUIRE()]}
                                errorMsg='Please enter a name.'
                                onInput={inputHandler}
                            />
                        )
                    }

                    <Input 
                        id='email'
                        type='email'
                        element='input'
                        label='Email'
                        initialValue={formState.inputs.email.value}
                        initialValid={formState.inputs.email.isValid}
                        validators={[VALIDATOR_EMAIL()]}
                        errorMsg='Please enter a valid email address.'
                        onInput={inputHandler}
                    />

                    <Input 
                        id='password'
                        type='password'
                        element='input'
                        label='Password'
                        initialValue={formState.inputs.password.value}
                        initialValid={formState.inputs.password.isValid}
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorMsg='Please enter a valid password, at least 5 characters.'
                        onInput={inputHandler}
                    />
                    
                    <Button disabled={!formState.isValid}>{ !isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
                </form>

                <Button inverse onClick={switchModeHandler}>SWITCH TO {!isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
            </Card>
        </React.Fragment>
    );
};

export default Auth;