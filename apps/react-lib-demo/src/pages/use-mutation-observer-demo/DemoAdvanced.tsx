import { useMutationObserver } from "@heart-re-up/react-lib/hooks/useMutationObserver";
import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Heading,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";

interface ObserverConfig {
  childList: boolean;
  attributes: boolean;
  characterData: boolean;
  subtree: boolean;
  attributeOldValue: boolean;
  characterDataOldValue: boolean;
  attributeFilter: string[];
}

export function DemoAdvanced() {
  const [config, setConfig] = useState<ObserverConfig>({
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true,
    attributeOldValue: false,
    characterDataOldValue: false,
    attributeFilter: ["class", "style", "data-custom"], // name 속성은 제외하여 불필요한 감지 방지
  });

  const [observerEnabled, setObserverEnabled] = useState(true);
  const [mutationLog, setMutationLog] = useState<string[]>([]);
  const [elementStyle, setElementStyle] = useState({
    backgroundColor: "#f0f0f0",
    color: "#333",
    padding: "10px",
    borderRadius: "4px",
  });
  const [textContent, setTextContent] = useState("이 텍스트를 수정해보세요");
  const [customAttribute, setCustomAttribute] = useState("initial-value");

  // 고급 MutationObserver 콜백
  const handleMutation = (mutations: MutationRecord[]) => {
    console.log("handleMutation", mutations);
    const timestamp = new Date().toLocaleTimeString();

    mutations.forEach((mutation) => {
      let logMessage = "";

      switch (mutation.type) {
        case "childList":
          if (mutation.addedNodes.length > 0) {
            logMessage = `자식 요소 추가: ${mutation.addedNodes.length}개`;
          }
          if (mutation.removedNodes.length > 0) {
            logMessage = `자식 요소 제거: ${mutation.removedNodes.length}개`;
          }
          break;

        case "attributes": {
          const attrName = mutation.attributeName;
          const target = mutation.target as Element;
          const newValue = target.getAttribute(attrName || "");
          const oldValue = mutation.oldValue;

          logMessage = `속성 변경: ${attrName}`;
          if (config.attributeOldValue && oldValue !== null) {
            logMessage += ` (${oldValue} → ${newValue})`;
          }
          break;
        }

        case "characterData": {
          const newText = (mutation.target as CharacterData).data;
          const oldText = mutation.oldValue;

          logMessage = "텍스트 데이터 변경";
          if (config.characterDataOldValue && oldText !== null) {
            logMessage += ` (${oldText.slice(0, 20)}... → ${newText.slice(0, 20)}...)`;
          }
          break;
        }
      }

      if (logMessage) {
        setMutationLog((prev) => [
          `${timestamp}: ${logMessage}`,
          ...prev.slice(0, 19), // 최대 20개 로그만 유지
        ]);
      }
    });
  };

  // MutationObserver 옵션 구성
  const mutationOptions = {
    childList: config.childList,
    attributes: config.attributes,
    characterData: config.characterData,
    subtree: config.subtree,
    attributeOldValue: config.attributeOldValue,
    characterDataOldValue: config.characterDataOldValue,
    ...(config.attributeFilter.length > 0 && {
      attributeFilter: config.attributeFilter,
    }),
  };

  // useMutationObserver 훅 사용
  const { ref, disconnect } = useMutationObserver({
    callback: handleMutation,
    options: mutationOptions,
    disabled: !observerEnabled,
  });

  // 설정 업데이트 함수들
  const updateConfig = (
    key: keyof ObserverConfig,
    value: boolean | string[]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // 스타일 변경
  const changeBackgroundColor = (color: string) => {
    setElementStyle((prev) => ({ ...prev, backgroundColor: color }));
  };

  const changeTextColor = (color: string) => {
    setElementStyle((prev) => ({ ...prev, color: color }));
  };

  // 자식 요소 추가/제거
  const [childElements, setChildElements] = useState<string[]>([]);

  const addChildElement = () => {
    const newId = `child-${Date.now()}`;
    setChildElements((prev) => [...prev, newId]);
  };

  const removeChildElement = (id: string) => {
    setChildElements((prev) => prev.filter((childId) => childId !== id));
  };

  // 속성 필터 관리
  const [newAttributeFilter, setNewAttributeFilter] = useState("");

  const addAttributeFilter = () => {
    if (
      newAttributeFilter.trim() &&
      !config.attributeFilter.includes(newAttributeFilter.trim())
    ) {
      updateConfig("attributeFilter", [
        ...config.attributeFilter,
        newAttributeFilter.trim(),
      ]);
      setNewAttributeFilter("");
    }
  };

  const removeAttributeFilter = (attr: string) => {
    updateConfig(
      "attributeFilter",
      config.attributeFilter.filter((a) => a !== attr)
    );
  };

  // 로그 초기화
  const clearLog = () => {
    setMutationLog([]);
  };

  return (
    <Box>
      <Text size="2" color="gray" mb="4" as="p">
        MutationObserver의 다양한 옵션을 활용한 고급 사용법을 보여줍니다. 각
        옵션을 조정하여 원하는 변화만 감지할 수 있습니다.
      </Text>

      <Flex gap="4" direction={{ initial: "column", xl: "row" }}>
        {/* 설정 패널 */}
        <Flex flexGrow="1" direction="column">
          <Heading size="3" mb="3">
            Observer 설정
          </Heading>

          <Card mb="4">
            <Box p="3">
              <Text weight="bold" mb="3" as="p">
                기본 옵션
              </Text>

              <Flex direction="column" gap="2">
                <Flex align="center" gap="2">
                  <Checkbox
                    checked={config.childList}
                    onCheckedChange={(checked) =>
                      updateConfig("childList", !!checked)
                    }
                  />
                  <Text size="2">childList - 자식 요소 변화 감지</Text>
                </Flex>

                <Flex align="center" gap="2">
                  <Checkbox
                    checked={config.attributes}
                    onCheckedChange={(checked) =>
                      updateConfig("attributes", !!checked)
                    }
                  />
                  <Text size="2">attributes - 속성 변화 감지</Text>
                </Flex>

                <Flex align="center" gap="2">
                  <Checkbox
                    checked={config.characterData}
                    onCheckedChange={(checked) =>
                      updateConfig("characterData", !!checked)
                    }
                  />
                  <Text size="2">characterData - 텍스트 변화 감지</Text>
                </Flex>

                <Flex align="center" gap="2">
                  <Checkbox
                    checked={config.subtree}
                    onCheckedChange={(checked) =>
                      updateConfig("subtree", !!checked)
                    }
                  />
                  <Text size="2">subtree - 하위 트리 전체 감지</Text>
                </Flex>
              </Flex>
            </Box>
          </Card>

          <Card mb="4">
            <Box p="3">
              <Text weight="bold" mb="3" as="p">
                고급 옵션
              </Text>

              <Flex direction="column" gap="2">
                <Flex align="center" gap="2">
                  <Checkbox
                    checked={config.attributeOldValue}
                    onCheckedChange={(checked) =>
                      updateConfig("attributeOldValue", !!checked)
                    }
                    disabled={!config.attributes}
                  />
                  <Text size="2">attributeOldValue - 이전 속성값 기록</Text>
                </Flex>

                <Flex align="center" gap="2">
                  <Checkbox
                    checked={config.characterDataOldValue}
                    onCheckedChange={(checked) =>
                      updateConfig("characterDataOldValue", !!checked)
                    }
                    disabled={!config.characterData}
                  />
                  <Text size="2">characterDataOldValue - 이전 텍스트 기록</Text>
                </Flex>
              </Flex>
            </Box>
          </Card>

          <Card mb="4">
            <Box p="3">
              <Text weight="bold" mb="3" as="p">
                속성 필터
              </Text>

              <Flex gap="2" mb="2">
                <TextField.Root
                  placeholder="속성명 입력 (예: class, style)"
                  value={newAttributeFilter}
                  onChange={(e) => setNewAttributeFilter(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addAttributeFilter()}
                  style={{ flex: 1 }}
                />
                <Button size="2" onClick={addAttributeFilter}>
                  추가
                </Button>
              </Flex>

              <Flex gap="1" wrap="wrap">
                {config.attributeFilter.map((attr) => (
                  <Badge key={attr} variant="soft">
                    {attr}
                    <Button
                      size="1"
                      variant="ghost"
                      onClick={() => removeAttributeFilter(attr)}
                      style={{ marginLeft: "4px", padding: "0 4px" }}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </Flex>

              {config.attributeFilter.length === 0 ? (
                <Text size="1" color="gray">
                  필터가 없으면 모든 속성 변화를 감지합니다 (name, id 등
                  불필요한 속성 포함)
                </Text>
              ) : (
                <Text size="1" color="green">
                  현재 {config.attributeFilter.join(", ")} 속성만 감지합니다
                </Text>
              )}
            </Box>
          </Card>

          <Card>
            <Box p="3">
              <Text weight="bold" mb="3" as="p">
                Observer 제어
              </Text>

              <Flex direction="column" gap="2">
                <Flex align="center" gap="2">
                  <Checkbox
                    checked={observerEnabled}
                    onCheckedChange={(checked) =>
                      setObserverEnabled(
                        checked === "indeterminate" ? false : checked
                      )
                    }
                  />
                  <Text size="2">Observer 활성화</Text>
                </Flex>

                <Button variant="soft" onClick={disconnect}>
                  Observer 연결 해제
                </Button>
              </Flex>
            </Box>
          </Card>
        </Flex>

        {/* 테스트 영역 */}
        <Flex flexGrow="2" direction="column">
          <Heading size="3" mb="3">
            테스트 영역
          </Heading>

          {/* 관찰 대상 요소 */}
          <Card mb="4" ref={ref}>
            <Box p="4" style={elementStyle}>
              <Text weight="bold" mb="3" as="p">
                관찰 대상 요소
              </Text>

              {/* 텍스트 변경 테스트 */}
              <Box mb="3">
                <Text size="2" mb="2" as="p">
                  텍스트 내용:
                </Text>
                <TextField.Root
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                />
              </Box>

              {/* 스타일 변경 테스트 */}
              <Box mb="3">
                <Text size="2" mb="2" as="p">
                  배경색 변경:
                </Text>
                <Flex gap="2">
                  <Button
                    size="1"
                    onClick={() => changeBackgroundColor("#ffebee")}
                  >
                    빨강
                  </Button>
                  <Button
                    size="1"
                    onClick={() => changeBackgroundColor("#e8f5e8")}
                  >
                    초록
                  </Button>
                  <Button
                    size="1"
                    onClick={() => changeBackgroundColor("#e3f2fd")}
                  >
                    파랑
                  </Button>
                  <Button
                    size="1"
                    onClick={() => changeBackgroundColor("#f0f0f0")}
                  >
                    기본
                  </Button>
                </Flex>
              </Box>

              {/* 텍스트 색상 변경 */}
              <Box mb="3">
                <Text size="2" mb="2" as="p">
                  텍스트 색상:
                </Text>
                <Select.Root
                  value={elementStyle.color}
                  onValueChange={changeTextColor}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="#333">기본 (검정)</Select.Item>
                    <Select.Item value="#d32f2f">빨강</Select.Item>
                    <Select.Item value="#388e3c">초록</Select.Item>
                    <Select.Item value="#1976d2">파랑</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>

              {/* 커스텀 속성 */}
              <Box mb="3">
                <Text size="2" mb="2" as="p">
                  커스텀 속성 (data-custom):
                </Text>
                <TextField.Root
                  value={customAttribute}
                  onChange={(e) => setCustomAttribute(e.target.value)}
                />
              </Box>

              {/* 자식 요소 관리 */}
              <Box>
                <Flex justify="between" align="center" mb="2">
                  <Text size="2">자식 요소:</Text>
                  <Button size="1" onClick={addChildElement}>
                    자식 추가
                  </Button>
                </Flex>

                <Flex direction="column" gap="1">
                  {childElements.map((childId) => (
                    <Card key={childId} variant="surface" size="1">
                      <Flex justify="between" align="center" p="2">
                        <Text size="1">{childId}</Text>
                        <Button
                          size="1"
                          variant="soft"
                          color="red"
                          onClick={() => removeChildElement(childId)}
                        >
                          제거
                        </Button>
                      </Flex>
                    </Card>
                  ))}
                </Flex>
              </Box>

              {/* 실제 텍스트 표시 */}
              <Box
                mt="3"
                p="2"
                style={{
                  backgroundColor: "rgba(255,255,255,0.5)",
                  borderRadius: "4px",
                }}
              >
                <Text data-custom={customAttribute}>{textContent}</Text>
              </Box>
            </Box>
          </Card>

          {/* 변화 로그 */}
          <Card>
            <Box p="3">
              <Flex justify="between" align="center" mb="3">
                <Text weight="bold">변화 감지 로그</Text>
                <Button size="1" variant="soft" onClick={clearLog}>
                  로그 지우기
                </Button>
              </Flex>

              <Box style={{ height: "200px", overflow: "auto" }}>
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
        style={{ backgroundColor: "var(--purple-2)", borderRadius: "8px" }}
      >
        <Text size="2" weight="bold" mb="2" as="p">
          🔧 고급 옵션 가이드
        </Text>
        <Text size="2" color="gray" as="p">
          • <strong>attributeFilter:</strong> 특정 속성만 감지하여 성능 최적화
          (예: name, id 속성 제외)
          <br />• <strong>attributeOldValue:</strong> 속성 변경 시 이전 값도
          함께 기록
          <br />• <strong>characterDataOldValue:</strong> 텍스트 변경 시 이전
          내용도 기록
          <br />• <strong>subtree: false:</strong> 직접 자식만 감지 (성능 향상)
          <br />• <strong>실무 팁:</strong> UI 라이브러리가 내부적으로 설정하는
          속성(name, id 등)은 필터로 제외하여 불필요한 감지 방지
        </Text>
      </Box>
    </Box>
  );
}
