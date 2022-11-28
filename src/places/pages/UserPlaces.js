import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

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

const UserPlaces = props => {
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);

    return <PlaceList items={loadedPlaces} />
};

export default UserPlaces;