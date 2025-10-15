import { useState, useEffect, useCallback } from 'react';
import localforage from 'localforage';

interface UseLocalForageOptions<T> {
  key: string;
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

/**
 * Hook personalizado para persistência com LocalForage
 * Gerencia estado local com persistência automática
 */
export function useLocalForage<T>(options: UseLocalForageOptions<T>) {
  const { key, defaultValue, serialize, deserialize } = options;
  
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const stored = await localforage.getItem(key);
        
        if (stored !== null) {
          const parsedValue = deserialize 
            ? deserialize(stored as string) 
            : JSON.parse(stored as string);
          setValue(parsedValue);
        }
      } catch (err) {
        console.error(`Error loading ${key} from storage:`, err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, deserialize]);

  // Save data to storage when value changes
  useEffect(() => {
    if (!loading) {
      const saveData = async () => {
        try {
          const serialized = serialize 
            ? serialize(value) 
            : JSON.stringify(value);
          await localforage.setItem(key, serialized);
        } catch (err) {
          console.error(`Error saving ${key} to storage:`, err);
          setError(err instanceof Error ? err.message : 'Failed to save data');
        }
      };

      saveData();
    }
  }, [key, value, loading, serialize]);

  // Manual save function
  const save = useCallback(async (newValue: T) => {
    try {
      setError(null);
      const serialized = serialize 
        ? serialize(newValue) 
        : JSON.stringify(newValue);
      await localforage.setItem(key, serialized);
      setValue(newValue);
    } catch (err) {
      console.error(`Error saving ${key} to storage:`, err);
      setError(err instanceof Error ? err.message : 'Failed to save data');
    }
  }, [key, serialize]);

  // Manual load function
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const stored = await localforage.getItem(key);
      
      if (stored !== null) {
        const parsedValue = deserialize 
          ? deserialize(stored as string) 
          : JSON.parse(stored as string);
        setValue(parsedValue);
      }
    } catch (err) {
      console.error(`Error loading ${key} from storage:`, err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [key, deserialize]);

  // Clear data function
  const clear = useCallback(async () => {
    try {
      setError(null);
      await localforage.removeItem(key);
      setValue(defaultValue);
    } catch (err) {
      console.error(`Error clearing ${key} from storage:`, err);
      setError(err instanceof Error ? err.message : 'Failed to clear data');
    }
  }, [key, defaultValue]);

  return {
    value,
    setValue,
    loading,
    error,
    save,
    load,
    clear
  };
}
