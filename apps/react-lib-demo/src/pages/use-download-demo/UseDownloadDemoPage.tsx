import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import DemoText from "./DemoText";
import DemoImage from "./DemoImage";
import DemoData from "./DemoData";
import { relations } from "./relations";

export default function UseDownloadDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="useDownload"
        description="다양한 형태의 데이터를 파일로 다운로드할 수 있는 훅입니다. 텍스트, 이미지, JSON 등을 지원합니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root defaultValue="text" mt="2">
        <Tabs.List>
          <Tabs.Trigger value="text">텍스트 파일</Tabs.Trigger>
          <Tabs.Trigger value="image">이미지 파일</Tabs.Trigger>
          <Tabs.Trigger value="data">데이터 파일</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="text">
            <DemoText />
          </Tabs.Content>
          <Tabs.Content value="image">
            <DemoImage />
          </Tabs.Content>
          <Tabs.Content value="data">
            <DemoData />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
