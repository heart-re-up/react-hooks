import { useWindowEventMessage } from "@heart-re-up/react-lib/hooks/useWindowEventMessage";
import { findTargetWindow } from "@heart-re-up/react-lib/libs/window";
import { WindowMessage } from "@heart-re-up/react-lib/libs/window";
import { Badge, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState } from "react";

interface MessageData {
  type: string;
  content: string;
  timestamp: string;
}

export default function DemoParent() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [outgoingMessage, setOutgoingMessage] = useState("Hello from parent!");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [childReady, setChildReady] = useState(false);

  // 로그 추가 함수
  const addLog = useCallback(
    (message: string, type: "info" | "success" | "error" = "info") => {
      const timestamp = new Date().toLocaleTimeString("ko-KR");
      const emoji = type === "success" ? "✅" : type === "error" ? "❌" : "📝";
      setMessageHistory((prev) => [
        `[${timestamp}] ${emoji} ${message}`,
        ...prev.slice(0, 19), // 최대 20개 메시지 유지
      ]);
    },
    []
  );

  // 메시지 수신 핸들러
  const handleMessage = useCallback(
    (message: WindowMessage<unknown>) => {
      addLog(
        `자식으로부터 메시지 수신: ${JSON.stringify(message.payload)}`,
        "success"
      );

      // 자식 준비 완료 메시지 처리
      if (typeof message.payload === "object" && message.payload !== null) {
        const data = message.payload as MessageData;
        if (data.type === "child-ready") {
          setChildReady(true);
          addLog("자식 페이지가 준비되었습니다!", "success");

          // 연결 확인 메시지 전송
          setTimeout(() => {
            sendConnectionCheck();
          }, 500);
        }
      }
    },
    [addLog]
  );

  // iframe 타겟으로 메시지를 전송하는 훅
  const { postMessage } = useWindowEventMessage({
    targetWindow: "frame:child-iframe", // iframe의 name 속성과 일치
    targetOrigin: "http://localhost:3001",
    trustedOrigins: [window.location.origin],
    onMessage: handleMessage,
  });

  // iframe 로드 상태 확인
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIframeLoaded(true);
      addLog("iframe이 로드되었습니다.", "success");
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, [addLog]);

  // 연결 확인 메시지 전송
  const sendConnectionCheck = useCallback(() => {
    const checkMessage: MessageData = {
      type: "connection-check",
      content: "부모에서 연결을 확인합니다.",
      timestamp: new Date().toISOString(),
    };

    postMessage(checkMessage);
    addLog("자식에게 연결 확인 메시지 전송", "info");
  }, [postMessage, addLog]);

  // 메시지 전송 함수
  const sendMessage = useCallback(() => {
    if (!outgoingMessage.trim()) {
      addLog("메시지가 비어있습니다!", "error");
      return;
    }

    if (!iframeLoaded) {
      addLog("iframe이 아직 로드되지 않았습니다!", "error");
      return;
    }

    const messageData: MessageData = {
      type: "parent-message",
      content: outgoingMessage,
      timestamp: new Date().toISOString(),
    };

    postMessage(messageData);
    addLog(`자식에게 메시지 전송: "${outgoingMessage}"`, "info");
    setOutgoingMessage(""); // 전송 후 입력 필드 초기화
  }, [outgoingMessage, postMessage, addLog, iframeLoaded]);

  // 직접 iframe에 메시지 전송 (비교용)
  const sendDirectMessage = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) {
      addLog("iframe이 로드되지 않았습니다.", "error");
      return;
    }

    if (!outgoingMessage.trim()) {
      addLog("메시지가 비어있습니다!", "error");
      return;
    }

    const messageData: MessageData = {
      type: "direct-message",
      content: outgoingMessage,
      timestamp: new Date().toISOString(),
    };

    iframe.contentWindow.postMessage(messageData, window.location.origin);
    addLog(`자식에게 직접 메시지 전송: "${outgoingMessage}"`, "info");
    setOutgoingMessage("");
  }, [outgoingMessage, addLog]);

  // Enter 키 처리
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    },
    [sendMessage]
  );

  // 로그 지우기
  const clearLogs = useCallback(() => {
    setMessageHistory([]);
    addLog("로그가 초기화되었습니다.", "info");
  }, [addLog]);

  // findTargetWindow 테스트
  const testFindTargetWindow = useCallback(() => {
    const target = findTargetWindow("frame:child-iframe");
    if (target) {
      addLog("findTargetWindow로 iframe을 성공적으로 찾았습니다!", "success");
    } else {
      addLog("findTargetWindow로 iframe을 찾지 못했습니다.", "error");
    }
  }, [addLog]);

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">
            🖼️ Iframe Parent - 부모 페이지
          </Text>
          <Flex gap="2">
            <Badge color={iframeLoaded ? "green" : "orange"}>
              {iframeLoaded ? "iframe 로드됨" : "iframe 로딩중"}
            </Badge>
            <Badge color={childReady ? "green" : "orange"}>
              {childReady ? "자식 준비됨" : "자식 대기중"}
            </Badge>
          </Flex>
        </Flex>

        <Text size="2" color="gray">
          이 페이지는 iframe을 생성하여 자식 페이지를 로드하고,
          useWindowEventMessage를 통해 통신합니다.
        </Text>

        <Flex gap="4" style={{ height: "600px" }}>
          {/* 왼쪽: 컨트롤 패널 */}
          <Card style={{ flex: 1 }}>
            <Flex direction="column" gap="4" style={{ height: "100%" }}>
              <Text size="3" weight="bold">
                🎛️ 컨트롤 패널
              </Text>

              {/* 메시지 전송 */}
              <Card variant="surface">
                <Flex direction="column" gap="3">
                  <Text size="2" weight="medium">
                    📤 메시지 전송
                  </Text>

                  <Flex direction="column" gap="2">
                    <Text size="2">자식에게 보낼 메시지:</Text>
                    <TextField.Root
                      value={outgoingMessage}
                      onChange={(e) => setOutgoingMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="메시지를 입력하세요..."
                    />
                  </Flex>

                  <Flex gap="2" wrap="wrap">
                    <Button
                      onClick={sendMessage}
                      disabled={!outgoingMessage.trim() || !childReady}
                    >
                      📨 훅으로 전송
                    </Button>
                    <Button
                      onClick={sendDirectMessage}
                      disabled={!outgoingMessage.trim() || !iframeLoaded}
                      variant="soft"
                    >
                      📤 직접 전송
                    </Button>
                  </Flex>
                </Flex>
              </Card>

              {/* 테스트 버튼들 */}
              <Card variant="surface">
                <Flex direction="column" gap="3">
                  <Text size="2" weight="medium">
                    🔧 테스트 도구
                  </Text>

                  <Flex gap="2" wrap="wrap">
                    <Button onClick={sendConnectionCheck} variant="soft">
                      🔗 연결 확인
                    </Button>
                    <Button onClick={testFindTargetWindow} variant="soft">
                      🎯 타겟 찾기
                    </Button>
                    <Button onClick={clearLogs} variant="outline" size="2">
                      로그 지우기
                    </Button>
                  </Flex>
                </Flex>
              </Card>

              {/* 통신 로그 */}
              <Card style={{ flex: 1 }}>
                <Flex direction="column" gap="3" style={{ height: "100%" }}>
                  <Text size="3" weight="bold">
                    📋 통신 로그 ({messageHistory.length})
                  </Text>

                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      backgroundColor: "var(--gray-2)",
                      padding: "12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontFamily: "monospace",
                    }}
                  >
                    {messageHistory.length === 0 ? (
                      <Text size="2" color="gray">
                        통신 로그가 여기에 표시됩니다.
                      </Text>
                    ) : (
                      messageHistory.map((log, index) => (
                        <div
                          key={index}
                          style={{
                            marginBottom: "8px",
                            padding: "8px",
                            backgroundColor: log.includes("❌")
                              ? "var(--red-2)"
                              : log.includes("✅")
                                ? "var(--green-2)"
                                : "var(--blue-2)",
                            borderRadius: "4px",
                            borderLeft: `3px solid ${
                              log.includes("❌")
                                ? "var(--red-9)"
                                : log.includes("✅")
                                  ? "var(--green-9)"
                                  : "var(--blue-9)"
                            }`,
                          }}
                        >
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </Flex>
              </Card>
            </Flex>
          </Card>

          {/* 오른쪽: Iframe */}
          <Card style={{ flex: 1 }}>
            <Flex direction="column" gap="3" style={{ height: "100%" }}>
              <Text size="3" weight="bold">
                🖼️ 자식 Iframe
              </Text>

              <iframe
                ref={iframeRef}
                src="http://localhost:3001/iframe"
                name="child-iframe"
                title="Child Iframe"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "2px solid var(--gray-6)",
                  borderRadius: "8px",
                  minHeight: "500px",
                }}
                onLoad={(e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
                  console.log(
                    "iframe loaded: window",
                    e.currentTarget.contentWindow
                  );
                  console.log(
                    "iframe loaded: origin",
                    e.currentTarget.contentWindow?.origin
                  );
                  setIframeLoaded(true);
                }}
              />
            </Flex>
          </Card>
        </Flex>

        {/* 사용 가이드 */}
        <Card variant="surface">
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              💡 사용 방법:
            </Text>
            <Text size="2" color="gray">
              1. 페이지가 로드되면 자동으로 iframe이 생성됩니다
            </Text>
            <Text size="2" color="gray">
              2. 자식 페이지가 준비되면 자동으로 연결 확인을 수행합니다
            </Text>
            <Text size="2" color="gray">
              3. 메시지를 입력하고 "훅으로 전송" 또는 "직접 전송"을 클릭하세요
            </Text>
            <Text size="2" color="gray">
              4. 자식으로부터 받은 메시지는 로그에 자동으로 표시됩니다
            </Text>
          </Flex>

          <Card
            variant="surface"
            style={{ backgroundColor: "var(--blue-2)", marginTop: "12px" }}
          >
            <Flex direction="column" gap="2">
              <Text size="2" weight="medium" color="blue">
                🎯 기술적 세부사항:
              </Text>
              <Text size="2" color="blue">
                • <strong>targetWindow</strong>: "frame:child-iframe" (iframe의
                name)
              </Text>
              <Text size="2" color="blue">
                • <strong>targetOrigin</strong>: 현재 origin과 동일
              </Text>
              <Text size="2" color="blue">
                • <strong>trustedOrigins</strong>: 현재 origin만 신뢰
              </Text>
              <Text size="2" color="blue">
                • <strong>통신 방식</strong>: useWindowEventMessage 훅 vs 직접
                postMessage 비교
              </Text>
            </Flex>
          </Card>
        </Card>
      </Flex>
    </Card>
  );
}
