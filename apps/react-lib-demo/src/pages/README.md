# 데모 페이지 작성 가이드

## 기본사항

- 데모 기능마다 별도 디렉토리에서 가이드 페이지를 작성한다.
- 여러가지 데모 기능을 구현할 때는 탭으로 구분한다.

## 디렉토리 구조

각 훅의 데모는 다음과 같은 구조로 구성한다:

```
src/pages/use-[hook-name]-demo/
├── [HookName]DemoPage.tsx      # 메인 데모 페이지 (탭 구성)
├── DemoBasic.tsx               # 기본 사용법 데모
├── Demo[Feature1].tsx          # 특정 기능 데모 1
├── Demo[Feature2].tsx          # 특정 기능 데모 2
└── relations.ts                # 관련 항목 정의
```

### 파일 명명 규칙

- **메인 데모 파일**: `[HookName]DemoPage.tsx` (예: `UseDebounceDemoPage.tsx`, `UseCountdownDemoPage.tsx`)
- **개별 데모 파일**: `Demo[기능명].tsx` (예: `DemoBasic.tsx`, `DemoApiCall.tsx`, `DemoSearch.tsx`)
- **관련 항목 파일**: `relations.ts`

> 참고: 메인 데모 페이지는 `DemoPage` 접미사를 사용하고, 개별 탭 데모는 `Demo` 접두사로 시작합니다. 이렇게 하면 기능별로 명확히 구분되고 파일 정렬도 깔끔해집니다.

이렇게 하면 파일 탐색기에서 관련 파일들이 함께 정렬되어 관리하기 쉬워집니다.

## 페이지 패턴

### 메인 데모 페이지 구성

메인 데모 페이지는 다음 요소들로 구성된다:

1. **DemoHeader**: 훅의 제목과 설명을 표시
2. **DemoRelationList**: 관련 항목들을 표시 (relations.ts에서 가져옴)
3. **Tabs**: 여러 데모를 탭으로 구분하여 표시

### 개별 데모 컴포넌트

각 탭의 데모 컴포넌트는 다음과 같이 구성한다:

- **기본 사용법 데모**: 훅의 가장 기본적인 사용 방법을 보여줌
- **실용적인 예제 데모**: 실제 사용 사례를 기반으로 한 데모 (검색, API 호출 등)
- **고급 기능 데모**: 훅의 고급 기능이나 옵션을 활용한 데모

다음은 데모 페이지 구현의 예제이다.

```tsx
import DemoHeader from "@/components/DemoHeader";
import DemoRelationList from "@/components/DemoRelationList";
import { Box, Tabs } from "@radix-ui/themes";
import { DemoApiCall } from "./DemoApiCall";
import { DemoBasic } from "./DemoBasic";
import { DemoSearch } from "./DemoSearch";
import { relations } from "./relations";

export default function UseDebounceDemoPage() {
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
            <DemoBasic />
          </Tabs.Content>
          <Tabs.Content value="search">
            <DemoSearch />
          </Tabs.Content>
          <Tabs.Content value="api">
            <DemoApiCall />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
```

## relations 파일

### 목적

`relations.ts` 파일은 데모에서 소개하려는 기능과 관련된 항목들을 정의한다. 이를 통해 사용자가 관련된 다른 훅, 컴포넌트, 컨텍스트 등을 쉽게 찾을 수 있다.

### 구성 방법

- **type**: 항목의 유형 (`"hook"`, `"component"`, `"context(provider/hook)"` 등)
- **name**: 항목의 이름
- **description**: 항목의 경로나 설명

### 작성 가이드

1. **주요 훅**: 데모에서 다루는 메인 훅을 반드시 포함
2. **관련 훅**: 함께 사용되거나 유사한 기능을 하는 다른 훅들
3. **관련 컴포넌트**: 해당 훅과 함께 사용되는 컴포넌트가 있다면 포함
4. **컨텍스트**: 전역 상태나 프로바이더가 관련되어 있다면 포함

다음은 관련 항목 구성의 예제이다.

```ts
import { DemoRelationProps } from "@/components/DemoRelation";

export const relations: DemoRelationProps[] = [
  {
    type: "hook",
    name: "useDebounce",
    description: "@heart-re-up/react-lib/hooks/useDebounce",
  },
  {
    type: "component",
    name: "DebouncedItem",
    description: "@heart-re-up/react-lib/hooks/DebouncedItem",
  },
  {
    type: "context(provider/hook)",
    name: "GlobalDebounceContextProvider",
    description:
      "@heart-re-up/react-lib/contexts/GlobalDebounceContextProvider",
  },
];
```

## 데모 작성 가이드라인

### UI/UX 원칙

1. **직관적인 인터페이스**: 사용자가 쉽게 이해할 수 있는 UI 구성
2. **실시간 피드백**: 훅의 동작을 시각적으로 확인할 수 있는 요소 포함
3. **상태 표시**: 현재 상태, 호출 횟수, 시간 등을 명확히 표시
4. **초기화 기능**: 데모를 처음 상태로 되돌릴 수 있는 기능 제공

### 코드 구성

1. **명확한 변수명**: 데모의 목적에 맞는 의미있는 변수명 사용
2. **주석 활용**: 복잡한 로직에는 한글 주석으로 설명 추가
3. **에러 처리**: API 호출 등에서 적절한 에러 처리 구현
4. **성능 고려**: 불필요한 리렌더링 방지

### 설명 및 안내

1. **기능 설명**: 각 데모 상단에 해당 기능에 대한 간단한 설명 추가
2. **사용 팁**: 데모 하단에 실제 사용 시 도움이 되는 팁 제공
3. **효과 강조**: 훅 사용의 장점과 효과를 구체적으로 설명
4. **실제 사례**: 실무에서 활용할 수 있는 예시 제공

### 스타일링

1. **Tailwind CSS 활용**: 일관된 스타일링을 위해 Tailwind 클래스 사용
2. **색상 구분**: 각 상태나 기능별로 구분되는 색상 사용
3. **반응형 디자인**: 모바일과 데스크톱에서 모두 잘 보이도록 구성
4. **접근성 고려**: 적절한 대비와 포커스 상태 제공

## Demo 작성시 Radix-ui/themes 이용 가이드

### Flex 박스가 필요한 경우 `Flex` 컴포넌트를 이용한다.

```tsx
<Flex flexGrow="1">
  <>...</>
</Flex>
```
