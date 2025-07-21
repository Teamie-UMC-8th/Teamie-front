'use client';

import Link from 'next/link';
import useToggle from '@/features/mypage/hooks/useToggle';
import Tailored from '@/features/mypage/components/Tailored';
import ToggleButton from '@/components/ToggleButton';
import { useState } from 'react';
import Projects from '@/features/mypage/components/Projects';

export default function MyPage() {
  const { selected, setSelected } = useToggle();
  // Pro로 업그레이드 시에 만 토글이 보이도록 설정
  const [showToggle, setShowToggle] = useState(false);

  return (
    <div>
      {/* TODO: Pro로 업그레이드 시에 Navbar에 Credit 충전으로 변경 */}
      <div
        className="flex flex-col ml-[2.5rem]
      max-lg:ml-[0rem]"
      >
        <h1 className="text-black text-[1.5rem] ml-[0.5rem] font-semibold">마이페이지</h1>
        <hr className="border-[#E7E7E7] border-[1px] w-[100rem] mt-[0.5rem]" />
      </div>

      <main
        className="mt-[3.75rem] ml-[5rem] flex
      max-lg:ml-[3.4375rem] max-lg:flex-col"
      >
        {/* 나의 프로필 */}
        <div className="flex flex-col">
          <h2 className="text-[1.375rem] font-bold">나의 프로필</h2>
          <div
            className="bg-white w-[423px] h-[599px] mt-[2.5rem] rounded-[0.75rem]
            max-lg:ml-[6.25rem] max-lg:w-[668px] max-lg:h-[331px] max-lg:flex"
            style={{ boxShadow: '0px 0px 10px 0px #00000033' }}
          >
            <div
              className="flex flex-col items-center
            max-lg:mr-[0rem]"
            >
              <div className="relative">
                <img
                  src="icons/myprofile.svg"
                  alt="Profile"
                  className="mt-[2.5rem] mb-[0.25rem] w-[7.8125rem] h-[7.8125rem]
                  max-lg:ml-[3.75rem] max-lg:mt-[3.75rem]"
                />
                <button
                  className="absolute bottom-[0.75rem] right-[0.625rem] cursor-pointer"
                  onClick={() => alert('사진 추가')}
                >
                  <img src="icons/camera-icon.svg" alt="카메라 아이콘" />
                </button>
              </div>
              <div
                className="text-black text-[1.375rem] font-semibold mb-[2.25rem]
              max-lg:ml-[6.25rem] max-lg:w-[6.25rem]"
              >
                김티미
              </div>
            </div>

            {/* 1024이하에서만 보이는 vertical line */}
            <div className="hidden max-lg:block border-l border-[#E7E7E7] border-[1px] h-[251px] ml-[3.125rem] mt-[2.5rem]" />

            <div
              className="flex flex-col items-start ml-[3.75rem] text-[1.125rem]
            max-lg:mt-[4.625rem] "
            >
              <div
                className="flex mb-[1.75rem]
              max-lg:mb-[1.5rem] max-lg:w-[18.75rem]"
              >
                <img src="icons/UnivName.svg" alt="University" className="mr-[0.75rem]" />
                <div className="text-[#898989] mr-[0.75rem]">학교:</div>
                <div className="text-black">명지대학교</div>
              </div>
              <div
                className="flex mb-[1.75rem]
              max-lg:mb-[1.5rem]"
              >
                <img src="icons/major.svg" alt="major" className="mr-[0.75rem]" />
                <div className="text-[#898989] mr-[0.75rem]">전공:</div>
                <div className="text-black">컴퓨터공학</div>
              </div>
              <div
                className="flex mb-[1.75rem]
              max-lg:mb-[1.5rem]"
              >
                <img src="icons/email.svg" alt="email" className="mr-[0.75rem]" />
                <div className="text-[#898989] mr-[0.75rem]">이메일:</div>
                <div className="text-black">Hyunwoo@mju.ac.kr</div>
              </div>
              <div className="flex mb-[2.25rem]">
                <img src="icons/ProjectCount.svg" alt="Project Count" className="mr-[0.75rem]" />
                <div className="text-[#898989] mr-[0.75rem]">팀 프로젝트 진행 횟수:</div>
                <div className="text-black">5</div>
              </div>
            </div>
            <button className="cursor-pointer" onClick={() => setShowToggle(true)}>
              {!showToggle && (
                <img
                  src="icons/Upgrade-pro.svg"
                  alt="UpgradePro"
                  className="mt-[2.5rem] ml-[133px]
                  max-lg:translate-x-[-42.5rem] max-lg:translate-y-[3.75rem]"
                />
              )}
              {showToggle && (
                <div
                  className="flex flex-col
                max-lg:translate-x-[-43.125rem] max-lg:translate-y-[4.375rem]"
                >
                  <img
                    src="icons/AddCredit.svg"
                    alt="Credit 충전"
                    className="w-[7rem] h-[2.125rem] ml-[9.75rem] max-lg:hidden"
                  />
                  <div
                    className="mt-[0.75rem] flex ml-[7.625rem]
                  max-lg:w-[12.5rem]"
                  >
                    <div className="text-[1rem] text-black ml-[1.25rem]">잔여 Credit:</div>
                    <img src="icons/AiIcon.svg" alt="AiIcon" className="ml-[0.5rem] mr-[0.25rem]" />
                    <div className="text-black text-[1rem]">100</div>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* 포트폴리오 */}
        <div
          className="flex flex-col ml-[143px]
        max-lg:ml-[0rem] max-lg:mt-[5rem]"
        >
          <div className="flex justify-between items-center ">
            <h2 className="text-[1.375rem] mb-[2.5rem] font-bold">포트폴리오</h2>
            <div className="flex items-center ">
              {/* AI 첨삭일 때만 + 버튼 표시 */}
              {showToggle && selected === 'ai' && (
                <img
                  src="icons/AddProject.svg"
                  alt="프로젝트 추가"
                  className="w-[2.375rem] h-[2.375rem] mt-[3px] mr-[0.625rem] cursor-pointer translate-y-[-1rem]
                  max-lg:translate-x-[-3.625rem] "
                />
              )}
              <div
                className="translate-y-[-1.625rem]
              max-lg:translate-x-[-3.625rem]"
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
