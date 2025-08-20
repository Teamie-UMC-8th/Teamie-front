'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import PostIt from '@/features/projectHome/components/PostIt';
import PostItModal from '@/features/projectHome/components/PostItModal';
import TextFieldModal from '@/features/projectHome/components/TextFieldModal';
import TextField from '@/features/projectHome/components/TextField';
import TeamMemberCard from '@/components/TeamMemberCard';
import AddTeamProfileModal from '@/features/projectHome/components/AddTeamProfileModal';
import ChangeLeaderModal from '@/features/projectHome/components/ChangeLeaderModal';
import Portal from '@/components/Portal';
import { useProjectHomeState } from '@/hooks/mutations/useProjectHome';
import { useGetProjectIsCompleted } from '@/hooks/queries/projects/useGetProject';
import axiosInstance from '@/lib/axiosInstance';

export default function ProjectHomePage() {
  const params = useParams();
  const projectId = Number(params.projectId);
  const { data: isCompletedData } = useGetProjectIsCompleted(projectId);
  const isCompleted = Boolean(isCompletedData?.result?.isCompleted);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [currentUserImageUrl, setCurrentUserImageUrl] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('프로젝트');
  const [inviteCode, setInviteCode] = useState<string>('INVITE123');
  const [expiresAt, setExpiresAt] = useState<string>('');

  const {
    // 상태
    isLoading,
    error,
    isModalOpen,
    isTextFieldModalOpen,
    isAddTeamModalOpen,
    isChangeLeaderModalOpen,
    // selectedMemberId,
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
    // 상태 설정 함수
    setTeamGoal,
    setTeamRules,
    // API mutations
    updateProjectMutation,
  } = useProjectHomeState(projectId);

  // 프로젝트 데이터에서 프로젝트 이름 가져오기
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/projects/${projectId}`);
        if (response.data.isSuccess && response.data.result?.project) {
          setProjectName(response.data.result.project.name || '프로젝트');

          // 초대코드와 만료일 설정 (7일 후로 설정)
          const now = new Date();
          const expiresDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7일 후
          setExpiresAt(expiresDate.toISOString());

          // 초대코드는 프로젝트 ID를 기반으로 생성 (실제로는 API에서 가져와야 함)
          setInviteCode(`INVITE${projectId}`);
        }
      } catch (error) {
        console.error('프로젝트 정보 가져오기 실패:', error);
      }
    };
    fetchProjectData();
  }, [projectId]);

  // 현재 사용자 이메일 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/users/me');
        if (response.data.isSuccess && response.data.result) {
          setCurrentUserEmail(response.data.result.email);
          setCurrentUserImageUrl(response.data.result.imageUrl);
        }
      } catch (error) {
        console.error('현재 사용자 정보 가져오기 실패:', error);
      }
    };
    fetchCurrentUser();
  }, []);

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
        className="flex mt-[68px] gap-[29px] ml-[40px]
      max-lg:ml-[24px] max-lg:flex-col"
      >
        <div className="flex-col">
          <p className="text-[22px] font-semibold">게시판</p>
          <div
            className={`w-[1415px] h-[344px] border-[2px] border-[#BBBBBB] mt-[24px] rounded-[8px] px-[48px] py-[36px] gap-x-[48px] gap-y-[32px] relative ${
              isCompleted ? '' : 'cursor-pointer'
            }
          max-lg:w-[862px] max-lg:h-[344px]`}
            onClick={isCompleted ? undefined : handleBoardClick}
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
                      onDelete={
                        isCompleted
                          ? undefined
                          : () =>
                              handleDeletePostIt(
                                (postIt as { serverId?: number; id: string }).serverId ?? postIt.id
                              )
                      }
                      readOnly={isCompleted}
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
        className="flex mt-[80px] gap-[42px] ml-[40px]
      max-lg:flex-col max-lg:ml-[24px]"
      >
        <TextField
          title="우리 팀의 목표"
          placeholder="우리 팀의 목표를 작성하세요"
          value={teamGoal}
          onChange={(value) => {
            if (isCompleted) return;
            setTeamGoal(value);
          }}
          disabled={
            isCompleted ||
            !teamMembers.some((member) => member.isLeader && member.email === currentUserEmail)
          }
          onBlur={() => {
            if (isCompleted) return;
            // 현재 사용자가 팀장인지 확인
            const currentUser = teamMembers.find(
              (member) => member.isLeader && member.email === currentUserEmail
            );
            if (currentUser) {
              // 팀장인 경우에만 API 호출
              updateProjectMutation.mutate(
                { goal: teamGoal },
                {
                  onSuccess: (data) => {
                    console.log('팀 목표 업데이트 성공:', data);
                  },
                  onError: (error) => {
                    console.error('팀 목표 업데이트 실패:', error);
                    console.log('로컬 상태는 유지됩니다.');
                  },
                }
              );
            } else {
              console.log('팀장이 아니므로 팀 목표 수정을 건너뜁니다.');
            }
          }}
          maxLength={300}
          showFullViewButton={teamGoal.length >= 222}
          onFullViewClick={isCompleted ? undefined : () => handleShowFullText('goal')}
        />
        <TextField
          title="우리 팀의 규칙"
          placeholder="우리 팀의 규칙을 작성하세요"
          value={teamRules}
          onChange={(value) => {
            if (isCompleted) return;
            setTeamRules(value);
          }}
          disabled={
            isCompleted ||
            !teamMembers.some((member) => member.isLeader && member.email === currentUserEmail)
          }
          onBlur={() => {
            if (isCompleted) return;
            // 현재 사용자가 팀장인지 확인
            const currentUser = teamMembers.find(
              (member) => member.isLeader && member.email === currentUserEmail
            );
            if (currentUser) {
              // 팀장인 경우에만 API 호출
              updateProjectMutation.mutate(
                { rule: teamRules },
                {
                  onSuccess: (data) => {
                    console.log('팀 규칙 업데이트 성공:', data);
                  },
                  onError: (error) => {
                    console.error('팀 규칙 업데이트 실패:', error);
                    console.log('로컬 상태는 유지됩니다.');
                  },
                }
              );
            } else {
              console.log('팀장이 아니므로 팀 규칙 수정을 건너뜁니다.');
            }
          }}
          maxLength={300}
          showFullViewButton={teamRules.length >= 222}
          onFullViewClick={isCompleted ? undefined : () => handleShowFullText('rules')}
        />
      </div>
      {/* 팀원 프로필 */}
      <div
        className="mt-[82px] w-[1416px] ml-[40px]
      max-lg:ml-[24px]"
      >
        <div
          className="flex justify-between items-center
        max-lg:w-[860px] max-lg:mt-[70px]"
        >
          <p className="font-semibold text-[22px]">팀원 프로필</p>
          <button
            className={`w-[91px] h-[34px] px-[12px] py-[4px] text-white rounded-[4px] font-bold ${
              isCompleted ? 'bg-[#BBBBBB] cursor-not-allowed' : 'bg-[#81D7D4] cursor-pointer'
            }`}
            onClick={isCompleted ? undefined : handleAddTeamMember}
            disabled={isCompleted}
          >
            팀원 추가
          </button>
        </div>
        {/* 프로필 카드 */}
        <div
          className="grid grid-cols-4 gap-x-[52px] gap-y-[48px] mt-[24px]
        max-lg:grid-cols-1 max-lg:gap-y-[24px]"
        >
          {teamMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              name={member.name}
              university={member.university}
              email={member.email}
              role={member.role}
              isLeader={member.isLeader}
              currentUserEmail={currentUserEmail}
              currentUserImageUrl={currentUserImageUrl}
              onClick={isCompleted ? undefined : () => handleChangeLeader(member.id)}
              onUpdate={
                isCompleted
                  ? undefined
                  : (field, value) => handleUpdateTeamMember(member.id, field, value)
              }
              readOnly={isCompleted}
            />
          ))}
        </div>
      </div>

      {isModalOpen && !isCompleted && (
        <PostItModal onClose={handleCloseModal} onSave={handleSavePostIt} />
      )}

      {isTextFieldModalOpen && !isCompleted && (
        <Portal>
          <TextFieldModal
            type={textFieldModalType}
            content={textFieldModalType === 'goal' ? teamGoal : teamRules}
            onClose={handleCloseTextFieldModal}
            onSave={handleSaveTextFieldModal}
          />
        </Portal>
      )}

      {isAddTeamModalOpen && !isCompleted && (
        <Portal>
          <AddTeamProfileModal
            onClose={handleCloseAddTeamModal}
            projectName={projectName}
            inviteCode={inviteCode}
            expiresAt={expiresAt}
          />
        </Portal>
      )}

      {isChangeLeaderModalOpen && !isCompleted && (
        <Portal>
          <ChangeLeaderModal
            onClose={handleCloseChangeLeaderModal}
            onConfirm={handleConfirmChangeLeader}
          />
        </Portal>
      )}
    </div>
  );
}
