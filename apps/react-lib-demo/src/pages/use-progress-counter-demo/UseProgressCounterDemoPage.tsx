import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { ProgressCounterAsyncContextProvider } from "@heart-re-up/react-lib/contexts/progress-counter-async";
import { Box, Tabs } from "@radix-ui/themes";
import DemoAsyncJobs from "./DemoAsyncJobs";
import DemoReactQueries from "./DemoReactQueries";
import { relations } from "./relations";

export default function UseProgressCounterDemoPage() {
  return (
    <Box>
      <DemoHeader
        title="useProgressCounter"
        description="동시 실행되는 비동기 작업들의 개수를 카운트하고, 현재 진행 중인 비동기 작업이 있는지 여부를 제공합니다."
      />

      <DemoRelationList relations={relations} />

      <Tabs.Root defaultValue="async-jobs" mt="2">
        <Tabs.List>
          <Tabs.Trigger value="async-jobs">비동기 작업</Tabs.Trigger>
          <Tabs.Trigger value="react-queries">React Query</Tabs.Trigger>
        </Tabs.List>

        <Box mt="2">
          <Tabs.Content value="async-jobs">
            <ProgressCounterAsyncContextProvider>
              <DemoAsyncJobs />
            </ProgressCounterAsyncContextProvider>
          </Tabs.Content>
          <Tabs.Content value="react-queries">
            <ProgressCounterAsyncContextProvider>
              <DemoReactQueries />
            </ProgressCounterAsyncContextProvider>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
