import { useCallback, useRef, useMemo } from "react";

export interface Cancelable {
  clear(): void;
}

/**
 * 함수 호출을 지연시키는 데 사용되는 React Hook
 *
 * [action] 함수가 호출될 때마다 [delayInMillis]만큼 대기한 후 마지막 호출만 실행됩니다.
 *
 * @template T 함수 타입
 * @param {T} action - 지연 시간 후 실행할 함수
 * @param {number} [delayInMillis=166] - 지연 시간 (밀리초 단위, 기본값: 166ms)
 * @returns {T & Cancelable} - 디바운스된 함수와 취소(clear) 메서드가 포함된 객체
 *
 * @example
 * const debouncedFunction = useDebounce((value) => {
 *   console.log("Debounced Value:", value);
 * }, 300);
 *
 * // 사용 예제
 * debouncedFunction("Hello");
 * debouncedFunction("World"); // 이전 호출이 취소되고, 이 호출만 실행됩니다.
 * => World
 *
 * // 지연 중 작업 취소
 * debouncedFunction.clear();
 */
export const useDebounce = <T extends (...args: never[]) => unknown>(
  action: T,
  delayInMillis: number = 166
): T & Cancelable => {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionRef = useRef(action);
  const delayRef = useRef(delayInMillis);

  // 최신 값들을 ref에 저장
  actionRef.current = action;
  delayRef.current = delayInMillis;

  // 디바운스된 함수 - 의존성 배열이 비어있으므로 재생성되지 않음
  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => {
        actionRef.current(...args);
      }, delayRef.current);
    },
    [] // 빈 배열로 함수 재생성 방지
  );

  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }, []);

  // useMemo로 객체 재생성 방지
  return useMemo(() => {
    const result = debounced as unknown as T & Cancelable;
    result.clear = clear;
    return result;
  }, [debounced, clear]);
};
