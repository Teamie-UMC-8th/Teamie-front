'use client';

import Link from 'next/link';
import useToggle from '@/features/portfolios/hooks/useToggle';
import Tailored from '@/features/portfolios/Tailored';
import ToggleButton from '@/components/ToggleButton';
import Projects from '@/features/portfolios/Projects';

export default function MyPage() {
  const { selected, setSelected } = useToggle();

  return (
    <div>
      <div className="flex flex-col ml-[2.5rem]">
        <h1 className="text-black text-[24px] ml-[0.5rem]">마이페이지</h1>
        <hr className="border-[#E7E7E7] border-[1px] w-[1600px] mt-[0.5rem]" />
      </div>

      <main className="mt-[60px] ml-[5rem] flex">
        {/* 나의 프로필 */}
        <div className="flex flex-col ">
          <h2 className="text-[22px]">나의 프로필</h2>
          <div
            className="bg-white w-[423px] h-[563px] mt-[40px] rounded-[12px]"
            style={{ boxShadow: '0px 0px 10px 0px #00000033' }}
          >
            <div className="flex flex-col items-center">
              <div className="relative">
                <img src="icons/myprofile.svg" alt="Profile" className="mt-[40px] mb-[4px]" />
                <button
                  className="absolute bottom-[12px] right-[10px] cursor-pointer"
                  onClick={() => alert('사진 추가')}
                >
                  <img src="icons/camera-icon.svg" alt="카메라 아이콘" />
                </button>
              </div>
              <div className="text-black text-[22px] font-semibold mb-[36px]">김티미</div>
            </div>

            <div className="flex flex-col items-start ml-[60px] text-[18px]">
              <div className="flex mb-[28px]">
                <img src="icons/UnivName.svg" alt="University" className="mr-[12px]" />
                <div className="text-[#898989] mr-[12px]">학교:</div>
                <div className="text-black">명지대학교</div>
              </div>
              <div className="flex mb-[28px]">
                <img src="icons/major.svg" alt="major" className="mr-[12px]" />
                <div className="text-[#898989] mr-[12px]">전공:</div>
                <div className="text-black">컴퓨터공학</div>
              </div>
              <div className="flex mb-[28px]">
                <img src="icons/email.svg" alt="email" className="mr-[12px]" />
                <div className="text-[#898989] mr-[12px]">이메일:</div>
                <div className="text-black">Hyunwoo@mju.ac.kr</div>
              </div>
              <div className="flex ">
                <img src="icons/ProjectCount.svg" alt="Project Count" className="mr-[12px]" />
                <div className="text-[#898989] mr-[12px]">팀 프로젝트 진행 횟수:</div>
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
          <div className="flex justify-between items-center ">
            <h2 className="text-[22px] mb-[40px]">포트폴리오</h2>
            <div className="flex items-center">
              <img
                src="icons/AddProject.svg"
                alt="프로젝트 추가"
                className="w-[38px] h-[38px] mt-[3px] mr-[10px] cursor-pointer translate-y-[-18px]"
              />
              <div className="translate-y-[-26px] ">
                <ToggleButton
                  leftLabel="프로젝트"
                  rightLabel="AI 첨삭"
                  onToggle={(isLeft) => setSelected(isLeft ? 'project' : 'ai')}
                />
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
