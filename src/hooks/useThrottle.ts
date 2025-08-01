import { useRef, useCallback } from 'react';

// 1초 이내에 동일한 요청을 방지하는 훅
export const useThrottle = (delay: number = 1000) => {
  const isThrottled = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttledFunction = useCallback(
    (fn: () => void) => {
      if (isThrottled.current) {
        console.log('요청이 너무 빠릅니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      isThrottled.current = true;
      fn();

      timeoutRef.current = setTimeout(() => {
        isThrottled.current = false;
      }, delay);
    },
    [delay]
  );

  return throttledFunction;
};
