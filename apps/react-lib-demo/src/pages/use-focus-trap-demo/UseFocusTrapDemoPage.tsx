import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import { DemoBasic } from "./DemoBasic";
import { DemoModal } from "./DemoModal";
import { relations } from "./relations";

export default function UseFocusTrapDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="useFocusTrap"
        description="특정 컨테이너 내에서 포커스를 가두어 키보드 내비게이션을 제한하는 훅입니다. 모달, 다이얼로그, 드롭다운 등에서 접근성을 향상시키는 데 필수적입니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root defaultValue="basic" mt="2">
        <Tabs.List>
          <Tabs.Trigger value="basic">기본 사용법</Tabs.Trigger>
          <Tabs.Trigger value="modal">모달 예제</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="basic">
            <DemoBasic />
          </Tabs.Content>
          <Tabs.Content value="modal">
            <DemoModal />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
