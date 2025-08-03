'use client';

import { useState, useEffect } from 'react';
import PostIt from '@/features/projectHome/components/PostIt';
import PostItModal from '@/features/projectHome/components/PostItModal';
import TextFieldModal from '@/features/projectHome/components/TextFieldModal';
import TextField from '@/features/projectHome/components/TextField';
import Portal from '@/components/Portal';

interface PostItData {
  id: string;
  content: string;
  createdAt: number;
}

export default function ProjectHomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTextFieldModalOpen, setIsTextFieldModalOpen] = useState(false);
  const [textFieldModalType, setTextFieldModalType] = useState<'goal' | 'rules'>('goal');
  const [postIts, setPostIts] = useState<PostItData[]>([]);
  const [teamGoal, setTeamGoal] = useState('');
  const [teamRules, setTeamRules] = useState('');

  // 48시간 후 자동 삭제 체크
  useEffect(() => {
    const checkExpiredPostIts = () => {
      const now = Date.now();
      const fortyEightHours = 48 * 60 * 60 * 1000; // 48시간을 밀리초로

      setPostIts((prevPostIts) =>
        prevPostIts.filter((postIt) => {
          const timeElapsed = now - postIt.createdAt;
          return timeElapsed < fortyEightHours;
        })
      );
    };

    // 초기 체크
    checkExpiredPostIts();

    // 1분마다 체크
    const interval = setInterval(checkExpiredPostIts, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleBoardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSavePostIt = (content: string) => {
    const newPostIt: PostItData = {
      id: Date.now().toString(),
      content: content,
      createdAt: Date.now(),
    };
    setPostIts([...postIts, newPostIt]);
    setIsModalOpen(false);
  };

  const handleDeletePostIt = (id: string) => {
    setPostIts(postIts.filter((postIt) => postIt.id !== id));
  };

  const handleShowFullText = (type: 'goal' | 'rules') => {
    setTextFieldModalType(type);
    setIsTextFieldModalOpen(true);
  };

  const handleCloseTextFieldModal = () => {
    setIsTextFieldModalOpen(false);
  };

  const handleSaveTextFieldModal = (content: string) => {
    if (textFieldModalType === 'goal') {
      setTeamGoal(content);
    } else {
      setTeamRules(content);
    }
  };

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
            className="w-[1415px] h-[344px] border-[2px] border-[#BBBBBB] mt-[24px] rounded-[8px] px-[48px] py-[36px] gap-x-[48px] gap-y-[32px] relative cursor-pointer
          max-lg:w-[862px] max-lg:h-[344px]"
            onClick={handleBoardClick}
          >
            <div className="relative w-full h-full">
              {postIts.map((postIt, index) => {
                const row = Math.floor(index / 8);
                const col = index % 8;
                const leftOffset = row === 1 ? 32 : 0;

                return (
                  <div
                    key={postIt.id}
                    className="absolute"
                    style={{
                      left: `${leftOffset + col * (120 + 46)}px`,
                      top: `${row * (120 + 32)}px`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <PostIt
                      content={postIt.content}
                      onDelete={() => handleDeletePostIt(postIt.id)}
                      createdAt={postIt.createdAt}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* 팀 목표, 규칙 */}
      <div
        className="flex mt-[80px] gap-[42px]
      max-lg:flex-col max-lg:ml-[24px]"
      >
        <TextField
          title="우리 팀의 목표"
          placeholder="우리 팀의 목표를 작성하세요"
          value={teamGoal}
          onChange={setTeamGoal}
          maxLength={300}
          showFullViewButton={teamGoal.length >= 222}
          onFullViewClick={() => handleShowFullText('goal')}
        />
        <TextField
          title="우리 팀의 규칙"
          placeholder="우리 팀의 규칙을 작성하세요"
          value={teamRules}
          onChange={setTeamRules}
          maxLength={300}
          showFullViewButton={teamRules.length >= 222}
          onFullViewClick={() => handleShowFullText('rules')}
        />
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

      {isModalOpen && <PostItModal onClose={handleCloseModal} onSave={handleSavePostIt} />}

      {isTextFieldModalOpen && (
        <TextFieldModal
          type={textFieldModalType}
          content={textFieldModalType === 'goal' ? teamGoal : teamRules}
          onClose={handleCloseTextFieldModal}
          onSave={handleSaveTextFieldModal}
        />
      )}
    </div>
  );
}
