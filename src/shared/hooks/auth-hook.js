import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState();
    const [tokenExpiryDateTime, setTokenExpiryDateTime] = useState();
    const [userId, setUserId] = useState();

    const login = useCallback((userId, token, expirationDateTime) => {
        setUserId(userId);
        setToken(token);
        const tokenExpiryDateTime = expirationDateTime || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpiryDateTime(tokenExpiryDateTime);
        localStorage.setItem('userData', JSON.stringify({
            userId,
            token,
            tokenExpiryDateTime: tokenExpiryDateTime.toISOString()
        }));
    }, []);

    const logout = useCallback((userId) => {
        setUserId(null);
        setToken(null);
        setTokenExpiryDateTime(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        if (token && tokenExpiryDateTime) {
            const remainingTime = tokenExpiryDateTime.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpiryDateTime]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (userData && userData.token && (new Date(userData.tokenExpiryDateTime) > new Date())) {
            login(userData.userId, userData.token, new Date(userData.tokenExpiryDateTime));
        }
    }, [login]);

    return {
        token,
        userId,
        login,
        logout
    };
};