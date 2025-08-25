import { useFocusTrap } from "@heart-re-up/react-lib/hooks/useFocusTrap";
import { useForkRef } from "@heart-re-up/react-lib/hooks/useForkRef";
import { useKeyDown } from "@heart-re-up/react-lib/hooks/useKeyDown";
import {
  Box,
  Button,
  Card,
  Flex,
  Switch,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useRef, useState } from "react";
import { extractContent } from "../utils";

export function DemoBasic() {
  const [trapEnabled, setTrapEnabled] = useState(true);
  const [autoFocus, setAutoFocus] = useState(true);
  const [keyLog, setKeyLog] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    ref: focusTrapRef,
    focusableElements,
    getCurrentFocusIndex,
  } = useFocusTrap({
    disabled: !trapEnabled,
    autoFocus,
  });

  const ref = useForkRef(focusTrapRef, containerRef);

  // 키 이벤트 로깅을 위한 이벤트 리스너
  useKeyDown(["Tab"], (event, key) => {
    if (key !== "Tab") {
      return;
    }
    if (!containerRef.current?.contains(document.activeElement as Node)) {
      return;
    }
    const timestamp = new Date().toLocaleTimeString();
    const direction = event.shiftKey ? "← (Shift+Tab)" : "→ (Tab)";
    setKeyLog((prev) => [
      `${timestamp}: Tab ${direction}`,
      ...prev.slice(0, 4),
    ]);
  });

  const clearLog = () => setKeyLog([]);
  const currentIndex = getCurrentFocusIndex();

  return (
    <Box>
      <Text size="2" color="gray" mb="4" as="p">
        useFocusTrap 훅은 특정 컨테이너 내에서 포커스를 가두는 기능을
        제공합니다. 모달, 다이얼로그, 드롭다운 등에서 접근성을 향상시킬 때
        유용합니다.
      </Text>

      <Card mb="4">
        <Text weight="bold" mb="3" as="p">
          포커스 트랩 설정
        </Text>
        <Flex gap="4" align="center" wrap="wrap">
          <Flex align="center" gap="2">
            <Text size="2">포커스 트랩:</Text>
            <Switch checked={trapEnabled} onCheckedChange={setTrapEnabled} />
            <Text size="2" color={trapEnabled ? "green" : "gray"}>
              {trapEnabled ? "활성화" : "비활성화"}
            </Text>
          </Flex>

          <Flex align="center" gap="2">
            <Text size="2">자동 포커스:</Text>
            <Switch checked={autoFocus} onCheckedChange={setAutoFocus} />
            <Text size="2" color={autoFocus ? "green" : "gray"}>
              {autoFocus ? "활성화" : "비활성화"}
            </Text>
          </Flex>
        </Flex>
      </Card>

      <Flex gap="4">
        <Flex flexGrow="1">
          <Card mb="4">
            <Text weight="bold" mb="3" as="p">
              포커스 트랩 영역 (포커스 가능한 요소: {focusableElements.length}
              개)
            </Text>
            <Text size="2" color="gray" mb="3" as="p">
              현재 포커스된 요소 인덱스:{" "}
              <Text weight="bold" color="blue">
                {currentIndex}
              </Text>
            </Text>

            <div
              ref={ref}
              style={{
                border: trapEnabled
                  ? "3px solid var(--red-6)"
                  : "2px dashed var(--gray-6)",
                padding: "20px",
                borderRadius: "8px",
                backgroundColor: trapEnabled ? "var(--red-1)" : "var(--gray-1)",
                position: "relative",
              }}
            >
              {trapEnabled && (
                <Box
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    backgroundColor: "var(--red-9)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                >
                  🔒 FOCUS TRAP
                </Box>
              )}

              <Text size="2" color="gray" mb="4" as="p">
                {trapEnabled
                  ? "🔒 포커스가 이 영역에 갇혀있습니다. Tab/Shift+Tab으로 순환합니다."
                  : "🔓 포커스 트랩이 비활성화되어 있습니다."}
              </Text>

              <Flex direction="column" gap="3">
                <Flex gap="2" align="center">
                  <Text size="2" style={{ minWidth: "80px" }}>
                    사용자명:
                  </Text>
                  <Flex flexGrow="1">
                    <TextField.Root
                      placeholder="사용자명을 입력하세요"
                      style={{ width: "100%" }}
                    />
                  </Flex>
                </Flex>

                <Flex gap="2" align="center">
                  <Text size="2" style={{ minWidth: "80px" }}>
                    비밀번호:
                  </Text>
                  <Flex flexGrow="1">
                    <TextField.Root
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      style={{ width: "100%" }}
                    />
                  </Flex>
                </Flex>

                <Flex gap="2" align="center">
                  <Text size="2" style={{ minWidth: "80px" }}>
                    이메일:
                  </Text>
                  <Flex flexGrow="1">
                    <TextField.Root
                      type="email"
                      placeholder="이메일을 입력하세요"
                      style={{ width: "100%" }}
                    />
                  </Flex>
                </Flex>

                <Flex gap="2" mt="3">
                  <Button variant="solid" size="2">
                    로그인
                  </Button>
                  <Button variant="outline" size="2">
                    취소
                  </Button>
                  <Button variant="outline" size="2">
                    회원가입
                  </Button>
                </Flex>

                <Flex gap="2" mt="2">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      color: "var(--blue-9)",
                      textDecoration: "underline",
                      fontSize: "14px",
                    }}
                  >
                    비밀번호 찾기
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      color: "var(--blue-9)",
                      textDecoration: "underline",
                      fontSize: "14px",
                    }}
                  >
                    도움말
                  </a>
                </Flex>
              </Flex>
            </div>
          </Card>

          {/* 트랩 외부 요소들 */}
          <Card>
            <Text weight="bold" mb="3" as="p">
              트랩 외부 요소들
            </Text>
            <Text size="2" color="gray" mb="3" as="p">
              포커스 트랩이 활성화되면 이 요소들에는 Tab으로 접근할 수 없습니다.
            </Text>

            <Flex direction="column" gap="3">
              <Flex gap="2" align="center">
                <Text size="2" style={{ minWidth: "80px" }}>
                  외부 입력:
                </Text>
                <Flex flexGrow="1">
                  <TextField.Root
                    placeholder="트랩 외부 입력 필드"
                    style={{ width: "100%" }}
                  />
                </Flex>
              </Flex>

              <Flex gap="2">
                <Button variant="outline" size="2">
                  외부 버튼 1
                </Button>
                <Button variant="outline" size="2">
                  외부 버튼 2
                </Button>
              </Flex>
            </Flex>
          </Card>
        </Flex>

        <Box style={{ minWidth: "300px" }}>
          <Card mb="3">
            <Text weight="bold" mb="3" as="p">
              트랩된 요소 목록
            </Text>

            <Box
              style={{
                maxHeight: "200px",
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
                      backgroundColor:
                        currentIndex === index
                          ? "var(--blue-3)"
                          : "var(--gray-3)",
                      borderRadius: "4px",
                      fontSize: "12px",
                      border:
                        currentIndex === index
                          ? "2px solid var(--blue-9)"
                          : "none",
                    }}
                  >
                    <Text
                      size="1"
                      weight="bold"
                      color={currentIndex === index ? "blue" : "gray"}
                    >
                      [{index}] {element.tagName.toLowerCase()}
                      {currentIndex === index && " ← 현재"}
                    </Text>
                    <br />
                    <Text size="1" color="gray">
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
                Tab 키 이벤트 로그
              </Text>
              <Button onClick={clearLog} size="1" variant="ghost">
                지우기
              </Button>
            </Flex>

            <Box
              style={{
                height: "150px",
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
                  Tab 키 이벤트가 여기에 표시됩니다
                </Text>
              ) : (
                keyLog.map((log, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "4px",
                      color: "var(--gray-11)",
                      borderLeft:
                        index === 0 ? "3px solid var(--red-9)" : "none",
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
          🔒 포커스 트랩 동작
        </Text>
        <Text size="2" as="p">
          • <Text weight="bold">Tab</Text>: 다음 요소로 이동 (마지막에서 첫
          번째로 순환)
          <br />• <Text weight="bold">Shift+Tab</Text>: 이전 요소로 이동 (첫
          번째에서 마지막으로 순환)
          <br />• <Text weight="bold">autoFocus</Text>: 트랩 활성화 시 자동으로
          첫 번째 요소에 포커스
          <br />• <Text weight="bold">disabled</Text>: 트랩 비활성화 시 일반적인
          Tab 동작
        </Text>
      </Box>
    </Box>
  );
}
