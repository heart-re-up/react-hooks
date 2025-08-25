import { useFocusTrap } from "@heart-re-up/react-lib/hooks/useFocusTrap";
import { Box, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import React, { useRef, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const { ref: modalRef } = useFocusTrap({
    disabled: !isOpen,
    autoFocus: true,
  });

  // ESC 키로 모달 닫기
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Flex justify="between" align="center" mb="4">
          <Text size="5" weight="bold">
            {title}
          </Text>
          <Button
            onClick={onClose}
            variant="ghost"
            size="2"
            style={{
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </Button>
        </Flex>
        {children}
      </div>
    </div>
  );
}

export function DemoModal() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  return (
    <Box>
      <Text size="2" color="gray" mb="4" as="p">
        실제 모달 컴포넌트에서 useFocusTrap을 사용하는 예제입니다. 모달이 열리면
        포커스가 모달 내부에 갇히고, ESC 키로 닫을 수 있습니다.
      </Text>

      <Card mb="4">
        <Text weight="bold" mb="3" as="p">
          모달 데모
        </Text>
        <Text size="2" color="gray" mb="3" as="p">
          각 버튼을 클릭해서 다양한 모달을 열어보세요. 모달이 열리면 Tab 키로
          내부 요소들을 순환할 수 있습니다.
        </Text>

        <Flex gap="3" wrap="wrap">
          <Button onClick={() => setIsLoginModalOpen(true)} size="2">
            로그인 모달 열기
          </Button>
          <Button
            onClick={() => setIsSettingsModalOpen(true)}
            size="2"
            variant="outline"
          >
            설정 모달 열기
          </Button>
          <Button
            onClick={() => setIsConfirmModalOpen(true)}
            size="2"
            color="red"
          >
            확인 모달 열기
          </Button>
        </Flex>
      </Card>

      {/* 백그라운드 콘텐츠 */}
      <Card>
        <Text weight="bold" mb="3" as="p">
          백그라운드 콘텐츠
        </Text>
        <Text size="2" color="gray" mb="3" as="p">
          모달이 열려있을 때는 이 영역의 요소들에 Tab으로 접근할 수 없습니다.
        </Text>

        <Flex direction="column" gap="3">
          <Flex gap="2" align="center">
            <Text size="2" style={{ minWidth: "100px" }}>
              백그라운드 입력:
            </Text>
            <TextField.Root placeholder="모달이 열리면 접근 불가" />
          </Flex>

          <Flex gap="2">
            <Button variant="outline" size="2">
              백그라운드 버튼 1
            </Button>
            <Button variant="outline" size="2">
              백그라운드 버튼 2
            </Button>
            <Button variant="outline" size="2">
              백그라운드 버튼 3
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* 로그인 모달 */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="로그인"
      >
        <Flex direction="column" gap="3">
          <Text size="2" color="gray" mb="2">
            🔒 포커스가 이 모달에 갇혀있습니다. Tab/Shift+Tab으로 순환하고 ESC로
            닫으세요.
          </Text>

          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              이메일
            </Text>
            <TextField.Root placeholder="이메일을 입력하세요" type="email" />
          </Flex>

          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              비밀번호
            </Text>
            <TextField.Root
              placeholder="비밀번호를 입력하세요"
              type="password"
            />
          </Flex>

          <Flex gap="2" mt="3">
            <Button size="2" style={{ flex: 1 }}>
              로그인
            </Button>
            <Button
              size="2"
              variant="outline"
              onClick={() => setIsLoginModalOpen(false)}
              style={{ flex: 1 }}
            >
              취소
            </Button>
          </Flex>

          <Flex justify="center" mt="2">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                color: "var(--blue-9)",
                textDecoration: "underline",
                fontSize: "14px",
              }}
            >
              비밀번호를 잊으셨나요?
            </a>
          </Flex>
        </Flex>
      </Modal>

      {/* 설정 모달 */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="설정"
      >
        <Flex direction="column" gap="4">
          <Text size="2" color="gray" mb="2">
            ⚙️ 설정을 변경하고 저장하세요. 포커스는 모달 내부에서만 이동합니다.
          </Text>

          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              사용자명
            </Text>
            <TextField.Root placeholder="사용자명" defaultValue="john_doe" />
          </Flex>

          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              표시 이름
            </Text>
            <TextField.Root placeholder="표시 이름" defaultValue="John Doe" />
          </Flex>

          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              알림 설정
            </Text>
            <Flex gap="2">
              <Button size="2" variant="outline">
                이메일 알림
              </Button>
              <Button size="2" variant="outline">
                푸시 알림
              </Button>
            </Flex>
          </Flex>

          <Flex gap="2" mt="3">
            <Button size="2" style={{ flex: 1 }}>
              저장
            </Button>
            <Button
              size="2"
              variant="outline"
              onClick={() => setIsSettingsModalOpen(false)}
              style={{ flex: 1 }}
            >
              취소
            </Button>
          </Flex>
        </Flex>
      </Modal>

      {/* 확인 모달 */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="확인"
      >
        <Flex direction="column" gap="4">
          <Text size="3" mb="2">
            정말로 이 작업을 수행하시겠습니까?
          </Text>

          <Text size="2" color="gray">
            ⚠️ 이 작업은 되돌릴 수 없습니다. 신중하게 선택하세요.
          </Text>

          <Flex gap="2" mt="3">
            <Button
              size="2"
              color="red"
              onClick={() => setIsConfirmModalOpen(false)}
              style={{ flex: 1 }}
            >
              삭제
            </Button>
            <Button
              size="2"
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
              style={{ flex: 1 }}
            >
              취소
            </Button>
          </Flex>
        </Flex>
      </Modal>

      <Box
        mt="4"
        p="3"
        style={{ backgroundColor: "var(--gray-2)", borderRadius: "6px" }}
      >
        <Text size="2" weight="bold" mb="2" as="p">
          💡 모달에서의 포커스 트랩 활용
        </Text>
        <Text size="2" as="p">
          • <Text weight="bold">접근성 향상</Text>: 스크린 리더 사용자가 모달
          외부로 벗어나지 않음
          <br />• <Text weight="bold">사용자 경험</Text>: Tab 키로 모달 내부
          요소들만 순환
          <br />• <Text weight="bold">키보드 내비게이션</Text>: ESC 키로 모달
          닫기 지원
          <br />• <Text weight="bold">자동 포커스</Text>: 모달 열릴 때 첫 번째
          요소에 자동 포커스
        </Text>
      </Box>
    </Box>
  );
}
