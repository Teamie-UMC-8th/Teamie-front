import DayPicker from '@/components/DayPicker';

export default function ProjectHomePage() {
  return (
    <div className="flex flex-col items-center h-screen py-20">
      <h1 className="text-2xl font-bold mb-4">프로젝트 홈</h1>

      <div className="flex flex-row gap-8 mb-4">
        <h2 className="text-xl font-bold">게시판</h2>
        <h2 className="text-xl font-bold">업데이트</h2>
      </div>
      <div className="flex flex-row gap-8 mb-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-2">우리 팀의 목표</h2>
          <textarea
            className="w-160 h-40 p-3 border border-gray-300 rounded-lg resize-none"
            placeholder="우리팀의 목표를 작성해주세요..."
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-2">우리팀의 규칙</h2>
          <textarea
            className="w-160 h-40 p-3 border border-gray-300 rounded-lg resize-none"
            placeholder="우리팀의 규칙을 작성해주세요..."
          />
        </div>
      </div>ㅇ

        <h2 className="text-xl font-bold mb-2">팀원 프로필</h2>

      <p className="text-gray-600">이런 식으로 페이지를 작성하시면 됩니다!</p>

      <div className="mt-8">
        <DayPicker />
      </div>
    </div>
  );
}
