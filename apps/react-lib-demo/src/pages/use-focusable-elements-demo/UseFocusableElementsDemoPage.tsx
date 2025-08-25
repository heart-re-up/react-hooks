import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import { DemoBasic } from "./DemoBasic";
import { DemoObserver } from "./DemoObserver";
import { relations } from "./relations";

export default function UseFocusableElementsDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="useFocusableElements"
        description="컨테이너 내의 포커스 가능한 요소들을 자동으로 찾고 추적하는 훅입니다. MutationObserver를 사용하여 DOM 변화를 실시간으로 감지할 수 있습니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root defaultValue="basic" mt="2">
        <Tabs.List>
          <Tabs.Trigger value="basic">기본 사용법</Tabs.Trigger>
          <Tabs.Trigger value="observer">DOM 변화 감지</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="basic">
            <DemoBasic />
          </Tabs.Content>
          <Tabs.Content value="observer">
            <DemoObserver />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
