'use client';

import { useRef, useCallback, useEffect } from 'react';

// useThrottle 훅은 콜백 함수의 실행 빈도를 제한합니다.
// 지정된 delay 시간 동안 콜백 함수가 최대 한 번만 호출되도록 보장합니다.
const useThrottle = <T extends (...args: any[]) => void>(callback: T, delay: number) => {
  const throttleId = useRef<NodeJS.Timeout | null>(null);
  const isThrottled = useRef(false);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (!isThrottled.current) {
        callback(...args);
        isThrottled.current = true;
        throttleId.current = setTimeout(() => {
          isThrottled.current = false;
          throttleId.current = null;
        }, delay);
      }
    },
    [callback, delay]
  );

  // 컴포넌트가 언마운트될 때 타이머를 정리합니다.
  useEffect(() => {
    return () => {
      if (throttleId.current) {
        clearTimeout(throttleId.current);
      }
    };
  }, []);

  return throttledCallback;
};

export default useThrottle;
