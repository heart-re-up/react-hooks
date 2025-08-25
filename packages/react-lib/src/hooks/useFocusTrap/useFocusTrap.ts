import { useCallback, useEffect, useRef } from "react";
import { useFocus, UseFocusReturn } from "../useFocus";
import {
  useFocusableElements,
  UseFocusableElementsReturn,
} from "../useFocusableElements";
import { useForkRef } from "../useForkRef";

export type UseFocusTrapProps = {
  /** 비활성 */
  disabled?: boolean;
  /** 포커스 사용이 가능할 때 자동으로 포커스 처리 */
  autoFocus?: boolean;
};

export type UseFocusTrapReturn = UseFocusReturn & UseFocusableElementsReturn;

export const useFocusTrap = (
  options: UseFocusTrapProps
): UseFocusTrapReturn => {
  console.log("useFocusTrap", "useFocusTrap");
  const { disabled = false, autoFocus = true } = options;
  const containerRef = useRef<HTMLElement>(null);

  // useFocusableElements 훅 사용
  // 포커스 할 요소만 필터링
  const { ref: focusableElementsRef, focusableElements } = useFocusableElements(
    {
      observeChange: !disabled, // disabled가 false일 때 true로 설정
      debounceObserving: 200,
    }
  );

  // ref 콜백을 useCallback으로 메모이제이션하여 무한 리렌더링 방지
  const refCallback: React.RefCallback<HTMLElement> = (
    instance: HTMLElement
  ) => {
    console.log("useFocusTrap", "useForkRef");
    containerRef.current = instance;
  };

  // useFocusableElements 의 ref 호출이 보장되도록 병합해서 내보낸다.
  const ref = useForkRef(focusableElementsRef, refCallback);

  // useFocus 훅 사용
  // 요소를 제공해서 포커스 명령을 사용할 수 있도록 한다.
  const {
    focusIndex,
    focusFirst,
    focusLast,
    focusNext,
    focusPrev,
    getCurrentFocusIndex,
  } = useFocus({
    focusableElements,
  });

  // Tab 키 핸들러
  const handleKeyDown = useCallback(
    (event: Event) => {
      const keyEvent = event as KeyboardEvent;

      if (keyEvent.key !== "Tab") return;

      // 현재 포커스된 요소가 이 컨테이너 내부에 있는지 확인
      const activeElement = document.activeElement as HTMLElement;
      if (!activeElement || !containerRef.current?.contains(activeElement)) {
        return; // 이 컨테이너와 관련 없는 이벤트는 무시
      }

      // ✅ 즉시 전파 차단 - 더 바깥쪽 트랩으로 전파되지 않도록
      keyEvent.preventDefault();
      keyEvent.stopPropagation();

      if (focusableElements.length === 0) return;

      if (keyEvent.shiftKey) {
        focusPrev();
      } else {
        focusNext();
      }
    },
    [focusableElements.length, focusNext, focusPrev]
  );

  const cleanupKeydown = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.removeEventListener("keydown", handleKeyDown, {
        capture: false,
      });
    }
  }, [handleKeyDown]);

  const setupKeydown = useCallback(() => {
    cleanupKeydown();
    // 사용할 수 없는 경우 설정하지 않음.
    if (disabled || !containerRef.current) return;
    // 키다운 설정
    containerRef.current.addEventListener("keydown", handleKeyDown, {
      capture: false,
      passive: false,
    });
  }, [disabled, handleKeyDown, cleanupKeydown]);

  // 키보드 이벤트 처리
  // useEffect(() => {
  //   console.log("useFocusTrap", "useEffect");
  //   setupKeydown();
  //   return cleanupKeydown;
  // }, [cleanupKeydown, setupKeydown]);

  // 자동 포커스 처리
  useEffect(() => {
    if (disabled || !autoFocus || !containerRef.current) return;

    requestAnimationFrame(() => {
      focusFirst();
    });
  }, [disabled, autoFocus, focusFirst]);

  return {
    ref,
    focusableElements,
    focusIndex,
    focusFirst,
    focusLast,
    focusNext,
    focusPrev,
    getCurrentFocusIndex,
  };
};
