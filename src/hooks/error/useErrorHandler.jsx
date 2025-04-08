import { useState, useCallback, useEffect } from 'react';

export function useErrorHandler() {
    const [error, setError] = useState(null);

    // Function to record errors
    const handleError = useCallback((error) => {
        console.error('Error caught:', error);

        // More detailed logging in the development environment
        if (process.env.NODE_ENV === 'development') {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                type: error.name
            });
        }

        setError(error);
    }, []);

    // Function to reset error state
    const resetError = useCallback(() => {
        setError(null);
    }, []);

    // Global error listener
    useEffect(() => {
        const handleUnhandledRejection = (event) => {
            handleError(event.reason);
        };

        const handleGlobalError = (event) => {
            event.preventDefault();
            handleError(event.error);
        };

        // Adding global error listeners
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        window.addEventListener('error', handleGlobalError);

        // Cleanup
        return () => {
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            window.removeEventListener('error', handleGlobalError);
        };
    }, [handleError]);

    return { error, handleError, resetError };
}