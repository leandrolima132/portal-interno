import localforage from 'localforage';
import { useEffect, useState } from 'react';

interface UseLocalForageOptions<T> {
    key: string;
    defaultValue: T
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
}

export function useLocalForage<T>(options: UseLocalForageOptions<T>) {
    const { key, defaultValue, serialize, deserialize } = options;

    const [value, setValue] = useState<T>(defaultValue);

    useEffect(() => {
        localforage.getItem(key).then((item) => {
            if (item) {
                const parsedValue = deserialize ? deserialize(item as string) : JSON.parse(item as string);
                setValue(parsedValue);
            }
        });
    }, [key, deserialize]);

    useEffect(() => {
        localforage.setItem(key, serialize ? serialize(value) : JSON.stringify(value));
    }, [key, value, serialize]);

    return [value, setValue] as const;
}
