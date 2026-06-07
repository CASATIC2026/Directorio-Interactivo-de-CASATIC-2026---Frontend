import { useState, useEffect } from 'react';

/**
 * Retrasa la actualización de un valor hasta que el usuario deja de escribir.
 * @param {*} value Valor a debouncear
 * @param {number} delay Milisegundos de espera (default 400ms)
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
