'use client';

import { useState, useEffect } from 'react';
import PostIt from '@/features/projectHome/components/PostIt';
import PostItModal from '@/features/projectHome/components/PostItModal';
import TextFieldModal from '@/features/projectHome/components/TextFieldModal';
import TextField from '@/features/projectHome/components/TextField';
import TeamMemberCard from '@/components/TeamMemberCard';
import AddTeamProfileModal from '@/features/projectHome/components/AddTeamProfileModal';
import ChangeLeaderModal from '@/features/projectHome/components/ChangeLeaderModal';
import Portal from '@/components/Portal';

interface PostItData {
  id: string;
  content: string;
  createdAt: number;
}

export default function ProjectHomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTextFieldModalOpen, setIsTextFieldModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isChangeLeaderModalOpen, setIsChangeLeaderModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [textFieldModalType, setTextFieldModalType] = useState<'goal' | 'rules'>('goal');
  const [postIts, setPostIts] = useState<PostItData[]>([]);
  const [teamGoal, setTeamGoal] = useState('');
  const [teamRules, setTeamRules] = useState('');
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: '김티미',
      university: '명지대학교',
      email: 'Hyunwoo@mju.ac.kr',
      role: '기획',
      duties: '담당 업무',
      isLeader: true,
    },
  ]);

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

  const handleAddTeamMember = () => {
    setIsAddTeamModalOpen(true);
  };

  const handleCloseAddTeamModal = () => {
    setIsAddTeamModalOpen(false);
  };

  const handleChangeLeader = (memberId: number) => {
    setSelectedMemberId(memberId);
    setIsChangeLeaderModalOpen(true);
  };

  const handleConfirmChangeLeader = () => {
    if (selectedMemberId) {
      setTeamMembers((prev) =>
        prev.map((member) => ({
          ...member,
          isLeader: member.id === selectedMemberId,
        }))
      );
    }
    setIsChangeLeaderModalOpen(false);
    setSelectedMemberId(null);
  };

  const handleCloseChangeLeaderModal = () => {
    setIsChangeLeaderModalOpen(false);
    setSelectedMemberId(null);
  };

  const handleUpdateTeamMember = (
    memberId: number,
    field: 'university' | 'role',
    value: string
  ) => {
    setTeamMembers((prev) =>
      prev.map((member) => (member.id === memberId ? { ...member, [field]: value } : member))
    );
  };

  const handleJoinProject = () => {
    // 로그인 사용자 정보 (실제로는 AuthContext에서 가져와야 함)
    const newMember = {
      id: Date.now(),
      name: '이름',
      university: '학교',
      email: 'new@example.com',
      role: '역할',
      duties: '담당 업무',
      isLeader: false,
    };

    setTeamMembers([...teamMembers, newMember]);
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
          <button
            className="w-[91px] h-[34px] px-[12px] py-[4px] text-white bg-[#81D7D4] rounded-[4px] font-bold cursor-pointer"
            onClick={handleAddTeamMember}
          >
            팀원 추가
          </button>
        </div>
        {/* 프로필 카드 */}
        <div className="grid grid-cols-4 gap-x-[52px] gap-y-[48px] mt-[24px]">
          {teamMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              name={member.name}
              university={member.university}
              email={member.email}
              role={member.role}
              isLeader={member.isLeader}
              onClick={() => !member.isLeader && handleChangeLeader(member.id)}
              onUpdate={(field, value) => handleUpdateTeamMember(member.id, field, value)}
            />
          ))}
        </div>
      </div>

      {isModalOpen && <PostItModal onClose={handleCloseModal} onSave={handleSavePostIt} />}

      {isTextFieldModalOpen && (
        <Portal>
          <TextFieldModal
            type={textFieldModalType}
            content={textFieldModalType === 'goal' ? teamGoal : teamRules}
            onClose={handleCloseTextFieldModal}
            onSave={handleSaveTextFieldModal}
          />
        </Portal>
      )}

      {isAddTeamModalOpen && (
        <Portal>
          <AddTeamProfileModal
            onClose={handleCloseAddTeamModal}
            projectName="프로젝트명"
            inviteCode="INVITE123"
            expiresAt="2024-12-31"
            onJoinClick={handleJoinProject}
          />
        </Portal>
      )}

      {isChangeLeaderModalOpen && (
        <Portal>
          <ChangeLeaderModal
            onClose={handleCloseChangeLeaderModal}
            onConfirm={handleConfirmChangeLeader}
            memberName={teamMembers.find((m) => m.id === selectedMemberId)?.name || ''}
          />
        </Portal>
      )}
    </div>
  );
}
