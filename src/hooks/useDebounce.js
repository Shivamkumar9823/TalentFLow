// src/hooks/useDebounce.js

import { useRef, useCallback } from 'react';

/**
 * Hook to debounce a function call.
 * Ensures the callback runs only once after the specified delay of inactivity.
 * @param {function} callback - The function to execute (e.g., the API trigger).
 * @param {number} delay - The delay in milliseconds (e.g., 300ms).
 */
export const useDebounce = (callback, delay = 300) => {
    const timeoutRef = useRef(null);

    return useCallback((...args) => {
        // Clear the previous timer (reset the clock)
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set a new timer
        const newTimeoutId = setTimeout(() => {
            callback(...args);
        }, delay);

        timeoutRef.current = newTimeoutId;
    }, [callback, delay]);
};