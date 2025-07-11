'use client';

import Link from 'next/link';

export default function CalendarPage() {
  return (
    <div>
      <div className="flex flex-col">
        <h1 className="text-black text-[24px]">마이페이지</h1>
        <hr className="border-[#E7E7E7] border-[1px] w-[1600px]" />
      </div>

      <main className="mt-[60px] ml-[40px] flex">
        {/* 나의 프로필 */}
        <div className="flex flex-col ">
          <h2 className="text-[22px]">나의 프로필</h2>
          <div
            className="bg-white w-[423px] h-[563px] mt-[40px] rounded-[12px]"
            style={{ boxShadow: '0px 0px 10px 0px #00000033' }}
          >
            <div className="flex flex-col items-center">
              <div className="relative">
                <img src="icons/myprofile.svg" alt="Profile" className="mt-[40px] mb-[12px]" />
                <button
                  className="absolute bottom-[25px] right-[12px] cursor-pointer"
                  onClick={() => alert('사진 추가')}
                >
                  <img src="icons/camera-icon.svg" alt="카메라 아이콘" />
                </button>
              </div>
              <div className="text-black text-[22px] mb-[40px]">김티미</div>
            </div>

            <div className="flex flex-col items-start ml-[60px]">
              <div className="flex mb-[32px]">
                <img src="icons/UnivName.svg" alt="University" className="mr-[12px]" />
                <div className="text-[18px] text-[#898989] mr-[12px]">학교:</div>
                <div className="text-black">명지대학교</div>
              </div>
              <div className="flex mb-[32px]">
                <img src="icons/major.svg" alt="major" className="mr-[12px]" />
                <div className="text-[18px] text-[#898989] mr-[12px]">전공:</div>
                <div className="text-black">컴퓨터공학</div>
              </div>
              <div className="flex mb-[32px]">
                <img src="icons/email.svg" alt="email" className="mr-[12px]" />
                <div className="text-[18px] text-[#898989] mr-[12px]">이메일</div>
                <div className="text-black">Hyunwoo@mju.ac.kr</div>
              </div>
              <div className="flex ">
                <img src="icons/ProjectCount.svg" alt="Project Count" className="mr-[12px]" />
                <div className="text-[18px] text-[#898989] mr-[12px]">팀 프로젝트 진행 횟수:</div>
                <div className="text-black">5</div>
              </div>
            </div>
            <button className="cursor-pointer">
              <img src="icons/Upgrade-pro.svg" alt="UpgradePro" className="mt-[40px] ml-[133px]" />
            </button>
          </div>
        </div>

        {/* 포트폴리오 */}
        <div className="flex flex-col ml-[143px]">
          <h2 className="text-[22px] mb-[40px]">포트폴리오</h2>
          <div
            className="bg-[#F8F8F8] w-[465px] h-[192px] rounded-[8px] grid justify-center"
            style={{ boxShadow: '0px 0px 4px 0px #00000033' }}
          >
            <div className="relative bg-white w-[439px] h-[48px] rounded-[4px] border-[1px] border-[#E7E7E7] flex flex-col justify-center mt-[12px]">
              <p className="absolute text-[18px] left-[12px]">프로젝트 명</p>
              <div className="absolute right-[8px] bg-[#BED9FB] w-[80px] h-[32px] rounded-[4px] flex items-center justify-center">
                <span>수업</span>
              </div>
            </div>

            <div className=" w-[439px] h-[96px]">
              <div className="flex mb-[12px]">
                <div className="text-[16px] text-[#898989] mr-[38px] ml-[12px]">기여도</div>
                <div className="text-[16px] text-black mr-[24px]">63%</div>
                <img src="icons/percent-bar.svg" alt="Percent Bar" />
              </div>
              <div className="flex mb-[12px]">
                <div className="text-[16px] text-[#898989] mr-[20px] ml-[12px]">진행 기간</div>
                <div className="text-[16px] text-black ">25.04~25.06</div>
              </div>
              <div className="flex">
                <div className="text-[16px] text-[#898989] mr-[20px] ml-[12px]">주요 업무</div>
                <div className="text-[16px] text-black ">자료조사</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
