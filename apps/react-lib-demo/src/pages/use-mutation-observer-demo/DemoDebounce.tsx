import { useMutationObserver } from "@heart-re-up/react-lib/hooks/useMutationObserver";
import { useInterval } from "@heart-re-up/react-lib/hooks/useInterval";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Slider,
  Switch,
  Text,
} from "@radix-ui/themes";
import React, { useState, useRef } from "react";

export function DemoDebounce() {
  const [debounceDelay, setDebounceDelay] = useState(300);
  const [useDebounce, setUseDebounce] = useState(true);
  const [mutationCount, setMutationCount] = useState(0);
  const [callbackCount, setCallbackCount] = useState(0);
  const [isAutoAdding, setIsAutoAdding] = useState(false);
  const [items, setItems] = useState<number[]>([]);
  const { start, cancel } = useInterval({
    action: () => {
      setItems((prev) => [...prev, Date.now() + Math.random()]);
    },
    delay: 100,
  });

  // 공통 콜백 함수
  const handleMutation = () => {
    setMutationCount((prev) => prev + 1);
    setCallbackCount((prev) => prev + 1);
  };

  // 디바운스 설정에 따른 MutationObserver 훅 사용
  const { ref } = useMutationObserver({
    callback: handleMutation,
    options: {
      childList: true,
      subtree: true,
    },
    debounceDelay: useDebounce ? debounceDelay : 0,
  });

  // 단일 항목 추가
  const addSingleItem = () => {
    setItems((prev) => [...prev, Date.now()]);
  };

  // 여러 항목 한번에 추가 (빠른 연속 변화 시뮬레이션)
  const addMultipleItems = () => {
    const newItems = Array.from(
      { length: 5 },
      () => Date.now() + Math.random()
    );
    setItems((prev) => [...prev, ...newItems]);
  };

  // 자동 추가 시작/중단
  const toggleAutoAdd = () => {
    if (isAutoAdding) {
      cancel();
      setIsAutoAdding(false);
    } else {
      start();
      setIsAutoAdding(true);
    }
  };

  // 모든 항목 제거
  const clearItems = () => {
    setItems([]);
  };

  // 카운터 리셋
  const resetCounters = () => {
    setMutationCount(0);
    setCallbackCount(0);
  };

  // 컴포넌트 언마운트 시 인터벌 정리
  React.useEffect(() => {
    return cancel;
  }, [cancel]);

  return (
    <Box>
      <Text size="2" color="gray" mb="4" as="p">
        디바운스 기능을 활용하여 빈번한 DOM 변화에서 성능을 최적화하는 방법을
        보여줍니다. 자동 추가 기능으로 빠른 연속 변화를 시뮬레이션해보세요.
      </Text>

      {/* 설정 패널 */}
      <Card mb="4">
        <Box p="4">
          <Heading size="3" mb="3">
            디바운스 설정
          </Heading>

          <Flex direction="column" gap="4">
            {/* 디바운스 활성화/비활성화 */}
            <Flex align="center" gap="3">
              <Text weight="bold">디바운스 사용:</Text>
              <Switch checked={useDebounce} onCheckedChange={setUseDebounce} />
              <Badge color={useDebounce ? "green" : "red"}>
                {useDebounce ? "활성화" : "비활성화"}
              </Badge>
            </Flex>

            {/* 디바운스 딜레이 설정 */}
            {useDebounce && (
              <Box>
                <Flex align="center" gap="3" mb="2">
                  <Text weight="bold">디바운스 딜레이:</Text>
                  <Badge>{debounceDelay}ms</Badge>
                </Flex>
                <Slider
                  value={[debounceDelay]}
                  onValueChange={(value) => setDebounceDelay(value[0])}
                  min={0}
                  max={1000}
                  step={50}
                  style={{ width: "300px" }}
                />
                <Text size="1" color="gray" mt="1">
                  0ms (즉시) ~ 1000ms (1초 지연)
                </Text>
              </Box>
            )}
          </Flex>
        </Box>
      </Card>

      <Flex gap="4" direction={{ initial: "column", lg: "row" }}>
        {/* 컨트롤 패널 */}
        <Flex flexGrow="1" direction="column">
          <Heading size="3" mb="3">
            변화 생성 컨트롤
          </Heading>

          <Card>
            <Box p="4">
              <Flex direction="column" gap="3">
                <Button onClick={addSingleItem} variant="soft">
                  단일 항목 추가
                </Button>

                <Button
                  onClick={addMultipleItems}
                  variant="soft"
                  color="orange"
                >
                  5개 항목 한번에 추가
                </Button>

                <Button
                  onClick={toggleAutoAdd}
                  variant="soft"
                  color={isAutoAdding ? "red" : "green"}
                >
                  {isAutoAdding ? "자동 추가 중단" : "자동 추가 시작"}
                  {isAutoAdding && " (100ms 간격)"}
                </Button>

                <Button onClick={clearItems} variant="soft" color="gray">
                  모든 항목 제거
                </Button>

                <Button onClick={resetCounters} variant="outline">
                  카운터 리셋
                </Button>
              </Flex>
            </Box>
          </Card>

          {/* 성능 통계 */}
          <Card mt="4">
            <Box p="4">
              <Heading size="3" mb="3">
                성능 통계
              </Heading>

              <Flex direction="column" gap="2">
                <Flex justify="between">
                  <Text>총 DOM 변화:</Text>
                  <Badge size="2">{mutationCount}회</Badge>
                </Flex>

                <Flex justify="between">
                  <Text>콜백 호출:</Text>
                  <Badge size="2" color="blue">
                    {callbackCount}회
                  </Badge>
                </Flex>

                <Flex justify="between">
                  <Text>현재 항목 수:</Text>
                  <Badge size="2" color="green">
                    {items.length}개
                  </Badge>
                </Flex>

                {useDebounce && (
                  <Text size="1" color="gray" mt="2">
                    디바운스로 인해 콜백 호출이 {debounceDelay}ms 지연됩니다.
                  </Text>
                )}
              </Flex>
            </Box>
          </Card>
        </Flex>

        {/* 관찰 대상 컨테이너 */}
        <Flex flexGrow="2" direction="column">
          <Heading size="3" mb="3">
            관찰 대상 컨테이너
          </Heading>

          <Card ref={ref} style={{ height: "400px", overflow: "hidden" }}>
            <Box p="3" style={{ height: "100%" }}>
              <Flex justify="between" align="center" mb="3">
                <Text weight="bold">동적 항목 목록</Text>
                <Badge color="blue">{items.length}개</Badge>
              </Flex>

              <Box style={{ height: "calc(100% - 40px)", overflow: "auto" }}>
                {items.length === 0 ? (
                  <Text color="gray" style={{ fontStyle: "italic" }}>
                    항목이 없습니다. 왼쪽 컨트롤을 사용해 항목을 추가해보세요.
                  </Text>
                ) : (
                  <Flex direction="column" gap="1">
                    {items.map((item, index) => (
                      <Card key={item} variant="surface" size="1">
                        <Box p="2">
                          <Text size="1">
                            항목 #{index + 1} (ID: {item.toString().slice(-6)})
                          </Text>
                        </Box>
                      </Card>
                    ))}
                  </Flex>
                )}
              </Box>
            </Box>
          </Card>
        </Flex>
      </Flex>

      <Box
        mt="4"
        p="3"
        style={{ backgroundColor: "var(--orange-2)", borderRadius: "8px" }}
      >
        <Text size="2" weight="bold" mb="2" as="p">
          🚀 성능 최적화 팁
        </Text>
        <Text size="2" color="gray" as="p">
          • <strong>디바운스 없음:</strong> 모든 DOM 변화마다 즉시 콜백 실행
          (높은 CPU 사용량)
          <br />• <strong>디바운스 있음:</strong> 연속된 변화를 그룹화하여
          마지막에 한 번만 실행
          <br />• <strong>권장 딜레이:</strong> 100-300ms (사용자 경험과 성능의
          균형)
          <br />• <strong>실시간 업데이트가 필요한 경우:</strong> 디바운스
          비활성화
          <br />• <strong>대량 데이터 처리 시:</strong> 500ms 이상의 긴 딜레이
          고려
        </Text>
      </Box>
    </Box>
  );
}
