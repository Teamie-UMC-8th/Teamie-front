import DayPicker from '@/components/DayPicker';

export default function ProjectHomePage() {
  return (
    <div>
      {/* 헤더 */}
      <div className="flex flex-col">
        <h1 className="text-[24px] text-black font-bold ml-[8px]">프로젝트 홈</h1>
        <hr className="border border-[#E7E7E7] mt-[12px]" />
      </div>
      {/* 게시판, 업데이트 */}
      <div
        className="flex mt-[68px] gap-[29px]
      max-lg:ml-[24px] max-lg:flex-col"
      >
        <div className="flex-col">
          <p className="text-[22px] font-semibold">게시판</p>
          <div
            className="w-[920px] h-[344px] border-[2px] border-[#BBBBBB] mt-[24px] rounded-[8px] px-[48px] py-[36px] gap-x-[48px] gap-y-[32px]
          max-lg:w-[862px] max-lg:h-[344px]"
          >
            <img src="/icons/Post-it.svg" alt="게시판 포스트잇" className="relative" />
          </div>
        </div>
        <div className="flex-col">
          <p className="text-[22px] font-semibold">업데이트</p>
          <div
            className="w-[466px] h-[344px] border-[2px] border-[#BBBBBB] mt-[24px] rounded-[8px]
          max-lg:w-[862px] max-lg:h-[266px]"
          ></div>
        </div>
      </div>
      {/* 팀 목표, 규칙 */}
      <div
        className="flex mt-[80px] gap-[42px]
      max-lg:flex-col max-lg:ml-[24px]"
      >
        <div>
          <p className="text-[22px] font-semibold">우리 팀의 목표</p>
          <textarea
            className="w-[688px] h-[232px] border-[2px] border-[#BBBBBB] rounded-[8px] text-[20px] px-[32px] py-[20px] mt-[24px]
            max-lg:w-[862px] max-lg:h-[220px]"
            placeholder="우리 팀의 목표를 작성하세요"
          />
        </div>
        <div>
          <div
            className="flex justify-between
          max-lg:w-[860px]"
          >
            <p className="text-[22px] font-semibold">우리 팀의 규칙</p>
            <button className="text-[18px] text-[#898989] cursor-pointer">+ 전체보기</button>
          </div>
          <textarea
            className="w-[688px] h-[232px] border-[2px] border-[#BBBBBB] rounded-[8px] text-[20px] px-[32px] py-[20px] mt-[24px]
            max-lg:w-[862px] max-lg:h-[220px]"
            placeholder="우리 팀의 규칙을 작성하세요"
          />
        </div>
      </div>
      {/* 팀원 프로필 */}
      <div
        className="mt-[82px] w-[1416px]
      max-lg:ml-[24px]"
      >
        <div
          className="flex justify-between items-center
        max-lg:w-[860px] max-lg:mt-[70px]"
        >
          <p className="font-semibold text-[22px]">팀원 프로필</p>
          <button className="w-[91px] h-[34px] px-[12px] py-[4px] text-white bg-[#81D7D4] rounded-[4px] font-bold cursor-pointer">
            팀원 추가
          </button>
        </div>
        {/* 프로필 카드 */}
        <div
          className="w-[315px] h-[409px] rounded-[12px] bg-white mt-[24px] flex-col py-[36px] px-[40px]
          max-lg:ml-[142px] max-lg:w-[580px] max-lg:h-[241px]"
          style={{ boxShadow: '0px 0px 10px 0px #00000033' }}
        >
          <div className="max-lg:flex">
            <div>
              <img
                src="/icons/myprofile.svg"
                alt="Profile"
                className="w-[125px] h-[125px] ml-[55px]
          max-lg:ml-[20px]"
              />

              <div
                className="flex items-center ml-[73px]
          max-lg:ml-[38px]"
              >
                <img src="/icons/Leader-Icon.svg" alt="리더 아이콘" />
                <div className="font-semibold text-[22px] ml-[8px]">김티미</div>
              </div>
            </div>
            <div
              className="w-[235px] h-[248px] flex-col mt-[18px]
            max-lg:mt-0 max-lg:ml-[80px]"
            >
              <div className="flex items-center py-[6px]">
                <img src="/icons/UnivName.svg" alt="University" className="mr-[0.75rem]" />
                <div className="text-black text-[18px]">명지대학교</div>
              </div>
              <div className="flex items-center py-[6px]">
                <img src="/icons/email.svg" alt="email" className="mr-[0.75rem]" />
                <div className="text-black text-[18px]">Hyunwoo@mju.ac.kr</div>
              </div>
              <div className="flex items-center py-[6px]">
                <img src="/icons/PlanIcon.svg" alt="기획" className="mr-[0.75rem]" />
                <div className="text-black text-[18px]">기획</div>
              </div>
              <div className="flex items-center py-[6px]">
                <img src="/icons/Duties.svg" alt="담당 업무" className="mr-[0.75rem]" />
                <div className="text-black text-[18px]">담당 업무</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
