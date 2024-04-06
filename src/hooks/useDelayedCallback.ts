import { useRef, useEffect } from 'react';

/**
 * Вызывает функцию после задержки.
 * Если функция меняется во время задержки, таймер сбрасывается.
 *
 * @param callback Функция, которую нужно вызвать после задержки.
 * @param delay Задержка в миллисекундах перед вызовом функции.
 */
function useDelayedCallback<T extends (...args: any[]) => any>(callback: T, delay: number = 300) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const invokeDelayedCallback = (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  const cancelDelayedCallback = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [invokeDelayedCallback, cancelDelayedCallback] as const;
}

export default useDelayedCallback;
