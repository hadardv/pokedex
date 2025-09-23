import {useState, useEffect} from "react";

export function useDebounceValue<T>(value: T, delay: 300): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = window.setTimeout(() => setDebounced(value), delay);
        return () => window.clearTimeout(id);
    }, [value, delay]);
    return debounced;

}