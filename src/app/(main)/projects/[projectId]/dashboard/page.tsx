'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Searchbar } from '@/components/Searchbar';
import ToggleButton from '@/components/ToggleButton';
import StepsBoard from '@/features/boards/StepsBoard';
import StatusBoard from '@/features/boards/StatusBoard';
import { useGetDashboard } from '@/hooks/queries/useGetDashboard';

export default function DashboardPage() {
  // 상태 관리: STEP 별로 보기 / 진행 상태별로 보기
  const [isStepView, setIsStepView] = useState(true);
  // 프로젝트 ID 파라미터 가져오기
  const { projectId } = useParams() as { projectId: string };

  // 대시보드 데이터 조회
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useGetDashboard({
    projectId: parseInt(projectId),
    view: isStepView ? 'step' : 'status',
  });

  // 뷰 변경 시 데이터 다시 불러오기
  const handleViewToggle = (isLeftSelected: boolean) => {
    setIsStepView(isLeftSelected);
    // 토글 후 잠시 대기 후 데이터 다시 불러오기
    setTimeout(() => {
      refetch();
    }, 100);
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-lg text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
      </div>
    );
  }

  // API 데이터를 기존 컴포넌트가 기대하는 형태로 변환
  const steps =
    dashboardData?.steps?.map((apiStep) => ({
      id: apiStep.stepId,
      name: apiStep.stepName,
      items:
        apiStep.tasks?.map((task) => ({
          id: task.taskId,
          title: task.taskName,
          status: (task.status === 'ONGOING'
            ? '진행 중'
            : task.status === 'COMPLETED'
              ? '완료'
              : task.status === 'PENDING'
                ? '시작 전'
                : '시작 전') as '시작 전' | '진행 중' | '완료',
          deadline: new Date(task.deadline).toISOString().split('T')[0],
          assignee: task.managers?.map((manager) => manager.userName) ?? [],
        })) ?? [],
    })) ?? [];

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <header className="flex items-center justify-between pb-[1rem] px-[0.5rem] border-b-[0.125rem] border-[#E7E7E7]">
        <h1 className="lg:text-[1.5rem] text-[1.375rem] lg:font-bold font-semibold">
          업무 대시보드
        </h1>
        <div className="flex-1 flex justify-end"></div>
        <Searchbar
          placeholder="검색어를 입력하세요."
          onChange={() => {}}
          onFilterClick={() => {}}
        />
      </header>

      <ToggleButton
        leftLabel="STEP 별로 보기"
        rightLabel="진행 상태별로 보기"
        onToggle={handleViewToggle}
      />

      <main className="flex-1 overflow-x-auto">
        <div
          className="min-w-[40rem]"
          style={{
            paddingLeft: 'clamp(2.688rem, calc(7rem - ((100vw - 64rem) * 0.077)), 7rem)',
          }}
        >
          {isStepView ? (
            <StepsBoard steps={steps} projectId={projectId} />
          ) : (
            <StatusBoard steps={steps} projectId={projectId} />
          )}
        </div>
      </main>
    </div>
  );
}
