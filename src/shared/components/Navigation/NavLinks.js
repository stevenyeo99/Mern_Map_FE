import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import Button from '../FormElements/Button';

import './NavLinks.css';

const NavLinks = props => {
    const authCtx = useContext(AuthContext);

    return (
        <ul className='nav-links'>
            <li>
                <NavLink to='/' exact>ALL USERS</NavLink>
            </li>
            
            { authCtx.isLoggedIn && (
                    <li>
                        <NavLink to={`/${authCtx.userId}/places`}>MY PLACES</NavLink>
                    </li>
                )
            }

            { authCtx.isLoggedIn && (
                    <li>
                        <NavLink to='/places/new'>NEW PLACE</NavLink>
                    </li>
                )
            }

            { !authCtx.isLoggedIn && (
                    <li>
                        <NavLink to='/auth'>AUTHENTICATE</NavLink>
                    </li>
                )
            }

            { authCtx.isLoggedIn && (
                    <li>
                        <Button onClick={authCtx.logout}>LOGOUT</Button>
                    </li>
                )
            }
        </ul>
    );
};

export default NavLinks;