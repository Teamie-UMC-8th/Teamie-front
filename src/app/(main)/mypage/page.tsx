'use client';

import Link from 'next/link';
import useToggle from '@/features/portfolios/hooks/useToggle';
import Tailored from '@/features/portfolios/Tailored';
import ToggleButton from '@/components/ToggleButton';
import Projects from '@/features/portfolios/Projects';
import { useState } from 'react';

export default function MyPage() {
  const { selected, setSelected } = useToggle();
  // Pro로 업그레이드 시에 만 토글이 보이도록 설정
  const [showToggle, setShowToggle] = useState(false);

  return (
    <div>
      {/* TODO: Pro로 업그레이드 시에 Navbar에 Credit 충전으로 변경 */}
      <div
        className="flex flex-col ml-[2.5rem]
      max-lg:ml-[-96px]"
      >
        <h1 className="text-black text-[24px] ml-[0.5rem]">마이페이지</h1>
        <hr className="border-[#E7E7E7] border-[1px] w-[1600px] mt-[0.5rem]" />
      </div>

      <main
        className="mt-[60px] ml-[5rem] flex
      max-lg:ml-[-40px] max-lg:flex-col"
      >
        {/* 나의 프로필 */}
        <div className="flex flex-col">
          <h2 className="text-[22px] font-bold">나의 프로필</h2>
          <div
            className="bg-white w-[423px] h-[599px] mt-[40px] rounded-[12px]
            max-lg:ml-[100px] max-lg:w-[668px] max-lg:h-[331px] max-lg:flex"
            style={{ boxShadow: '0px 0px 10px 0px #00000033' }}
          >
            <div
              className="flex flex-col items-center
            max-lg:mr-[0px]"
            >
              <div className="relative">
                <img
                  src="icons/myprofile.svg"
                  alt="Profile"
                  className="mt-[40px] mb-[4px] w-[125px] h-[125px]
                  max-lg:ml-[60px] max-lg:mt-[60px]"
                />
                <button
                  className="absolute bottom-[12px] right-[10px] cursor-pointer"
                  onClick={() => alert('사진 추가')}
                >
                  <img src="icons/camera-icon.svg" alt="카메라 아이콘" />
                </button>
              </div>
              <div
                className="text-black text-[22px] font-semibold mb-[36px]
              max-lg:ml-[100px] max-lg:w-[100px]"
              >
                김티미
              </div>
            </div>

            {/* 1024이하에서만 보이는 vertical line */}
            <div className="hidden max-lg:block border-l border-[#E7E7E7] border-[1px] h-[251px] ml-[50px] mt-[40px]" />

            <div
              className="flex flex-col items-start ml-[60px] text-[18px]
            max-lg:mt-[74px] "
            >
              <div
                className="flex mb-[28px]
              max-lg:mb-[24px] max-lg:w-[300px]"
              >
                <img src="icons/UnivName.svg" alt="University" className="mr-[12px]" />
                <div className="text-[#898989] mr-[12px]">학교:</div>
                <div className="text-black">명지대학교</div>
              </div>
              <div
                className="flex mb-[28px]
              max-lg:mb-[24px]"
              >
                <img src="icons/major.svg" alt="major" className="mr-[12px]" />
                <div className="text-[#898989] mr-[12px]">전공:</div>
                <div className="text-black">컴퓨터공학</div>
              </div>
              <div
                className="flex mb-[28px]
              max-lg:mb-[24px]"
              >
                <img src="icons/email.svg" alt="email" className="mr-[12px]" />
                <div className="text-[#898989] mr-[12px]">이메일:</div>
                <div className="text-black">Hyunwoo@mju.ac.kr</div>
              </div>
              <div className="flex mb-[36px]">
                <img src="icons/ProjectCount.svg" alt="Project Count" className="mr-[12px]" />
                <div className="text-[#898989] mr-[12px]">팀 프로젝트 진행 횟수:</div>
                <div className="text-black">5</div>
              </div>
            </div>
            <button className="cursor-pointer" onClick={() => setShowToggle(true)}>
              {!showToggle && (
                <img
                  src="icons/Upgrade-pro.svg"
                  alt="UpgradePro"
                  className="mt-[40px] ml-[133px]
                  max-lg:translate-x-[-680px] max-lg:translate-y-[60px]"
                />
              )}
              {showToggle && (
                <div
                  className="flex flex-col
                max-lg:translate-x-[-690px] max-lg:translate-y-[70px]"
                >
                  <img
                    src="icons/AddCredit.svg"
                    alt="Credit 충전"
                    className="w-[112px] h-[34px] ml-[156px] max-lg:hidden"
                  />
                  <div
                    className="mt-[12px] flex ml-[122px]
                  max-lg:w-[200px]"
                  >
                    <div className="text-[16px] text-black">나의 잔여 Credit:</div>
                    <img src="icons/AiIcon.svg" alt="AiIcon" className="ml-[8px] mr-[4px]" />
                    <div className="text-black text-[16px]">100</div>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* 포트폴리오 */}
        <div
          className="flex flex-col ml-[143px]
        max-lg:ml-[0px] max-lg:mt-[80px]"
        >
          <div className="flex justify-between items-center ">
            <h2 className="text-[22px] mb-[40px] font-bold">포트폴리오</h2>
            <div className="flex items-center ">
              {/* AI 첨삭일 때만 + 버튼 표시 */}
              {showToggle && selected === 'ai' && (
                <img
                  src="icons/AddProject.svg"
                  alt="프로젝트 추가"
                  className="w-[38px] h-[38px] mt-[3px] mr-[10px] cursor-pointer translate-y-[-18px]
                  max-lg:translate-x-[-1106px] max-lg:translate-y-[32px]"
                />
              )}
              <div
                className="translate-y-[-26px]
              max-lg:translate-x-[-1356px] max-lg:translate-y-[22px]"
              >
                {showToggle && (
                  <ToggleButton
                    leftLabel="프로젝트"
                    rightLabel="AI 첨삭"
                    onToggle={(isLeft) => setSelected(isLeft ? 'project' : 'ai')}
                  />
                )}
              </div>
            </div>
          </div>

          {selected === 'project' && <Projects />}
          {selected === 'ai' && <Tailored />}
        </div>
      </main>
    </div>
  );
}
