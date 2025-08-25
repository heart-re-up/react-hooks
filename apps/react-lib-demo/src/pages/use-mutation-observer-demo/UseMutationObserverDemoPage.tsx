import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import { DemoAdvanced } from "./DemoAdvanced";
import { DemoBasic } from "./DemoBasic";
import { DemoDebounce } from "./DemoDebounce";
import { relations } from "./relations";

export default function UseMutationObserverDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="useMutationObserver"
        description="DOM 요소의 변화를 실시간으로 감지하는 훅입니다. MutationObserver API를 쉽게 사용할 수 있으며, 디바운스 기능으로 성능을 최적화할 수 있습니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root defaultValue="basic" mt="2">
        <Tabs.List>
          <Tabs.Trigger value="basic">기본 사용법</Tabs.Trigger>
          <Tabs.Trigger value="debounce">디바운스 최적화</Tabs.Trigger>
          <Tabs.Trigger value="advanced">고급 옵션</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="basic">
            <DemoBasic />
          </Tabs.Content>
          <Tabs.Content value="debounce">
            <DemoDebounce />
          </Tabs.Content>
          <Tabs.Content value="advanced">
            <DemoAdvanced />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
