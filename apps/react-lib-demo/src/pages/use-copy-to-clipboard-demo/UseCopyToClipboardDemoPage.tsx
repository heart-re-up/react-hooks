import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import DemoBasic from "./DemoBasic";
import DemoAdvanced from "./DemoAdvanced";
import DemoImage from "./DemoImage";
import { relations } from "./relations";

export default function UseCopyToClipboardDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="useCopyToClipboard"
        description="다양한 형태의 데이터를 클립보드에 복사할 수 있는 훅입니다. 텍스트, 이미지, HTML 등을 지원합니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root defaultValue="basic" mt="2">
        <Tabs.List>
          <Tabs.Trigger value="basic">기본 사용법</Tabs.Trigger>
          <Tabs.Trigger value="advanced">고급 기능</Tabs.Trigger>
          <Tabs.Trigger value="image">이미지 복사</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="basic">
            <DemoBasic />
          </Tabs.Content>
          <Tabs.Content value="advanced">
            <DemoAdvanced />
          </Tabs.Content>
          <Tabs.Content value="image">
            <DemoImage />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
