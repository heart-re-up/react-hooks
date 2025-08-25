import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import DemoBasic from "./DemoBasic";
import DemoCustom from "./DemoCustom";
import DemoMultiple from "./DemoMultiple";
import { relations } from "./relations";

export default function UseCountdownDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="useCountdown"
        description="정확한 카운트다운 기능을 제공하는 훅입니다. 브라우저 탭 전환이나 백그라운드 실행 시에도 정확한 시간을 유지합니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root defaultValue="basic" mt="2">
        <Tabs.List>
          <Tabs.Trigger value="basic">기본 사용법</Tabs.Trigger>
          <Tabs.Trigger value="custom">커스텀 옵션</Tabs.Trigger>
          <Tabs.Trigger value="multiple">다중 카운트다운</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="basic">
            <DemoBasic />
          </Tabs.Content>
          <Tabs.Content value="custom">
            <DemoCustom />
          </Tabs.Content>
          <Tabs.Content value="multiple">
            <DemoMultiple />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
