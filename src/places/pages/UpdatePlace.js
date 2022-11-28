import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import { useForm } from '../../shared/hooks/form-hook';

import './PlaceForm.css';

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most cool place',
        imageUrl: 'https://media.istockphoto.com/id/496799869/photo/the-empire-state-building.jpg?s=612x612&w=0&k=20&c=Q2ahP61k-xOSkLD0fImFIFkaMLOFGU3TJYDJXe5J1xY=',
        address: 'New York, NY 10001, USA',
        location: {
            lat: 40.7485452,
            lng: -73.9857635
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Tokyo Tower',
        description: 'Tokyo Tower Beatiful View',
        imageUrl: 'https://rimage.gnst.jp/livejapan.com/public/article/detail/a/00/00/a0000146/img/basic/a0000146_main.jpg?20201224150509',
        address: '4 Chome-2-8 Shibakoen, Minato City, Tokyo 105-0011, Japan',
        location: {
            lat: 35.6585805,
            lng: 139.7454329
        },
        creator: 'u2'
    }
];

const UpdatePlace = () => {
    const [isLoading, setIsLoading] = useState(true);
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

    const identifierPlace = DUMMY_PLACES.find(place => place.id === placeId);

    useEffect(() => {
        if (identifierPlace) {
            setFormData({
                title: {
                    value: identifierPlace.title,
                    isValid: true
                },
                description: {
                    value: identifierPlace.description,
                    isValid: true
                },
                address: {
                    value: identifierPlace.address,
                    isValid: true
                }
            }, true);
        }

        setIsLoading(false);
    }, [identifierPlace, setFormData]);

    if (!identifierPlace) {
            return (
                <div className='center'>
                    <Card>
                        <h2>Could not find place!</h2>
                    </Card>
                </div>
            );
        }

    const formSubmitHandler = event => {
        event.preventDefault();

        console.log(formState.inputs);
    };

    if (isLoading) {
        return (
            <div className='center'>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <form className='place-form' onSubmit={formSubmitHandler}>
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
        </form>
    );
};

export default UpdatePlace;