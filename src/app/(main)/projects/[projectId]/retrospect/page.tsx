'use client';

import { useParams } from 'next/navigation';
import LeaderView from '@/features/retrospects/components/LeaderView';
import { MemberView } from '@/features/retrospects/components/MemberView';
import { useGetUserProjectPermission } from '@/hooks/queries/projects/useGetUserProjectPermission';
import { useGetProjectIsCompleted } from '@/hooks/queries/projects/useGetProject';
import PersonalSection from '@/features/retrospects/components/PersonalSection';
import { useProjectHome } from '@/hooks/mutations/useProjectHome';

export default function PersonalRetroPage() {
  const params = useParams();
  const projectId = params.projectId?.toString();

  const { data: permissionData, isLoading, error } = useGetUserProjectPermission(projectId ?? '');

  const numericProjectId = Number(projectId);
  // 프로젝트 상세 먼저 조회 (데이터 연결 목적)
  const {
    data: projectDetail,
    isLoading: projectLoading,
    error: projectError,
  } = useProjectHome(numericProjectId);
  const {
    data: isCompletedData,
    isLoading: isCompletedLoading,
    error: isCompletedError,
  } = useGetProjectIsCompleted(numericProjectId);

  // 콘솔에 권한 정보 출력
  console.log('프로젝트 권한 정보:', permissionData);
  // 콘솔에 프로젝트 상세 정보 출력
  console.log('프로젝트 상세 정보:', projectDetail);

  // 종료 여부/권한 로딩 우선 처리
  if (projectLoading || isCompletedLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px] text-lg">
        정보를 불러오는 중...
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="flex justify-center items-center min-h-[500px] text-lg text-red-500">
        프로젝트 정보를 불러오는데 실패했습니다.
      </div>
    );
  }

  if (isCompletedError) {
    return (
      <div className="flex justify-center items-center min-h-[500px] text-lg text-red-500">
        프로젝트 종료 여부를 불러오는데 실패했습니다.
      </div>
    );
  }

  // 종료됨 → 개인 회고 화면
  const isCompleted = Boolean(isCompletedData?.result?.isCompleted);
  console.log(
    '[Retrospect] projectId:',
    numericProjectId,
    'isCompleted:',
    isCompleted,
    'raw:',
    isCompletedData
  );
  if (isCompleted) {
    return (
      <div className="w-full">
        <div className="w-full flex flex-col">
          <h2
            className="mb-[16px] font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] whitespace-nowrap text-[#000000] ml-[28px]
          max-lg:text-[22px] max-lg:leading-[28px] max-lg:font-[600] max-lg:tracking-[0] max-lg:ml-[32px] mb-[16px] whitespace-nowrap"
          >
            개인 회고
          </h2>
        </div>
        <div className="ml-[20px] max-lg:ml-[24px]">
          <hr className="w-[1550px] max-lg:w-[862px] border-t-[2px] border-[#E7E7E7] rotate-180 mb-[102px]" />
        </div>
        <div className="ml-[80px] max-lg:ml-[48px]">
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

  const isLeader = permissionData?.result?.permission === 'LEAD';
  // 종료 전 → 종료/이탈 화면
  return <div>{isLeader ? <LeaderView /> : <MemberView />}</div>;
}
