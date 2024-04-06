import { useState, useRef, useEffect } from 'react';

/**
 * Использует состояние, которое устанавливается после задержки.
 * Если значение меняется во время задержки, таймер сбрасывается.
 *
 * @param initialValue Начальное значение.
 * @param delay Задержка в миллисекундах перед установкой значения.
 */
function useDelayedState<T>(initialValue: T, delay: number = 300): [T, React.Dispatch<React.SetStateAction<T>>, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setDelayedState = (value: React.SetStateAction<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setState(value);
    }, delay);
  };

  const setImmediateState = (value: React.SetStateAction<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setState(value);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, setDelayedState, setImmediateState];
}

export default useDelayedState;
