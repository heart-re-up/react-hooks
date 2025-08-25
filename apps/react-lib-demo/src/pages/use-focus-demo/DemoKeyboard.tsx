import { useFocus } from "@heart-re-up/react-lib/hooks/useFocus";
import { useEventListener } from "@heart-re-up/react-lib/hooks/useEventListener";
import { Box, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import React, { useCallback, useRef, useState } from "react";

export function DemoKeyboard() {
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const [keyLog, setKeyLog] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { focusNext, focusPrev, getCurrentFocusIndex } = useFocus({
    focusableElements: elements,
  });

  // 포커스 가능한 요소들을 수집하는 함수
  const collectFocusableElements = () => {
    const allElements: HTMLElement[] = [];

    inputRefs.current.forEach((input) => {
      if (input) allElements.push(input);
    });

    buttonRefs.current.forEach((button) => {
      if (button) allElements.push(button);
    });

    setElements(allElements);
  };

  React.useEffect(() => {
    collectFocusableElements();
  }, []);

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 컨테이너 내부에 포커스가 있을 때만 처리
      if (!containerRef.current?.contains(document.activeElement as Node)) {
        return;
      }

      const key = event.key;
      const timestamp = new Date().toLocaleTimeString();

      if (key === "ArrowDown" || key === "ArrowRight") {
        event.preventDefault();
        focusNext();
        setKeyLog((prev) => [
          `${timestamp}: ${key} → 다음 요소로 이동`,
          ...prev.slice(0, 4),
        ]);
      } else if (key === "ArrowUp" || key === "ArrowLeft") {
        event.preventDefault();
        focusPrev();
        setKeyLog((prev) => [
          `${timestamp}: ${key} → 이전 요소로 이동`,
          ...prev.slice(0, 4),
        ]);
      } else if (key === "Home") {
        event.preventDefault();
        if (elements.length > 0) {
          elements[0].focus();
          setKeyLog((prev) => [
            `${timestamp}: ${key} → 첫 번째 요소로 이동`,
            ...prev.slice(0, 4),
          ]);
        }
      } else if (key === "End") {
        event.preventDefault();
        if (elements.length > 0) {
          elements[elements.length - 1].focus();
          setKeyLog((prev) => [
            `${timestamp}: ${key} → 마지막 요소로 이동`,
            ...prev.slice(0, 4),
          ]);
        }
      }
    },
    [focusNext, focusPrev, elements]
  );

  useEventListener("keydown", handleKeyDown);

  const currentIndex = getCurrentFocusIndex();

  const clearLog = () => setKeyLog([]);

  return (
    <Box>
      <Text size="2" color="gray" mb="4" as="p">
        키보드 화살표 키를 사용해서 포커스를 이동하는 데모입니다. 아래 요소들 중
        하나에 포커스한 후 화살표 키, Home, End 키를 사용해보세요.
      </Text>

      <Flex gap="4">
        <Flex flexGrow="1">
          <Card mb="4">
            <Text weight="bold" mb="3" as="p">
              포커스 대상 요소들
            </Text>
            <Text size="2" color="gray" mb="3" as="p">
              현재 포커스된 요소 인덱스:{" "}
              <Text weight="bold" color="blue">
                {currentIndex}
              </Text>
            </Text>

            <div
              ref={containerRef}
              style={{
                outline: "2px dashed var(--gray-6)",
                padding: "16px",
                borderRadius: "6px",
              }}
            >
              <Text size="2" color="gray" mb="3" as="p">
                ⌨️ 키보드 조작 영역 (포커스 후 화살표 키 사용)
              </Text>

              <Flex direction="column" gap="3">
                <Flex gap="2" align="center">
                  <Text size="2" style={{ minWidth: "60px" }}>
                    이름:
                  </Text>
                  <TextField.Root
                    ref={(el) => {
                      inputRefs.current[0] = el;
                    }}
                    placeholder="이름을 입력하세요"
                  />
                </Flex>

                <Flex gap="2" align="center">
                  <Text size="2" style={{ minWidth: "60px" }}>
                    이메일:
                  </Text>
                  <TextField.Root
                    ref={(el) => {
                      inputRefs.current[1] = el;
                    }}
                    placeholder="이메일을 입력하세요"
                    type="email"
                  />
                </Flex>

                <Flex gap="2" align="center">
                  <Text size="2" style={{ minWidth: "60px" }}>
                    전화:
                  </Text>
                  <TextField.Root
                    ref={(el) => {
                      inputRefs.current[2] = el;
                    }}
                    placeholder="전화번호를 입력하세요"
                    type="tel"
                  />
                </Flex>

                <Flex gap="2" mt="2">
                  <Button
                    ref={(el) => {
                      buttonRefs.current[0] = el;
                    }}
                    variant="solid"
                    size="2"
                  >
                    저장
                  </Button>
                  <Button
                    ref={(el) => {
                      buttonRefs.current[1] = el;
                    }}
                    variant="outline"
                    size="2"
                  >
                    취소
                  </Button>
                  <Button
                    ref={(el) => {
                      buttonRefs.current[2] = el;
                    }}
                    variant="outline"
                    size="2"
                    color="red"
                  >
                    삭제
                  </Button>
                </Flex>
              </Flex>
            </div>
          </Card>
        </Flex>

        <Box style={{ minWidth: "300px" }}>
          <Card>
            <Flex justify="between" align="center" mb="3">
              <Text weight="bold" as="p">
                키보드 이벤트 로그
              </Text>
              <Button onClick={clearLog} size="1" variant="ghost">
                지우기
              </Button>
            </Flex>

            <Box
              style={{
                height: "200px",
                overflowY: "auto",
                backgroundColor: "var(--gray-1)",
                padding: "8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontFamily: "monospace",
              }}
            >
              {keyLog.length === 0 ? (
                <Text size="2" color="gray">
                  키보드 이벤트가 여기에 표시됩니다
                </Text>
              ) : (
                keyLog.map((log, index) => (
                  <div
                    key={index}
                    style={{ marginBottom: "4px", color: "var(--gray-11)" }}
                  >
                    {log}
                  </div>
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
          ⌨️ 키보드 단축키
        </Text>
        <Text size="2" as="p">
          • <Text weight="bold">↑/←</Text>: 이전 요소로 포커스 이동
          <br />• <Text weight="bold">↓/→</Text>: 다음 요소로 포커스 이동
          <br />• <Text weight="bold">Home</Text>: 첫 번째 요소로 포커스 이동
          <br />• <Text weight="bold">End</Text>: 마지막 요소로 포커스 이동
        </Text>
      </Box>
    </Box>
  );
}
