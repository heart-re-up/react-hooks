import { useFocusableElements } from "@heart-re-up/react-lib/hooks/useFocusableElements";
import { Box, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import { extractContent } from "../utils";
import { useForkRef } from "@heart-re-up/react-lib/hooks/useForkRef";

export function DemoBasic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputCount, setInputCount] = useState(2);
  const [buttonCount, setButtonCount] = useState(2);
  const [showDisabled, setShowDisabled] = useState(false);

  const { ref: focusableElementsRef, focusableElements } = useFocusableElements(
    { debounceDelay: 166 }
  );

  const addInput = () => setInputCount((prev) => prev + 1);
  const removeInput = () => setInputCount((prev) => Math.max(0, prev - 1));
  const addButton = () => setButtonCount((prev) => prev + 1);
  const removeButton = () => setButtonCount((prev) => Math.max(0, prev - 1));
  const toggleDisabled = () => setShowDisabled((prev) => !prev);

  // 수동으로 요소 목록 새로고침
  const refreshElements = () => {
    // 강제로 리렌더링을 트리거하여 요소 목록을 업데이트
    const event = new Event("focus");
    containerRef.current?.dispatchEvent(event);
  };

  const ref = useForkRef(focusableElementsRef, containerRef);

  useEffect(() => {
    console.log("focusableElements", focusableElements);
  }, [focusableElements]);

  return (
    <Box>
      <Text size="2" color="gray" mb="4" as="p">
        useFocusableElements 훅은 컨테이너 내의 포커스 가능한 요소들을 자동으로
        찾아줍니다. 요소를 추가/제거한 후 "요소 목록 새로고침" 버튼을
        클릭해보세요.
      </Text>

      <Card mb="4">
        <Text weight="bold" mb="3" as="p">
          컨테이너 제어
        </Text>
        <Flex gap="2" wrap="wrap" mb="3">
          <Button onClick={addInput} size="2" variant="outline">
            입력 필드 추가
          </Button>
          <Button onClick={removeInput} size="2" variant="outline">
            입력 필드 제거
          </Button>
          <Button onClick={addButton} size="2" variant="outline">
            버튼 추가
          </Button>
          <Button onClick={removeButton} size="2" variant="outline">
            버튼 제거
          </Button>
          <Button
            onClick={toggleDisabled}
            size="2"
            variant={showDisabled ? "solid" : "outline"}
          >
            비활성화 요소 {showDisabled ? "숨기기" : "보이기"}
          </Button>
        </Flex>
        <Button onClick={refreshElements} size="2" color="blue">
          요소 목록 새로고침
        </Button>
      </Card>

      <Flex gap="4">
        <Flex flexGrow="1">
          <Card>
            <Text weight="bold" mb="3" as="p">
              포커스 가능한 요소들
            </Text>

            <div
              ref={ref}
              style={{
                border: "2px dashed var(--blue-6)",
                padding: "16px",
                borderRadius: "6px",
                backgroundColor: "var(--blue-1)",
              }}
            >
              <Text size="2" color="gray" mb="3" as="p">
                📦 포커스 감지 컨테이너
              </Text>

              <Flex direction="column" gap="3">
                {/* 동적 입력 필드들 */}
                {Array.from({ length: inputCount }, (_, index) => (
                  <Flex key={`input-${index}`} gap="2" align="center">
                    <Text size="2" style={{ minWidth: "80px" }}>
                      Input {index + 1}:
                    </Text>
                    <TextField.Root placeholder={`입력 필드 ${index + 1}`} />
                  </Flex>
                ))}

                {/* 비활성화된 입력 필드 (조건부 렌더링) */}
                {showDisabled && (
                  <Flex gap="2" align="center">
                    <Text size="2" style={{ minWidth: "80px" }}>
                      Disabled:
                    </Text>
                    <TextField.Root placeholder="비활성화된 필드" disabled />
                  </Flex>
                )}

                {/* 동적 버튼들 */}
                <Flex gap="2" mt="2" wrap="wrap">
                  {Array.from({ length: buttonCount }, (_, index) => (
                    <Button key={`button-${index}`} variant="outline" size="2">
                      버튼 {index + 1}
                    </Button>
                  ))}

                  {/* 비활성화된 버튼 (조건부 렌더링) */}
                  {showDisabled && (
                    <Button variant="outline" size="2" disabled>
                      비활성화 버튼
                    </Button>
                  )}
                </Flex>

                {/* 링크 요소 */}
                <Flex gap="2" mt="2">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      color: "var(--blue-9)",
                      textDecoration: "underline",
                    }}
                  >
                    링크 1
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      color: "var(--blue-9)",
                      textDecoration: "underline",
                    }}
                  >
                    링크 2
                  </a>
                </Flex>
              </Flex>
            </div>
          </Card>
        </Flex>

        <Box style={{ minWidth: "300px" }}>
          <Card>
            <Text weight="bold" mb="3" as="p">
              감지된 포커스 가능한 요소들 ({focusableElements.length}개)
            </Text>

            <Box
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                backgroundColor: "var(--gray-1)",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              {focusableElements.length === 0 ? (
                <Text size="2" color="gray">
                  포커스 가능한 요소가 없습니다
                </Text>
              ) : (
                focusableElements.map((element, index) => (
                  <Box
                    key={index}
                    mb="2"
                    p="2"
                    style={{
                      backgroundColor: "var(--gray-3)",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    <Text size="1" weight="bold" color="blue">
                      [{index}] {element.tagName.toLowerCase()}
                    </Text>
                    <br />
                    <Text size="1" color="gray">
                      {extractContent(element)}
                    </Text>
                    {"disabled" in element &&
                      (element as HTMLInputElement).disabled && (
                        <Text size="1" color="red" ml="2">
                          (disabled)
                        </Text>
                      )}
                  </Box>
                ))
              )}
            </Box>
          </Card>
        </Box>
      </Flex>

      <Box
        mt="4"
        p="3"
        style={{ backgroundColor: "var(--gray-2)", borderRadius: "6px" }}
      >
        <Text size="2" weight="bold" mb="2" as="p">
          💡 사용 팁
        </Text>
        <Text size="2" as="p">
          • 동적으로 변하는 UI에서 포커스 가능한 요소들을 추적할 때 유용합니다
          <br />
          • disabled 속성이 있는 요소들은 자동으로 제외됩니다
          <br />
          • tabindex="-1"인 요소들도 포커스 불가능한 것으로 처리됩니다
          <br />• observeChange 옵션으로 DOM 변화를 자동 감지할 수 있습니다
        </Text>
      </Box>
    </Box>
  );
}
