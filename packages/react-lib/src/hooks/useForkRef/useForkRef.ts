import { Ref, RefCallback } from "react";
import { setRef } from "./setRef";

/**
 * 여러 개의 ref를 하나로 병합하는 훅
 * @param refs - 병합할 Ref 배열
 * @returns 병합된 RefCallback 또는 null (모든 ref가 undefined인 경우)
 */
export const useForkRef = <Instance>(
  ...refs: Array<Ref<Instance> | undefined>
): RefCallback<Instance> => {
  return (value: Instance) => {
    refs.forEach((ref, index) => {
      if (ref === undefined || ref === null) {
        throw new Error(
          `useForkRef: Received null ref at index ${index}. Expected a valid ref object.`
        );
      }
      setRef(ref, value);
    });
  };
};
