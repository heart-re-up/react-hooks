import { Separator } from "@radix-ui/themes";
import { menuRoutes } from "@/menu";
import HomeItemCard from "@/components/HomeItemCard";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          React Library Demo
        </h1>
        <p className="text-lg text-gray-600">
          @heart-re-up/react-lib 라이브러리의 다양한 기능을 체험해보세요.
        </p>
        <Separator className="bg-gray-200 h-[1px] my-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuRoutes.map((item) => (
          <HomeItemCard key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-12 p-6 bg-violet-50 rounded-lg border border-violet-200">
        <h2 className="text-2xl font-semibold text-violet-900 mb-4">
          시작하기
        </h2>
        <p className="text-violet-700 mb-4">
          왼쪽 사이드바에서 원하는 훅을 선택하거나 검색 기능을 사용해서 다양한
          훅들의 데모를 확인해보세요.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-violet-100 text-violet-800 text-sm rounded-full">
            TypeScript 지원
          </span>
          <span className="px-3 py-1 bg-violet-100 text-violet-800 text-sm rounded-full">
            테스트 완료
          </span>
          <span className="px-3 py-1 bg-violet-100 text-violet-800 text-sm rounded-full">
            트리 쉐이킹 최적화
          </span>
        </div>
      </div>
    </div>
  );
}
