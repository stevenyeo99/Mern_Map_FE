import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequest = useRef([]);

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        try {
            const httpAbortCtrl = new AbortController();
            activeHttpRequest.current.push(httpAbortCtrl);

            console.log(activeHttpRequest);
            console.log(activeHttpRequest.current);
            console.log(body);

            const response = await fetch(url, {
                method,
                headers,
                body,
                signal: httpAbortCtrl.signal
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message);
            }

            setIsLoading(false);

            return responseData;
        } catch (err) {
            setIsLoading(false);
            setError(err.message || 'Error occur during call API.');
            throw new Error(err.message);
        }
    }, []);

    const clearError = () => {
        setError(null);
    }

    useEffect(() => {
        return () => {
            activeHttpRequest.current.forEach(abortCtrl => {
                abortCtrl.abort();
            });
        }
    }, []);

    return {
        isLoading,
        error,
        sendRequest,
        clearError
    }
};