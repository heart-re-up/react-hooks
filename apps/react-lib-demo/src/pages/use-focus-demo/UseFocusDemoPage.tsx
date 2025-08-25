import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import { DemoBasic } from "./DemoBasic";
import { DemoKeyboard } from "./DemoKeyboard";
import { relations } from "./relations";

export default function UseFocusDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="useFocus"
        description="포커스 가능한 요소들 사이를 프로그래밍적으로 이동할 수 있는 훅입니다. 키보드 내비게이션, 접근성 향상, 사용자 경험 개선에 유용합니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root defaultValue="basic" mt="2">
        <Tabs.List>
          <Tabs.Trigger value="basic">기본 사용법</Tabs.Trigger>
          <Tabs.Trigger value="keyboard">키보드 내비게이션</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="basic">
            <DemoBasic />
          </Tabs.Content>
          <Tabs.Content value="keyboard">
            <DemoKeyboard />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
