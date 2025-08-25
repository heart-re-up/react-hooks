import { useMutationObserver } from "@heart-re-up/react-lib/hooks/useMutationObserver";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useCallback, useState } from "react";

const NewItemInputComponent = ({
  onAddItem,
}: {
  onAddItem?: (item: string) => void;
}) => {
  const [value, setValue] = useState("");
  const addItem = useCallback(() => onAddItem?.(value), [value, onAddItem]);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    [setValue]
  );
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        addItem();
      }
    },
    [addItem]
  );
  const handleClick = useCallback(() => {
    addItem();
    setValue("");
  }, [addItem, setValue]);

  return (
    <Flex gap="2" mb="3">
      <TextField.Root
        placeholder="새 항목 입력..."
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{ flex: 1 }}
      />
      <Button onClick={handleClick} disabled={!value.trim()}>
        추가
      </Button>
    </Flex>
  );
};

export function DemoBasic() {
  const [mutationLog, setMutationLog] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>([
    "첫 번째 항목",
    "두 번째 항목",
  ]);

  // MutationObserver 콜백 - DOM 변화를 감지하고 로그에 기록
  const handleMutation = (mutations: MutationRecord[]) => {
    console.log("handleMutation", mutations);
    const timestamp = new Date().toLocaleTimeString();

    mutations.forEach((mutation) => {
      let logMessage = "";

      switch (mutation.type) {
        case "childList":
          if (mutation.addedNodes.length > 0) {
            logMessage = `요소 추가됨 (${mutation.addedNodes.length}개)`;
          }
          if (mutation.removedNodes.length > 0) {
            logMessage = `요소 제거됨 (${mutation.removedNodes.length}개)`;
          }
          break;
        case "characterData":
          logMessage = "텍스트 내용 변경됨";
          break;
        case "attributes":
          logMessage = `속성 변경됨: ${mutation.attributeName}`;
          break;
      }

      if (logMessage) {
        setMutationLog((prev) => [
          `${timestamp}: ${logMessage}`,
          ...prev.slice(0, 9), // 최대 10개 로그만 유지
        ]);
      }
    });
  };

  // useMutationObserver 훅 사용
  const { ref, disconnect } = useMutationObserver({
    callback: handleMutation,
    options: {
      childList: true, // 자식 요소 추가/제거 감지
      subtree: true, // 하위 트리 전체 감지
      characterData: true, // 텍스트 변경 감지
      attributes: true, // 속성 변경 감지
    },
  });

  // 항목 추가
  const handleAddItem = (value: string) => {
    if (value.trim()) {
      setItems((prev) => [...prev, value.trim()]);
    }
  };

  // 항목 제거
  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // 항목 수정
  const editItem = (index: number) => {
    const newText = prompt("새로운 텍스트를 입력하세요:", items[index]);
    if (newText !== null && newText.trim()) {
      setItems((prev) =>
        prev.map((item, i) => (i === index ? newText.trim() : item))
      );
    }
  };

  // 로그 초기화
  const clearLog = () => {
    setMutationLog([]);
  };

  // 모든 항목 제거
  const clearAllItems = () => {
    setItems([]);
  };

  return (
    <Box>
      <Text size="2" color="gray" mb="4" as="p">
        DOM 요소의 변화를 실시간으로 감지하는 기본적인 사용법을 보여줍니다. 아래
        컨테이너에서 항목을 추가, 제거, 수정해보세요.
      </Text>

      <Flex gap="4" direction={{ initial: "column", md: "row" }}>
        {/* 관찰 대상 컨테이너 */}
        <Flex flexGrow="1" direction="column">
          <Heading size="3" mb="3">
            관찰 대상 컨테이너
          </Heading>

          {/* 항목 추가 입력 */}
          <NewItemInputComponent onAddItem={handleAddItem} />

          {/* 관찰되는 컨테이너 */}
          <Card ref={ref} style={{ minHeight: "200px" }}>
            <Box p="3">
              <Flex justify="between" align="center" mb="3">
                <Text weight="bold">항목 목록</Text>
                <Badge color="blue">{items.length}개</Badge>
              </Flex>

              {items.length === 0 ? (
                <Text color="gray" style={{ fontStyle: "italic" }}>
                  항목이 없습니다. 위에서 항목을 추가해보세요.
                </Text>
              ) : (
                <Flex direction="column" gap="2">
                  {items.map((item, index) => (
                    <Card key={index} variant="surface">
                      <Flex justify="between" align="center" p="2">
                        <Text>{item}</Text>
                        <Flex gap="1">
                          <Button
                            size="1"
                            variant="soft"
                            onClick={() => editItem(index)}
                          >
                            수정
                          </Button>
                          <Button
                            size="1"
                            variant="soft"
                            color="red"
                            onClick={() => removeItem(index)}
                          >
                            삭제
                          </Button>
                        </Flex>
                      </Flex>
                    </Card>
                  ))}
                </Flex>
              )}
            </Box>
          </Card>

          <Flex gap="2" mt="3">
            <Button variant="soft" color="red" onClick={clearAllItems}>
              모든 항목 삭제
            </Button>
            <Button variant="soft" color="gray" onClick={disconnect}>
              관찰 중단
            </Button>
          </Flex>
        </Flex>

        {/* 변화 로그 */}
        <Flex flexGrow="1" direction="column">
          <Heading size="3" mb="3">
            변화 감지 로그
          </Heading>

          <Card style={{ height: "300px", overflow: "hidden" }}>
            <Box p="3" style={{ height: "100%" }}>
              <Flex justify="between" align="center" mb="3">
                <Text weight="bold">실시간 로그</Text>
                <Button size="1" variant="soft" onClick={clearLog}>
                  로그 지우기
                </Button>
              </Flex>

              <Box style={{ height: "calc(100% - 40px)", overflow: "auto" }}>
                {mutationLog.length === 0 ? (
                  <Text color="gray" style={{ fontStyle: "italic" }}>
                    아직 변화가 감지되지 않았습니다.
                  </Text>
                ) : (
                  <Flex direction="column" gap="1">
                    {mutationLog.map((log, index) => (
                      <Text
                        key={index}
                        size="1"
                        style={{
                          fontFamily: "monospace",
                          padding: "4px 8px",
                          backgroundColor: "var(--gray-2)",
                          borderRadius: "4px",
                        }}
                      >
                        {log}
                      </Text>
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
        style={{ backgroundColor: "var(--blue-2)", borderRadius: "8px" }}
      >
        <Text size="2" weight="bold" mb="2" as="p">
          💡 사용 팁
        </Text>
        <Text size="2" color="gray" as="p">
          • MutationObserver는 DOM 변화를 실시간으로 감지합니다
          <br />
          • childList: 자식 요소 추가/제거 감지
          <br />
          • subtree: 하위 트리 전체 감지
          <br />
          • characterData: 텍스트 내용 변경 감지
          <br />
          • attributes: 속성 변경 감지
          <br />• 성능을 위해 필요한 옵션만 활성화하는 것이 좋습니다
        </Text>
      </Box>
    </Box>
  );
}
