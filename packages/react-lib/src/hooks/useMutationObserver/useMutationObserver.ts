import { useCallback, useEffect, useMemo, useRef } from "react";

export type UseMutationObserverProps = {
  /**
   * MutationObserver 콜백 함수
   */
  callback: MutationCallback;
  /**
   * MutationObserver 옵션
   */
  options?: MutationObserverInit;
};

export type UseMutationObserverReturns = {
  ref: React.RefCallback<HTMLElement>;
  disconnect: () => void;
};

/**
 * MutationObserver를 쉽게 사용할 수 있는 훅
 * 각 요소마다 개별 Observer를 생성하여 독립적인 옵션 사용 가능
 */
export const useMutationObserver = ({
  callback,
  options = {
    childList: true,
    subtree: true,
  },
}: UseMutationObserverProps): UseMutationObserverReturns => {
  // RefCallback 에 의해서 설정되는 요소
  const elementRef = useRef<Element>(null);
  // MutationObserver 인스턴스
  const observerRef = useRef<MutationObserver>(null);
  // 콜백 참조 안정화
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  // options 객체 메모이제이션. 매개변수 객체를 그대로 다른 의존성에 사용하면, 매번 새 객체로 인식하여 메모이제이션이 되지 않는다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedOptions = useMemo(() => options, [...Object.values(options)]); // 의도된 eslint 무시.

  /**
   * MutationObserver 정리
   */
  const cleanupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // MO 설정
  const setupObserver = useCallback(() => {
    // 다음 경우 아무것도 하지 않는다.
    // 비활성 상태, ref가 null
    if (elementRef.current === null) {
      return;
    }

    // MutationObserver 생성 및 관찰
    observerRef.current = new MutationObserver((mutations, observer) => {
      callbackRef.current(mutations, observer);
    });
    observerRef.current.observe(elementRef.current, memoizedOptions);
  }, [memoizedOptions]);

  // 요소 설정(변경) 시 관찰 시작
  const ref = useCallback(
    (instance: HTMLElement) => {
      // null 은 처리하지 않는다.
      if (instance === null) {
        return;
      }
      // 변경된 것이 없으면 아무것도 하지 않는다.
      if (elementRef.current === instance) {
        return;
      }
      // 변경처리하고 관찰 시작을 시도한다.
      elementRef.current = instance;
      cleanupObserver();
      setupObserver();
    },
    [cleanupObserver, setupObserver]
  );

  useEffect(() => {
    setupObserver();
    return cleanupObserver;
  }, [setupObserver, cleanupObserver]);

  return { ref, disconnect: cleanupObserver };
};
