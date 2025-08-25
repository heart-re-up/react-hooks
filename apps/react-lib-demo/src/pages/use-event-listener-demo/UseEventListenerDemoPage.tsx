import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import DemoGlobal from "./DemoGlobal";
import DemoElement from "./DemoElement";
import DemoCustom from "./DemoCustom";
import { relations } from "./relations";

export default function UseEventListenerDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="useEventListener"
        description="다양한 DOM 요소와 글로벌 이벤트를 쉽게 처리할 수 있는 훅입니다. 자동으로 이벤트 리스너를 등록하고 정리합니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root defaultValue="global" mt="2">
        <Tabs.List>
          <Tabs.Trigger value="global">글로벌 이벤트</Tabs.Trigger>
          <Tabs.Trigger value="element">요소 이벤트</Tabs.Trigger>
          <Tabs.Trigger value="custom">커스텀 이벤트</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="global">
            <DemoGlobal />
          </Tabs.Content>
          <Tabs.Content value="element">
            <DemoElement />
          </Tabs.Content>
          <Tabs.Content value="custom">
            <DemoCustom />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
