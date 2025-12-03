import { useState, useEffect } from 'react';

/**
 * Hook to track if any API request is in progress
 * Returns true when requests are loading, false otherwise
 */
export function useApiLoading() {
    const [isLoading, setIsLoading] = useState(false);
    const [requestCount, setRequestCount] = useState(0);

    useEffect(() => {
        // Listen for custom events from axios interceptors
        const handleRequestStart = () => {
            setRequestCount(prev => prev + 1);
            setIsLoading(true);
        };

        const handleRequestEnd = () => {
            setRequestCount(prev => {
                const newCount = prev - 1;
                if (newCount <= 0) {
                    setIsLoading(false);
                    return 0;
                }
                return newCount;
            });
        };

        window.addEventListener('api-request-start', handleRequestStart);
        window.addEventListener('api-request-end', handleRequestEnd);

        return () => {
            window.removeEventListener('api-request-start', handleRequestStart);
            window.removeEventListener('api-request-end', handleRequestEnd);
        };
    }, []);

    return isLoading;
}
