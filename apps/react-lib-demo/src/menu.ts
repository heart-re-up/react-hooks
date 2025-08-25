const lazy = (path: string) => async () =>
  import(path).then((module) => module.default);

export type MenuRoute = {
  id: string;
  path: string;
  title: string;
  description?: string;
  component: () => Promise<
    | React.ComponentClass<object, unknown>
    | React.FunctionComponent<object>
    | (() => React.ReactNode)
    | null
    | undefined
  >;
};

export const menuRoutes: MenuRoute[] = [
  {
    id: "debounce",
    path: "/debounce",
    title: "useDebounce",
    description: "함수 호출을 지연시켜 성능을 최적화하는 훅",
    component: async () =>
      import("@/pages/use-debounce-demo/UseDebounceDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "toggle",
    path: "/toggle",
    title: "useToggle",
    description: "불린 상태를 쉽게 토글하는 훅",
    component: async () =>
      import("@/pages/use-toggle-demo/UseToggleDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "localStorage",
    path: "/localStorage",
    title: "useLocalStorage",
    description: "localStorage와 동기화되는 상태 관리 훅",
    component: async () =>
      import("@/pages/use-local-storage-demo/UseLocalStorageDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "progress-counter",
    path: "/progress-counter",
    title: "useProgressCounter",
    description: "비동기 작업 진행 상태를 관리하는 훅",
    component: async () =>
      import(
        "@/pages/use-progress-counter-demo/UseProgressCounterDemoPage"
      ).then((module) => module.default),
  },
  {
    id: "countdown",
    path: "/countdown",
    title: "useCountdown",
    description: "정확한 카운트다운 기능을 제공하는 훅",
    component: async () =>
      import("@/pages/use-countdown-demo/UseCountdownDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "copy-to-clipboard",
    path: "/copy-to-clipboard",
    title: "useCopyToClipboard",
    description: "클립보드에 다양한 데이터를 복사하는 훅",
    component: async () =>
      import(
        "@/pages/use-copy-to-clipboard-demo/UseCopyToClipboardDemoPage"
      ).then((module) => module.default),
  },
  {
    id: "download",
    path: "/download",
    title: "useDownload",
    description: "파일 다운로드 기능을 제공하는 훅",
    component: async () =>
      import("@/pages/use-download-demo/UseDownloadDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "event-listener",
    path: "/event-listener",
    title: "useEventListener",
    description: "DOM 이벤트를 쉽게 처리하는 훅",
    component: async () =>
      import("@/pages/use-event-listener-demo/UseEventListenerDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "focus",
    path: "/focus",
    title: "useFocus",
    description: "포커스 가능한 요소들 사이를 프로그래밍적으로 이동하는 훅",
    component: async () =>
      import("@/pages/use-focus-demo/UseFocusDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "focusable-elements",
    path: "/focusable-elements",
    title: "useFocusableElements",
    description:
      "컨테이너 내의 포커스 가능한 요소들을 자동으로 찾고 추적하는 훅",
    component: async () =>
      import(
        "@/pages/use-focusable-elements-demo/UseFocusableElementsDemoPage"
      ).then((module) => module.default),
  },
  {
    id: "focus-trap",
    path: "/focus-trap",
    title: "useFocusTrap",
    description: "특정 컨테이너 내에서 포커스를 가두어 접근성을 향상시키는 훅",
    component: async () =>
      import("@/pages/use-focus-trap-demo/UseFocusTrapDemoPage").then(
        (module) => module.default
      ),
  },
  {
    id: "mutation-observer",
    path: "/mutation-observer",
    title: "useMutationObserver",
    description: "DOM 요소의 변화를 실시간으로 감지하는 훅",
    component: async () =>
      import(
        "@/pages/use-mutation-observer-demo/UseMutationObserverDemoPage"
      ).then((module) => module.default),
  },
] as const;
