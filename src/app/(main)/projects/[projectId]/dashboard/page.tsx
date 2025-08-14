'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Searchbar } from '@/components/Searchbar';
import ToggleButton from '@/components/ToggleButton';
import StepsBoard from '@/features/boards/StepsBoard';
import StatusBoard from '@/features/boards/StatusBoard';
import { useGetDashboard } from '@/hooks/queries/useGetDashboard';
import { useWebSocket } from '@/contexts/WebSocketContext';
import {
  SubEventType,
  WebSocketResponseUnion,
  isTaskResponse,
  isStepResponse,
} from '@/types/webSocket';
import { useQueryClient } from '@tanstack/react-query';
import FilterPanel from '@/components/FilterPanel';

export default function DashboardPage() {
  // 상태 관리: STEP 별로 보기 / 진행 상태별로 보기
  const [isStepView, setIsStepView] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterButtonRect, setFilterButtonRect] = useState<DOMRect | null>(null);

  // 프로젝트 ID 파라미터 가져오기
  const { projectId } = useParams() as { projectId: string };

  // 웹소켓 훅 사용
  const { socket, subscribe, unsubscribe, isConnected } = useWebSocket();

  // React Query 클라이언트 (쿼리 무효화용)
  const queryClient = useQueryClient();

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

  // 프로젝트의 모든 담당자 목록 추출 (필터 패널용)
  const getAllAssignees = () => {
    if (!dashboardData) return [];

    const assigneesMap = new Map<number, { userId: number; name: string; imageUrl: string }>();

    // steps에서 담당자 추출
    if ('steps' in dashboardData) {
      dashboardData.steps.forEach((step) => {
        step.tasks.forEach((task) => {
          task.managers.forEach((manager) => {
            if (manager.userId && manager.name) {
              assigneesMap.set(manager.userId, {
                userId: manager.userId,
                name: manager.name,
                imageUrl: manager.imageUrl || '/icons/assignee.svg',
              });
            }
          });
        });
      });
    }

    // statusGroups에서 담당자 추출
    if ('statusGroups' in dashboardData) {
      dashboardData.statusGroups.forEach((group) => {
        group.tasks.forEach((task) => {
          task.managers.forEach((manager) => {
            if (manager.userId && manager.name) {
              assigneesMap.set(manager.userId, {
                userId: manager.userId,
                name: manager.name,
                imageUrl: manager.imageUrl || '/icons/assignee.svg',
              });
            }
          });
        });
      });
    }

    return Array.from(assigneesMap.values());
  };

  // 담당자 정보 디버깅
  useEffect(() => {
    if (dashboardData) {
      const assignees = getAllAssignees();
      console.log('추출된 담당자 정보:', assignees);
    }
  }, [dashboardData]);

  // 웹소켓 이벤트 처리
  useEffect(() => {
    if (isConnected && socket) {
      const projectIdNum = parseInt(projectId);

      // 1. project:dashboard 룸 구독
      subscribe(SubEventType.PROJECT_DASHBOARD, projectIdNum);

      // 2. publish 이벤트 수신 - 실시간 업데이트 처리
      const handlePublish = (data: WebSocketResponseUnion) => {
        console.log('웹소켓 이벤트 수신:', data);

        // 타입 가드를 사용하여 entity가 'task' 또는 'step'인 경우에만 처리
        if (isTaskResponse(data) || isStepResponse(data)) {
          console.log(
            `변경 사항 발생에 따라 대시보드 쿼리 무효화 (이벤트: ${data.entity}.${data.type})`
          );

          queryClient.invalidateQueries({
            queryKey: ['dashboard', projectIdNum],
          });
        }
      };

      // 3. unsubscribe-forced 이벤트 수신 - 강제 구독 해제
      const handleForceUnsubscribe = () => {
        console.log('강제 구독 해제');
        window.location.href = '/home/tasks';
      };

      // 이벤트 리스너 등록
      socket.on('publish', handlePublish);
      socket.on('unsubscribe-forced', handleForceUnsubscribe);

      // 컴포넌트 언마운트 시 정리
      return () => {
        // 구독 해제
        unsubscribe(SubEventType.PROJECT_DASHBOARD, projectIdNum);

        // 이벤트 리스너 제거
        socket.off('publish', handlePublish);
        socket.off('unsubscribe-forced', handleForceUnsubscribe);
      };
    }
  }, [isConnected, socket, projectId, subscribe, unsubscribe, queryClient]);

  // 뷰 변경 시 데이터 다시 불러오기
  const handleViewToggle = (isLeftSelected: boolean) => {
    setIsStepView(isLeftSelected);
    // 토글 후 잠시 대기 후 데이터 다시 불러오기
    setTimeout(() => {
      refetch();
    }, 100);
  };

  // 필터 패널 열기/닫기
  const handleFilterClick = (buttonRect: DOMRect) => {
    setFilterButtonRect(buttonRect);
    setIsFilterOpen(true);
  };

  const handleFilterClose = () => {
    setIsFilterOpen(false);
    setFilterButtonRect(null);
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

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <header className="flex items-center justify-between pb-[1rem] px-[0.5rem] border-b-[0.125rem] border-[#E7E7E7]">
        <div>
          <h1 className="lg:text-[1.5rem] text-[1.375rem] lg:font-bold font-semibold">
            업무 대시보드
          </h1>
        </div>
        <div className="flex-1 flex justify-end"></div>
        <div className="relative">
          <Searchbar
            placeholder="검색어를 입력하세요."
            onChange={() => {}}
            onFilterClick={handleFilterClick}
          />

          {/* 필터 패널 */}
          <FilterPanel
            isOpen={isFilterOpen}
            onClose={handleFilterClose}
            assignees={getAllAssignees()}
            buttonRect={filterButtonRect}
          />
        </div>
      </header>

      <ToggleButton
        leftLabel="STEP 별로 보기"
        rightLabel="진행 상태별로 보기"
        isLeftSelected={isStepView}
        onToggle={handleViewToggle}
      />

      <main className="flex-1">
        <div
          className="min-w-[40rem]"
          style={{
            paddingLeft: 'clamp(2.688rem, calc(7rem - ((100vw - 64rem) * 0.077)), 7rem)',
          }}
        >
          {isStepView ? (
            <StepsBoard
              steps={dashboardData && 'steps' in dashboardData ? dashboardData.steps : []}
              projectId={projectId}
            />
          ) : (
            <StatusBoard
              statusGroups={
                dashboardData && 'statusGroups' in dashboardData ? dashboardData.statusGroups : []
              }
              projectId={projectId}
            />
          )}
        </div>
      </main>
    </div>
  );
}
