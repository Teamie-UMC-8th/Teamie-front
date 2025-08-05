'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetProject } from '@/hooks/queries/useGetProject';
import { useJoinProject } from '@/hooks/mutations/useJoinProject';

interface ProjectInfo {
  name: string;
  projectId: string;
  projectLeader: string;
}

export default function JoinProject() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: '',
    projectId: '',
    projectLeader: '',
  });
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const inviteCode = params.inviteCode as string;

  // 1. GET 요청으로 초대코드 유효성 확인
  const getProjectQuery = useGetProject({ inviteCode });

  // 2. POST 요청으로 프로젝트 참여
  const joinProjectMutation = useJoinProject(
    (response) => {
      if (response.isSuccess) {
        setShowWelcomeModal(true);
        setIsLoading(false);

        // 2초 후 프로젝트 페이지로 이동
        setTimeout(() => {
          router.push(`/projects/${projectInfo.projectId}`);
        }, 2000);
      } else {
        setError(response.error || '프로젝트 참여에 실패했습니다.');
        setIsLoading(false);
      }
    },
    (error) => {
      console.error('프로젝트 참여 오류:', error);
      setError('프로젝트 참여에 실패했습니다. 초대 링크를 다시 확인해주세요.');
      setIsLoading(false);
    }
  );

  // GET 요청 결과 처리
  useEffect(() => {
    if (getProjectQuery.isSuccess && getProjectQuery.data) {
      // 프로젝트 정보 설정
      const projectData = getProjectQuery.data.result;
      if (projectData.project) {
        setProjectInfo({
          name: projectData.project.name,
          projectId: projectData.project.id,
          projectLeader: projectData.project.leader,
        });
      }
    } else if (getProjectQuery.isError) {
      console.error('초대코드 유효성 확인 오류:', getProjectQuery.error);

      // 에러 응답에서 errorCode를 확인하여 처리 방식 결정
      const errorResponse = getProjectQuery.error;
      const errorCode = errorResponse.response?.data?.error?.errorCode;

      if (errorCode === 'PROJECT4011') {
        // 잘못된 초대코드
        setError('초대 링크가 유효하지 않습니다.');
      } else if (errorCode === 'PROJECT4094') {
        // 이미 참여한 프로젝트 - result에서 projectId를 추출하여 프로젝트 홈으로 리다이렉트
        const projectId = errorResponse?.response?.data?.result?.project?.id;
        if (projectId) {
          console.log('이미 참여한 프로젝트입니다. 프로젝트 홈으로 이동합니다.');
          router.push(`/projects/${projectId}`);
        } else {
          console.error('projectId가 없습니다.');
          router.push('/home/tasks');
        }
      } else if (errorCode === 'PROJECT4043') {
        // NOT_EXISTS 또는 CODE_EXPIRED - 에러 상태로 설정하여 에러 화면 표시
        setError('초대 링크가 만료되었습니다.');
      } else {
        // 기타 오류
        setError('초대 링크가 유효하지 않습니다.');
      }
    }
  }, [
    getProjectQuery.isSuccess,
    getProjectQuery.data,
    getProjectQuery.isError,
    getProjectQuery.error,
    router,
  ]);

  const handleAccept = () => {
    setIsLoading(true);
    setError(null);
    joinProjectMutation.mutate({ inviteCode });
  };

  if (getProjectQuery.isLoading) {
    return null;
  }

  // 에러 상태 (잘못된 코드 또는 만료된 코드)
  if (error) {
    return (
      <div className="w-full bg-white flex items-center justify-center mt-[10rem]">
        <div className="flex flex-col items-center p-8 text-[1.375rem] font-semibold">
          <p className="text-lg text-gray-800 text-center">{error}</p>
          <p className="text-lg text-gray-800 text-center">
            팀장에게 새로운 링크를 요청 후, 프로젝트에 참여해주세요.
          </p>
        </div>
      </div>
    );
  }

  // 정상 초대 상태
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">프로젝트에 참여하시겠습니까?</h1>
        <p className="text-lg text-gray-600">
          {projectInfo.projectLeader}님이 함께 프로젝트를 진행하고 싶어해요!
        </p>
        <button
          onClick={handleAccept}
          disabled={isLoading}
          className={`px-8 py-3 text-white rounded-lg font-medium text-lg ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#81D7D4] hover:bg-[#6BC7C4]'
          }`}
        >
          수락
        </button>
      </div>

      {/* 환영 모달 */}
      {showWelcomeModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-[0_0_15px_0_rgba(0,0,0,0.2)] px-[7.5rem] py-[3.75rem] text-center">
            {/* 아바타 자리 */}
            <div className="mx-auto mb-[1.25rem] w-[4.5rem] h-[4.5rem] bg-[#D9D9D9]" />

            {/* 텍스트 */}
            <p className="text-[1.25rem] font-semibold">
              환영합니다! <br />
              프로젝트 A의 팀원이 되셨습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
