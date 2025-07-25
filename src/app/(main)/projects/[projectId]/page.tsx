import DayPicker from '@/components/DayPicker';
import MemberCard from '@/components/MemberCard';

export default function ProjectHomePage() {
  return (
    <div className="flex flex-col h-screen py-20 px-8">
      <h1 className="text-[24px] font-bold mb-4">프로젝트 홈</h1>
      <hr className="w-full border-t mb-8" style={{ borderColor: '#E7E7E7' }} />
      <div className="flex flex-row gap-[29px] mb-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-2">게시판</h2>
          <div className="w-[920px] h-[344px] pl-[40px] pt-[40px] pr-4 pb-4 border border-[#BBBBBB] rounded-lg bg-white flex flex-col">
            <div className="flex flex-row gap-12 mb-6">
              {[...Array(5)].map((_, idx) => (
                <img
                  key={`postit-row1-${idx}`}
                  src="/icons/post-it.svg"
                  alt="Post-it Icon"
                  className="w-[120px] h-[120px]"
                />
              ))}
            </div>
            <div className="flex flex-row gap-12 ml-[20px]">
              {[...Array(5)].map((_, idx) => (
                <img
                  key={`postit-row2-${idx}`}
                  src="/icons/post-it.svg"
                  alt="Post-it Icon"
                  className="w-[120px] h-[120px]"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-2">업데이트</h2>
          <div className="w-[466px] h-[344px] p-4 border border-[#BBBBBB] rounded-lg bg-white">
            <p className="text-gray-600">업데이트 내용을 여기에 작성하세요.</p>
          </div>
        </div>
      </div>
      <div style={{ height: '132px' }} />
      <div className="flex flex-row gap-[42px] mb-12">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-2">우리 팀의 목표</h2>
          <textarea
            className="w-[688px] h-[232px] p-3 border border-[#BBBBBB] rounded-lg resize-none"
            placeholder="우리팀의 목표를 작성해주세요..."
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <h3 className="text-xl font-bold mb-2">우리팀의 규칙</h3>
            <h3 className="text-xl font-normal mb-2 text-gray-600/70">+ 전체보기</h3>
          </div>
          <textarea
            className="w-[688px] h-[232px] p-3 border border-[#BBBBBB] rounded-lg resize-none"
            placeholder="우리팀의 규칙을 작성해주세요..."
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-5">팀원 프로필</h2>
      <div className="flex flex-row gap-13 mb-8">
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
      </div>
    </div>
  );
}
