'use client';

import { useParams } from 'next/navigation';
import LeaderView from '@/features/retrospects/components/LeaderView';
import { MemberView } from '@/features/retrospects/components/MemberView';
import { useGetUserProjectPermission } from '@/hooks/queries/projects/useGetUserProjectPermission';

export default function PersonalRetroPage() {
  const params = useParams();
  const projectId = params.projectId?.toString();

  const { data: permissionData, isLoading, error } = useGetUserProjectPermission(projectId ?? '');

  // 콘솔에 권한 정보 출력
  console.log('프로젝트 권한 정보:', permissionData);

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

  return <div>{isLeader ? <LeaderView /> : <MemberView />}</div>;
}
