'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetProject } from '@/hooks/queries/projects/useGetProject';
import { useJoinProject } from '@/hooks/mutations/useJoinProject';
import { GetJoinProjectResponse } from '@/types/api/project';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types/api/error';
import Image from 'next/image';

interface ProjectInfo {
  name: string;
  projectId: string | undefined;
  leaderName: string;
}

export default function JoinProject() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: '',
    projectId: '',
    leaderName: '',
  });
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // 성공 상태 추가

  const inviteCode = params.inviteCode as string;

  // 1. GET 요청으로 초대코드 유효성 확인
  const getProjectQuery = useGetProject({ inviteCode });

  // 2. POST 요청으로 프로젝트 참여
  const joinProjectMutation = useJoinProject(
    (response) => {
      if (response.isSuccess) {
        setShowWelcomeModal(true);
        setIsLoading(false);
        setIsSuccess(true); // 성공 상태 설정

        // 2초 후 프로젝트 페이지로 이동
        setTimeout(() => {
          router.push(`/projects/${projectInfo.projectId}`);
        }, 2000);
      } else {
        setError(response.error?.reason || '프로젝트 참여에 실패했습니다.');
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
    // 로딩 중이거나 이미 처리된 경우 중복 처리 방지
    if (getProjectQuery.isLoading || getProjectQuery.isFetching) {
      return;
    }

    if (getProjectQuery.isSuccess && getProjectQuery.data) {
      // 프로젝트 정보 설정
      const projectData: GetJoinProjectResponse = getProjectQuery.data;
      if (projectData.result) {
        setProjectInfo({
          name: projectData.result.name,
          projectId: String(projectData.result.projectId), // id → projectId로 변경
          leaderName: projectData.result.leaderName,
        });
        setIsSuccess(true); // 성공 상태 설정
      }
    } else if (getProjectQuery.isError) {
      console.error('초대코드 유효성 확인 오류:', getProjectQuery.error);

      // 에러 응답에서 errorCode를 확인하여 처리 방식 결정
      const errorResponse = getProjectQuery.error as AxiosError<
        ApiResponse<{ project: { id: string } }>
      >;
      const errorCode = errorResponse.response?.data?.error?.errorCode;
      const projectId = errorResponse.response?.data?.error?.data?.projectId;

      // 이미 참여한 경우, 에러가 아닌 성공 경로로 취급하여 즉시 리다이렉트
      if (errorCode === 'PROJECT4094' && projectId) {
        // setError를 호출하지 않으므로 에러 메시지가 렌더링되지 않음
        router.push(`/projects/${projectId}`);
        return; // 다른 에러 처리 로직을 실행하지 않도록 여기서 종료
      }

      // 그 외의 다른 에러들만 에러 상태로 설정
      if (errorCode === 'PROJECT4011') {
        setError('초대 링크가 유효하지 않습니다.');
      } else if (errorCode === 'PROJECT4043') {
        setError('초대 링크가 만료되었습니다.');
      } else {
        setError('초대 링크가 유효하지 않습니다.');
      }
    }
  }, [
    getProjectQuery.isSuccess,
    getProjectQuery.data,
    getProjectQuery.isError,
    getProjectQuery.error,
    getProjectQuery.isLoading,
    getProjectQuery.isFetching,
    router,
  ]);

  const handleAccept = () => {
    setIsLoading(true);
    setError(null);
    // string → number로 변경
    joinProjectMutation.mutate({ projectId: Number(projectInfo.projectId) || 0 });
  };

  // 1. 로딩 상태 (pending)
  if (getProjectQuery.isLoading || getProjectQuery.isFetching) {
    return null;
  }

  // 2. 에러 상태 (error) - 성공이 확정되지 않은 경우
  if (error && !isSuccess) {
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

  // 3. 성공 상태 (success) - 성공이 확정된 경우에만 정상 UI 렌더
  if (isSuccess && projectInfo.name) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 p-8 text-center">
          <h1 className="text-2xl font-bold text-[#000000]">프로젝트에 참여하시겠습니까?</h1>
          <p className="text-lg text-[#898989]]">
            {projectInfo.leaderName}님이 함께 프로젝트를 진행하고 싶어해요!
          </p>
          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="cursor-pointer px-8 py-3 text-white rounded-lg font-medium text-lg bg-[#81D7D4]"
          >
            수락
          </button>
        </div>

        {/* 환영 모달 */}
        {showWelcomeModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-[0_0_15px_0_rgba(0,0,0,0.2)] px-[7.5rem] py-[2rem] text-center">
              {/* 아바타 자리 */}
              <div className="flex items-center justify-center mx-auto w-[7.5rem] h-[7.5rem]">
                <Image src="/icons/welcomeTeamie.svg" alt="welcome" width={111} height={68} />
              </div>

              {/* 텍스트 */}
              <p className="text-[1.25rem] font-semibold mb-[1.75rem]">
                환영합니다! <br />
                {projectInfo.name}의 팀원이 되셨습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. 초기 상태 (아직 아무것도 결정되지 않은 경우)
  return null;
}
