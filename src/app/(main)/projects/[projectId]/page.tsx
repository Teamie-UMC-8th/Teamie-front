'use client';

import { useParams } from 'next/navigation';
import PostIt from '@/features/projectHome/components/PostIt';
import PostItModal from '@/features/projectHome/components/PostItModal';
import TextFieldModal from '@/features/projectHome/components/TextFieldModal';
import TextField from '@/features/projectHome/components/TextField';
import TeamMemberCard from '@/components/TeamMemberCard';
import AddTeamProfileModal from '@/features/projectHome/components/AddTeamProfileModal';
import ChangeLeaderModal from '@/features/projectHome/components/ChangeLeaderModal';
import Portal from '@/components/Portal';
import { useProjectHomeState } from '@/hooks/mutations/useProjectHome';

export default function ProjectHomePage() {
  const params = useParams();
  const projectId = Number(params.projectId);

  const {
    // 상태
    projectHomeData,
    isLoading,
    error,
    isModalOpen,
    isTextFieldModalOpen,
    isAddTeamModalOpen,
    isChangeLeaderModalOpen,
    selectedMemberId,
    textFieldModalType,
    postIts,
    teamGoal,
    teamRules,
    teamMembers,
    // 핸들러
    handleBoardClick,
    handleCloseModal,
    handleSavePostIt,
    handleDeletePostIt,
    handleShowFullText,
    handleCloseTextFieldModal,
    handleSaveTextFieldModal,
    handleAddTeamMember,
    handleCloseAddTeamModal,
    handleChangeLeader,
    handleConfirmChangeLeader,
    handleCloseChangeLeaderModal,
    handleUpdateTeamMember,
    handleJoinProject,
    // 상태 설정 함수
    setTeamGoal,
    setTeamRules,
  } = useProjectHomeState(projectId);

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-red-500">프로젝트를 불러오는 중 오류가 발생했습니다.</div>
      </div>
    );
  }

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
                    key={`${postIt.id}-${index}`}
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
          onChange={(value) => {
            setTeamGoal(value);
            // API 호출하여 팀 목표 업데이트
          }}
          maxLength={300}
          showFullViewButton={teamGoal.length >= 222}
          onFullViewClick={() => handleShowFullText('goal')}
        />
        <TextField
          title="우리 팀의 규칙"
          placeholder="우리 팀의 규칙을 작성하세요"
          value={teamRules}
          onChange={(value) => {
            setTeamRules(value);
            // API 호출하여 팀 규칙 업데이트
          }}
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
