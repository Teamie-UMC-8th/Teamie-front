'use client';

import { useState } from 'react';
import { useCreateProject } from '@/hooks/mutations/useCreateProject';
import { formatToKoreanDate } from '@/utils/formatDate';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useThrottle } from '@/hooks/useThrottle';
import { useQueryClient } from '@tanstack/react-query';

export default function New() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [inviteVisible, setInviteVisible] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasAttemptedCreation, setHasAttemptedCreation] = useState(false);

  // 1초 throttle 적용
  const throttledCreateProject = useThrottle(1000);

  const createProjectMutation = useCreateProject(
    (response) => {
      console.log('프로젝트 생성 응답:', response);

      // 에러 메시지 초기화
      setErrorMessage('');

      // 서버에서 inviteCode만 반환하므로 직접 사용
      if (response.isSuccess && response.result?.inviteCode) {
        const { id: projectId, inviteCode: code, expiresAt: expiryDate } = response.result;
        setProjectId(projectId);
        setInviteCode(code);
        setExpiresAt(expiryDate); // 만료일 상태 저장
        setInviteVisible(true);

        // 프로젝트 목록 갱신 - 서버에서 최신 데이터 가져오기
        queryClient.invalidateQueries({ queryKey: ['user', 'projects'] });

        // 프로젝트 홈 데이터도 갱신하여 팀장 권한 확인
        queryClient.invalidateQueries({ queryKey: ['projectHome', projectId] });

        console.log('프로젝트 생성 완료. 생성자가 팀장으로 설정됩니다.');
      } else {
        console.error('응답 처리 실패: inviteCode를 찾을 수 없습니다.', response);
        setErrorMessage('프로젝트 생성에 실패하였습니다.\n잠시 후 다시 시도해 주세요.');
      }
    },
    (error) => {
      console.error('프로젝트 생성 오류:', error);
      setErrorMessage('프로젝트 생성에 실패하였습니다.\n잠시 후 다시 시도해 주세요.');
    }
  );

  // 프로젝트명 입력 제한 함수
  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 한글, 영문, 숫자, 공백, 하이픈만 허용하는 정규식
    const allowedPattern = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s-]*$/;

    if (allowedPattern.test(value) && value.length <= 20) {
      setProjectName(value);
    }
  };

  // 버튼 비활성화 조건
  const isButtonDisabled =
    createProjectMutation.isPending || hasAttemptedCreation || !projectName.trim();

  const handleCreateProject = () => {
    if (!projectName.trim() || hasAttemptedCreation) {
      return;
    }

    // 에러 메시지 초기화
    setErrorMessage('');

    // 생성 시도 표시
    setHasAttemptedCreation(true);

    // throttle 적용하여 중복 요청 방지
    throttledCreateProject(() => {
      createProjectMutation.mutate({ name: projectName });
    });
  };

  const handleRedirect = () => {
    router.push(`/projects/${projectId}`);
  };

  const handleCopyText = async () => {
    const textToCopy = `💡 프로젝트에 참여해 주세요!
아래 링크를 통해 참여를 수락하면, 
바로 협업을 시작할 수 있어요.
👉 참여 링크: ${window.location.origin}/projects/join/${inviteCode}
링크 유효기간: ${formatToKoreanDate(expiresAt)}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setShowCopyModal(true);
      setTimeout(() => {
        setShowCopyModal(false);
      }, 5000);
    } catch {
      window.alert('텍스트 복사에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <header className="flex items-center justify-between pb-[1rem] px-[0.5rem] border-b-[0.125rem] border-[#E7E7E7]">
        <h1 className="text-[1.375rem] lg:text-[1.5rem] font-semibold lg:font-bold">
          프로젝트 생성
        </h1>
      </header>

      <main className="flex items-center justify-center mt-[8rem]">
        <div className="flex flex-col items-start justify-center gap-[1rem]">
          <div className="lg:text-[1.375rem] text-[1.25rem] font-semibold px-[0.25rem]">
            프로젝트 명
          </div>
          <div className="flex justify-center gap-[1rem]">
            {/* 프로젝트 이름 입력 */}
            <input
              placeholder="프로젝트 이름을 입력해주세요."
              className={`lg:w-[27.5rem] lg:h-[3.125rem] w-[20.75rem] h-[3rem] border-[0.125rem] border-[#BBBBBB] rounded-[0.5rem] px-[1rem] py-[0.75rem] lg:text-[1.125rem] text-[1rem] ${
                createProjectMutation.isPending || hasAttemptedCreation ? 'cursor-not-allowed' : ''
              }`}
              value={projectName}
              onChange={handleProjectNameChange}
              disabled={createProjectMutation.isPending || hasAttemptedCreation}
              maxLength={20}
            />
            <button
              className={`self-center px-[0.75rem] py-[0.25rem] whitespace-nowrap bg-[#81D7D4] rounded-[0.25rem] text-white font-bold text-[1.125rem] ${
                isButtonDisabled ? 'bg-[#BAE5E4] cursor-not-allowed' : 'cursor-pointer'
              }`}
              onClick={handleCreateProject}
              disabled={isButtonDisabled}
            >
              생성하기
            </button>
          </div>

          {/* 에러 메시지 표시 */}
          {errorMessage && (
            <div className="text-[#FF0000] self-center text-[1.125rem] text-center mt-[8rem] whitespace-pre-line">
              {errorMessage}
            </div>
          )}
        </div>
      </main>

      {inviteVisible && inviteCode && (
        <div className="flex items-center justify-center mt-[3.75rem]">
          <div className="flex flex-col items-cetner gap-[1rem]">
            <h2 className="px-[0.25rem] lg:text-[1.375rem] text-[1.25rem] font-semibold text-black">
              링크로 팀원 초대
              <span className="hidden lg:inline px-[0.5rem] text-[1rem] font-normal">
                (유효기간: 7일)
              </span>
            </h2>

            <div className="bg-[#FFFFFF] p-[2rem] border-[0.125rem] border-[#BBBBBB] rounded-[0.75rem] relative">
              <div className="bg-[#F8F8F8] rounded-[0.75rem] relative">
                <p className="lg:px-[6.5rem] px-[4rem] py-[2rem] lg:text-[1.125rem] text-[1rem] text-center">
                  💡 프로젝트에 참여해 주세요!
                  <br />
                  아래 링크를 통해 참여를 수락하면, <br />
                  바로 협업을 시작할 수 있어요.
                  <br />
                  👉 참여하기:{' '}
                  <Link
                    href={`/projects/join/${inviteCode}`}
                    className="underline font-bold text-[#81D7D4]"
                  >
                    {projectName}
                  </Link>
                  <br />
                  {expiresAt && `링크 유효기간: ${formatToKoreanDate(expiresAt)}`}
                </p>

                <button
                  className="absolute top-[0.75rem] right-[0.75rem] cursor-pointer"
                  onClick={handleCopyText}
                >
                  <img src="/icons/copy_url.svg" alt="copy_url" />
                </button>

                {/* 복사 완료 모달 */}
                {showCopyModal && (
                  <div className="absolute bottom-[-1.25rem] left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-[#F8F8F8] text-[#505050] px-[1.25rem] py-[0.5rem] border-[0.09375rem] border-[#BBBBBB] rounded-[0.375rem] lg:text-[1.125rem] text-[1rem] whitespace-nowrap">
                      초대 메세지가 복사되었습니다.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              className="cursor-pointer self-center lg:mt-[2rem] mt-[1.5rem] px-[2.5rem] py-[0.625rem] bg-[#81D7D4] text-white font-bold text-[1.125rem] rounded-[0.375rem]"
              onClick={handleRedirect}
            >
              프로젝트로 이동
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
