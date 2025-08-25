import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import { ApiCallDemo } from "./ApiCallDemo";
import { BasicDebounceDemo } from "./BasicDebounceDemo";
import { relations } from "./relations";
import { SearchDemo } from "./SearchDemo";

export default function UseDebounceDemo() {
  return (
    <Box>
      <DemoHeader
        title="useDebounce"
        description="함수 호출을 지연시켜 성능을 최적화하는 훅입니다. 사용자 입력, API 호출 등에서 불필요한 호출을 방지할 수 있습니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root defaultValue="basic" mt="2">
        <Tabs.List>
          <Tabs.Trigger value="basic">기본 사용법</Tabs.Trigger>
          <Tabs.Trigger value="search">검색 입력</Tabs.Trigger>
          <Tabs.Trigger value="api">API 호출 최적화</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="basic">
            <BasicDebounceDemo />
          </Tabs.Content>
          <Tabs.Content value="search">
            <SearchDemo />
          </Tabs.Content>
          <Tabs.Content value="api">
            <ApiCallDemo />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
