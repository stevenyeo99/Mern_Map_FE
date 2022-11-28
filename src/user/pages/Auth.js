import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import { useForm } from '../../shared/hooks/form-hook';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import AuthContext from '../../shared/context/auth-context';

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

    const authSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
        authCtx.login();
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
        <Card className='authentication'>
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
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorMsg='Please enter a valid password, at least 5 characters.'
                    onInput={inputHandler}
                />
                
                <Button disabled={!formState.isValid}>{ !isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
            </form>

            <Button inverse onClick={switchModeHandler}>SWITCH TO {!isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
        </Card>
    );
};

export default Auth;