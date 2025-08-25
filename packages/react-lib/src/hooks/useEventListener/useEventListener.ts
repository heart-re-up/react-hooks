import { RefObject, useEffect, useRef } from "react";
import { useIsomorphicLayoutEffect } from "../useIsomorphicLayoutEffect";
import { resolveTargetElement } from "./useEventListener.util";

// 사용 가능한 이벤트 대상 타입들
export type ElementTarget<T extends EventTarget = EventTarget> =
  | T // 직접 전달된 DOM 요소
  | RefObject<T | null> // React RefObject (null 허용)
  | undefined; // 제공되지 않는 경우 Window 가 대상

// 일반적으로 사용되는 표준 이벤트 이름들 (IDE 자동완성 지원)
// 주요 DOM 요소들과 글로벌 이벤트들을 포함
export type StandardEventName =
  // 기본 글로벌 이벤트들
  | keyof GlobalEventHandlersEventMap
  | keyof WindowEventMap
  | keyof WindowEventHandlersEventMap
  | keyof DocumentEventMap
  | keyof ElementEventMap
  // HTML 요소 이벤트들
  | keyof HTMLElementEventMap
  | keyof HTMLBodyElementEventMap
  | keyof HTMLVideoElementEventMap
  | keyof HTMLMediaElementEventMap
  | keyof HTMLFrameSetElementEventMap
  // SVG와 수학 요소들
  | keyof SVGElementEventMap
  | keyof MathMLElementEventMap
  // Shadow DOM
  | keyof ShadowRootEventMap;

// 이벤트 이름을 기반으로 이벤트 타입을 추론하는 유틸리티 타입
// 가장 구체적인 타입부터 확인하여 첫 번째 매치를 반환
type InferEventType<E extends string> =
  // 키보드 이벤트들 (가장 구체적)
  E extends keyof HTMLElementEventMap
    ? HTMLElementEventMap[E]
    : // Window 전용 이벤트들
      E extends keyof WindowEventMap
      ? WindowEventMap[E]
      : // Document 전용 이벤트들
        E extends keyof DocumentEventMap
        ? DocumentEventMap[E]
        : // 글로벌 이벤트 핸들러들
          E extends keyof GlobalEventHandlersEventMap
          ? GlobalEventHandlersEventMap[E]
          : // 기타 이벤트 맵들
            E extends keyof ElementEventMap
            ? ElementEventMap[E]
            : E extends keyof SVGElementEventMap
              ? SVGElementEventMap[E]
              : // 기본값
                Event;

export const useEventListener = <
  T extends EventTarget = EventTarget,
  E extends string = string,
>(
  eventName: E, // 이벤트 이름을 제네릭으로 받아서 타입 추론 가능
  handler: (event: InferEventType<E>) => void, // 추론된 이벤트 타입 사용
  element?: ElementTarget<T>,
  options?: boolean | AddEventListenerOptions
): void => {
  // 핸들러를 저장하는 ref
  const savedHandler = useRef(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // 이벤트 리스너를 등록할 대상 요소 정의
    let targetElement: EventTarget | null;

    try {
      targetElement = resolveTargetElement(element);
    } catch (error) {
      console.error(error);
      return;
    }

    // 대상 요소가 addEventListener를 지원하지 않는 경우 - 경고 출력
    if (!(targetElement && targetElement.addEventListener)) {
      console.warn(
        `useEventListener: Target element does not support addEventListener. ` +
          `Event listener for "${String(eventName)}" will not be registered.`
      );
      return;
    }

    // 이벤트 리스너 등록
    const eventListener = (event: Event): void =>
      savedHandler.current(event as InferEventType<E>);

    targetElement.addEventListener(eventName, eventListener, options);

    // 정리 시 이벤트 리스너 제거
    return (): void => {
      targetElement!.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element, options]);
};
