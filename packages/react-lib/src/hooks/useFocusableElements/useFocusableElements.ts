import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "../useDebounce";
import { getFocusableElements } from "../useFocusTrap/useFocusTrap.util";
import { useForkRef } from "../useForkRef";
import { useMutationObserver } from "../useMutationObserver";

export type UseFocusableElementsProps = {
  /**
   * MutationObserver 디바운스 지연 시간 (ms)
   */
  debounceDelay?: number;
};

export type UseFocusableElementsReturn = {
  /**
   * 포커스 가능한 요소를 찾을 컨테이너 요소에 설정할 ref
   */
  ref: React.RefCallback<HTMLElement>;
  /**
   * 현재 포커스 가능한 요소들
   */
  focusableElements: HTMLElement[];
};

export const useFocusableElements = (
  options: UseFocusableElementsProps
): UseFocusableElementsReturn => {
  const { debounceDelay = 166 } = options;
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  /** 포커스 가능한 요소를 획득하려는 컨테이너 */
  const containerRef = useRef<HTMLElement>(null);

  const clearFocusableElements = useCallback(() => {
    setFocusableElements([]);
  }, [setFocusableElements]);

  // 포커스 가능한 요소들을 업데이트하는 함수
  const updateFocusableElements = useCallback(() => {
    if (!containerRef.current) {
      clearFocusableElements();
      return;
    }
    const elements = getFocusableElements(containerRef.current);
    setFocusableElements(elements);
  }, [clearFocusableElements, setFocusableElements]);

  const debouncedUpdateFocusableElements = useDebounce(
    updateFocusableElements,
    debounceDelay
  );

  // MutationObserver로 DOM 변경 감지
  const { ref: mutationRef } = useMutationObserver({
    callback: (_mutations: MutationRecord[]) => {
      debouncedUpdateFocusableElements();
    },
    options: {
      childList: true,
      subtree: true,
      attributes: true, // 속성 변경 감지 활성화
      attributeFilter: [
        "disabled",
        "tabindex",
        "hidden",
        "aria-hidden",
        "aria-disabled",
      ], // 포커스에 실제 영향을 주는 속성만 감지
    },
  });

  // useMutationObserver 의 ref 호출이 보장되도록 병합해서 내보낸다.
  const ref = useForkRef(mutationRef, (instance: HTMLElement | null) => {
    // 이미 같은 요소를 참조하고 있으면 아무것도 하지 않는다.
    // 이미 null 인 경우에 null 이 전달되는 경우도 이 경우에 해당합니다.
    if (containerRef.current === instance) {
      return;
    }

    // null 수신은 처리하지 않는다. 컴포넌트가 언마운트될 때 정리함수에서 처리된다.
    if (instance === null) {
      return;
    }

    // 변경 사항을 적용하고 업데이트 요청한다.
    containerRef.current = instance;
    updateFocusableElements();
  });

  // 컴포넌트가 언마운트될 때 포커스 가능한 요소들을 초기화한다.
  useEffect(() => {
    updateFocusableElements();
    return clearFocusableElements;
  }, [clearFocusableElements, updateFocusableElements]);

  return { ref, focusableElements };
};
