'use client';

import { useParams } from 'next/navigation';
import LeaderView from '@/features/retrospects/components/LeaderView';
import { MemberView } from '@/features/retrospects/components/MemberView';
import { useGetUserProjectPermission } from '@/hooks/queries/projects/useGetUserProjectPermission';
import { useGetPersonalRetro } from '@/hooks/queries/useGetPersonalRetro';
import PersonalSection from '@/features/retrospects/components/PersonalSection';
import axios from 'axios';

export default function PersonalRetroPage() {
  const params = useParams();
  const projectId = params.projectId?.toString();

  const { data: permissionData, isLoading, error } = useGetUserProjectPermission(projectId ?? '');

  // 개인 회고 존재 여부로 종료 상태 판별
  const numericProjectId = Number(projectId);
  const {
    data: personalData,
    isLoading: isPersonalLoading,
    error: personalError,
    isSuccess: isPersonalSuccess,
  } = useGetPersonalRetro(numericProjectId);

  // 콘솔에 권한 정보 출력
  console.log('프로젝트 권한 정보:', permissionData);

  // 개인 회고 로딩 우선 처리
  if (isPersonalLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px] text-lg">
        회고 정보를 불러오는 중...
      </div>
    );
  }

  // 개인 회고가 존재하면 바로 개인 회고 화면 노출 (헤더/구분선 포함)
  if (isPersonalSuccess && personalData) {
    return (
      <div className="w-full px-[128px] pt-[60px] max-lg:px-[32px]">
        <div className="w-full lg:max-w-[1415px] flex flex-col">
          <h2
            className="mb-[16px] font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] whitespace-nowrap text-[#000000]
          max-lg:text-[22px] max-lg:leading-[28px] max-lg:font-[600] max-lg:tracking-[0] mb-[16px] whitespace-nowrap"
          >
            개인 회고
          </h2>
          <hr className="w-full border-t-[2px] border-[#E7E7E7] rotate-180 mb-[102px]" />
          <PersonalSection />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px] text-lg">
        권한 정보를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[500px] text-lg text-red-500">
        권한 정보를 불러오는데 실패했습니다.
      </div>
    );
  }

  // 개인 회고가 없고(404) → 종료 전으로 간주하여 리더/멤버 뷰 노출
  const isNotFoundPersonal =
    axios.isAxiosError(personalError) && personalError.response?.status === 404;
  const isLeader = permissionData?.result?.permission === 'LEAD';

  if (isNotFoundPersonal) {
    return <div>{isLeader ? <LeaderView /> : <MemberView />}</div>;
  }

  // 기타 예외(개인 회고 조회 에러 등)
  if (personalError) {
    return (
      <div className="flex justify-center items-center min-h-[500px] text-lg text-red-500">
        회고 정보를 불러오는데 실패했습니다.
      </div>
    );
  }

  // 기본적으로 개인 회고 화면 표시 (헤더/구분선 포함)
  return (
    <div className="w-full px-[128px] pt-[60px] max-lg:px-[32px]">
      <div className="w-full lg:max-w-[1415px] flex flex-col">
        <h2
          className="mb-[16px] font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] whitespace-nowrap text-[#000000]
        max-lg:text-[22px] max-lg:leading-[28px] max-lg:font-[600] max-lg:tracking-[0] mb-[16px] whitespace-nowrap"
        >
          개인 회고
        </h2>
        <hr className="w-full border-t-[2px] border-[#E7E7E7] rotate-180 mb-[120px]" />
        <PersonalSection />
      </div>
    </div>
  );
}
