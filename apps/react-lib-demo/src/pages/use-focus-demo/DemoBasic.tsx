import { useFocus } from "@heart-re-up/react-lib/hooks/useFocus";
import { Box, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import React, { useRef, useState } from "react";

export function DemoBasic() {
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const {
    focusIndex,
    focusFirst,
    focusLast,
    focusNext,
    focusPrev,
    getCurrentFocusIndex,
  } = useFocus({
    focusableElements: elements,
  });

  // 포커스 가능한 요소들을 수집하는 함수
  const collectFocusableElements = () => {
    const allElements: HTMLElement[] = [];

    // input 요소들 추가
    inputRefs.current.forEach((input) => {
      if (input) allElements.push(input);
    });

    // button 요소들 추가
    buttonRefs.current.forEach((button) => {
      if (button) allElements.push(button);
    });

    setElements(allElements);
  };

  // 컴포넌트 마운트 시 요소들 수집
  React.useEffect(() => {
    collectFocusableElements();
  }, []);

  const currentIndex = getCurrentFocusIndex();

  return (
    <Box>
      <Text size="2" color="gray" mb="4" as="p">
        useFocus 훅의 기본 사용법을 보여줍니다. 포커스 가능한 요소들 사이를
        프로그래밍적으로 이동할 수 있습니다.
      </Text>

      <Card mb="4">
        <Text weight="bold" mb="3" as="p">
          포커스 제어 버튼
        </Text>
        <Flex gap="2" wrap="wrap">
          <Button onClick={() => focusFirst()} size="2">
            첫 번째로 포커스
          </Button>
          <Button onClick={() => focusLast()} size="2">
            마지막으로 포커스
          </Button>
          <Button onClick={() => focusNext({ userInteraction: true })} size="2">
            다음으로 포커스
          </Button>
          <Button onClick={() => focusPrev({ userInteraction: true })} size="2">
            이전으로 포커스
          </Button>
        </Flex>
      </Card>

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

        <div ref={containerRef}>
          <Flex direction="column" gap="3">
            <Flex gap="2" align="center">
              <Text size="2" style={{ minWidth: "60px" }}>
                Input 1:
              </Text>
              <TextField.Root
                ref={(el) => {
                  inputRefs.current[0] = el;
                }}
                placeholder="첫 번째 입력 필드"
              />
            </Flex>

            <Flex gap="2" align="center">
              <Text size="2" style={{ minWidth: "60px" }}>
                Input 2:
              </Text>
              <TextField.Root
                ref={(el) => {
                  inputRefs.current[1] = el;
                }}
                placeholder="두 번째 입력 필드"
              />
            </Flex>

            <Flex gap="2" align="center">
              <Text size="2" style={{ minWidth: "60px" }}>
                Input 3:
              </Text>
              <TextField.Root
                ref={(el) => {
                  inputRefs.current[2] = el;
                }}
                placeholder="세 번째 입력 필드"
              />
            </Flex>

            <Flex gap="2" mt="2">
              <Button
                ref={(el) => {
                  buttonRefs.current[0] = el;
                }}
                variant="outline"
                size="2"
              >
                버튼 1
              </Button>
              <Button
                ref={(el) => {
                  buttonRefs.current[1] = el;
                }}
                variant="outline"
                size="2"
              >
                버튼 2
              </Button>
              <Button
                ref={(el) => {
                  buttonRefs.current[2] = el;
                }}
                variant="outline"
                size="2"
              >
                버튼 3
              </Button>
            </Flex>
          </Flex>
        </div>
      </Card>

      <Card>
        <Text weight="bold" mb="3" as="p">
          인덱스별 포커스
        </Text>
        <Flex gap="2" wrap="wrap">
          {elements.map((_, index) => (
            <Button
              key={index}
              onClick={() => focusIndex(index)}
              variant={currentIndex === index ? "solid" : "outline"}
              size="2"
            >
              {index}번 요소
            </Button>
          ))}
        </Flex>
      </Card>

      <Box
        mt="4"
        p="3"
        style={{ backgroundColor: "var(--gray-2)", borderRadius: "6px" }}
      >
        <Text size="2" weight="bold" mb="2" as="p">
          💡 사용 팁
        </Text>
        <Text size="2" as="p">
          • 키보드 내비게이션이 필요한 컴포넌트에서 유용합니다
          <br />
          • Tab 키와 함께 사용하면 더욱 접근성이 좋아집니다
          <br />• userInteraction 옵션으로 사용자 상호작용과 프로그래밍적 제어를
          구분할 수 있습니다
        </Text>
      </Box>
    </Box>
  );
}
