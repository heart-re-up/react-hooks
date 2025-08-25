import { useFocusableElements } from "@heart-re-up/react-lib/hooks/useFocusableElements";
import {
  Box,
  Button,
  Card,
  Flex,
  Switch,
  Text,
  TextField,
} from "@radix-ui/themes";
import React, { useRef, useState } from "react";
import { extractContent } from "../utils";

export function DemoObserver() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [observeChange, setObserveChange] = useState(true);
  const [elements, setElements] = useState<
    Array<{ id: string; type: "input" | "button"; disabled?: boolean }>
  >([
    { id: "1", type: "input" },
    { id: "2", type: "button" },
  ]);
  const [changeLog, setChangeLog] = useState<string[]>([]);

  const { focusableElements } = useFocusableElements({
    containerRef,
    observeChange,
    debounceObserving: 300,
  });

  // 로그 추가 함수
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setChangeLog((prev) => [`${timestamp}: ${message}`, ...prev.slice(0, 9)]);
  };

  // 요소 추가
  const addElement = (type: "input" | "button") => {
    const newId = Date.now().toString();
    setElements((prev) => [...prev, { id: newId, type }]);
    addLog(`${type === "input" ? "입력 필드" : "버튼"} 추가됨 (ID: ${newId})`);
  };

  // 요소 제거
  const removeElement = (id: string) => {
    const element = elements.find((el) => el.id === id);
    setElements((prev) => prev.filter((el) => el.id !== id));
    addLog(
      `${element?.type === "input" ? "입력 필드" : "버튼"} 제거됨 (ID: ${id})`
    );
  };

  // 요소 비활성화/활성화 토글
  const toggleDisabled = (id: string) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, disabled: !el.disabled } : el))
    );
    const element = elements.find((el) => el.id === id);
    addLog(`요소 ${element?.disabled ? "활성화" : "비활성화"}됨 (ID: ${id})`);
  };

  // 모든 요소 제거
  const clearAll = () => {
    setElements([]);
    addLog("모든 요소 제거됨");
  };

  // 로그 지우기
  const clearLog = () => setChangeLog([]);

  // focusableElements 변화 감지
  React.useEffect(() => {
    if (observeChange) {
      addLog(`포커스 가능한 요소 수 변경: ${focusableElements.length}개`);
    }
  }, [focusableElements.length, observeChange]);

  return (
    <Box>
      <Text size="2" color="gray" mb="4" as="p">
        DOM 변화를 실시간으로 감지하여 포커스 가능한 요소 목록을 자동
        업데이트하는 데모입니다. observeChange 옵션을 켜고 요소를
        추가/제거해보세요.
      </Text>

      <Card mb="4">
        <Flex justify="between" align="center" mb="3">
          <Text weight="bold" as="p">
            DOM 변화 감지 설정
          </Text>
          <Flex align="center" gap="2">
            <Text size="2">observeChange:</Text>
            <Switch
              checked={observeChange}
              onCheckedChange={setObserveChange}
            />
            <Text size="2" color={observeChange ? "green" : "gray"}>
              {observeChange ? "활성화" : "비활성화"}
            </Text>
          </Flex>
        </Flex>

        <Flex gap="2" wrap="wrap">
          <Button
            onClick={() => addElement("input")}
            size="2"
            variant="outline"
          >
            입력 필드 추가
          </Button>
          <Button
            onClick={() => addElement("button")}
            size="2"
            variant="outline"
          >
            버튼 추가
          </Button>
          <Button onClick={clearAll} size="2" variant="outline" color="red">
            모든 요소 제거
          </Button>
        </Flex>
      </Card>

      <Flex gap="4">
        <Flex flexGrow="1">
          <Card>
            <Text weight="bold" mb="3" as="p">
              동적 컨테이너 (포커스 가능한 요소: {focusableElements.length}개)
            </Text>

            <div
              ref={containerRef}
              style={{
                border: "2px dashed var(--green-6)",
                padding: "16px",
                borderRadius: "6px",
                backgroundColor: "var(--green-1)",
                minHeight: "200px",
              }}
            >
              <Text size="2" color="gray" mb="3" as="p">
                🔍 MutationObserver 감지 영역
              </Text>

              {elements.length === 0 ? (
                <Text size="2" color="gray" style={{ fontStyle: "italic" }}>
                  요소가 없습니다. 위 버튼으로 요소를 추가해보세요.
                </Text>
              ) : (
                <Flex direction="column" gap="3">
                  {elements.map((element) => (
                    <Flex key={element.id} gap="2" align="center">
                      {element.type === "input" ? (
                        <>
                          <Text size="2" style={{ minWidth: "60px" }}>
                            Input:
                          </Text>
                          <TextField.Root
                            placeholder={`입력 필드 ${element.id}`}
                            disabled={element.disabled}
                          />
                        </>
                      ) : (
                        <>
                          <Text size="2" style={{ minWidth: "60px" }}>
                            Button:
                          </Text>
                          <Button
                            variant="outline"
                            size="2"
                            disabled={element.disabled}
                            style={{ flex: 1 }}
                          >
                            버튼 {element.id}
                          </Button>
                        </>
                      )}

                      <Button
                        onClick={() => toggleDisabled(element.id)}
                        size="1"
                        variant="ghost"
                        color={element.disabled ? "green" : "orange"}
                      >
                        {element.disabled ? "활성화" : "비활성화"}
                      </Button>

                      <Button
                        onClick={() => removeElement(element.id)}
                        size="1"
                        variant="ghost"
                        color="red"
                      >
                        제거
                      </Button>
                    </Flex>
                  ))}
                </Flex>
              )}
            </div>
          </Card>
        </Flex>

        <Box style={{ minWidth: "350px" }}>
          <Card mb="3">
            <Text weight="bold" mb="3" as="p">
              현재 포커스 가능한 요소들
            </Text>

            <Box
              style={{
                maxHeight: "150px",
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
                    mb="1"
                    p="2"
                    style={{
                      backgroundColor: "var(--gray-3)",
                      borderRadius: "4px",
                      fontSize: "11px",
                    }}
                  >
                    <Text size="1" weight="bold" color="blue">
                      [{index}] {element.tagName.toLowerCase()}
                    </Text>
                    <Text size="1" color="gray" ml="2">
                      {extractContent(element)}
                    </Text>
                  </Box>
                ))
              )}
            </Box>
          </Card>

          <Card>
            <Flex justify="between" align="center" mb="3">
              <Text weight="bold" as="p">
                변화 감지 로그
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
              {changeLog.length === 0 ? (
                <Text size="2" color="gray">
                  변화 감지 로그가 여기에 표시됩니다
                </Text>
              ) : (
                changeLog.map((log, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "4px",
                      color: "var(--gray-11)",
                      borderLeft:
                        index === 0 ? "3px solid var(--blue-9)" : "none",
                      paddingLeft: index === 0 ? "8px" : "0",
                    }}
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
          🔍 MutationObserver 기능
        </Text>
        <Text size="2" as="p">
          • <Text weight="bold">observeChange</Text>: DOM 변화 감지
          활성화/비활성화
          <br />• <Text weight="bold">debounceObserving</Text>: 변화 감지
          디바운스 지연 시간 설정
          <br />• <Text weight="bold">childList</Text>: 자식 요소 추가/제거 감지
          <br />• <Text weight="bold">subtree</Text>: 하위 트리 전체 감지
          <br />• <Text weight="bold">attributes</Text>: 속성 변화 감지
          (disabled 등)
        </Text>
      </Box>
    </Box>
  );
}
