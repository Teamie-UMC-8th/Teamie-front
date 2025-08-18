'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Searchbar } from '@/components/Searchbar';
import ToggleButton from '@/components/ToggleButton';
import StepsBoard from '@/features/boards/StepsBoard';
import StatusBoard from '@/features/boards/StatusBoard';
import { useGetDashboard } from '@/hooks/queries/useGetDashboard';
import { useGetProjectIsCompleted } from '@/hooks/queries/projects/useGetProject';
import { useWebSocket } from '@/contexts/WebSocketContext';
import {
  SubEventType,
  WebSocketResponseUnion,
  isTaskResponse,
  isStepResponse,
} from '@/types/webSocket';
import { useQueryClient } from '@tanstack/react-query';
import FilterPanel from '@/components/FilterPanel';
import { TaskFilters } from '@/types/api/tasks';
import { searchTasks } from '@/services/tasks/searchTasks';
import { DashboardResponse } from '@/types/api/dashboard';

export default function DashboardPage() {
  // 상태 관리: STEP 별로 보기 / 진행 상태별로 보기
  const [isStepView, setIsStepView] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterButtonRect, setFilterButtonRect] = useState<DOMRect | null>(null);
  const [currentFilters, setCurrentFilters] = useState<TaskFilters>({
    statuses: [],
    managerIds: [],
  });
  const [filteredData, setFilteredData] = useState<DashboardResponse | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);

  // API 상태값을 UI 상태값으로 변환하는 함수
  const getDisplayStatusValue = (apiStatus: string): string => {
    switch (apiStatus) {
      case 'NOTSTART':
        return '시작 전';
      case 'ONGOING':
        return '진행 중';
      case 'COMPLETED':
        return '완료';
      default:
        return apiStatus;
    }
  };

  // 프로젝트 ID 파라미터 가져오기
  const { projectId } = useParams() as { projectId: string };

  // 프로젝트 종료 여부 조회
  const { data: isCompleted, isLoading: isStatusLoading } = useGetProjectIsCompleted(
    parseInt(projectId)
  );

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

  const handleFilterClose = async (filters: TaskFilters) => {
    console.log('필터 패널에서 받은 필터:', filters);

    // 필터가 실제로 변경되었는지 확인
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(currentFilters);

    if (filtersChanged) {
      setCurrentFilters(filters);

      // 필터가 적용되었는지 확인
      const hasActiveFilters =
        filters.statuses.length > 0 ||
        filters.managerIds.length > 0 ||
        filters.dateBefore ||
        filters.dateAfter;

      console.log('활성 필터 여부:', hasActiveFilters);

      if (hasActiveFilters) {
        // 필터가 적용된 경우 검색 API 호출
        try {
          setIsFiltered(true);
          const searchParams = {
            projectId: parseInt(projectId),
            view: isStepView ? ('step' as const) : ('status' as const),
            statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
            managerIds: filters.managerIds.length > 0 ? filters.managerIds : undefined,
            dateBefore: filters.dateBefore,
            dateAfter: filters.dateAfter,
          };

          console.log('검색 API 호출 파라미터:', searchParams);

          const searchResult = await searchTasks(searchParams);
          setFilteredData(searchResult);
          console.log('필터 검색 결과:', searchResult);
        } catch (error) {
          console.error('필터 검색 중 오류 발생:', error);
          // 검색 실패 시 원본 데이터 사용
          setIsFiltered(false);
          setFilteredData(null);
        }
      } else {
        // 필터가 없는 경우 원본 데이터 사용
        setIsFiltered(false);
        setFilteredData(null);
      }
    }

    setIsFilterOpen(false);
    setFilterButtonRect(null);
  };

  // 필터 변경 시 즉시 데이터 재페칭
  const handleFilterChange = async (filters: TaskFilters) => {
    // 필터가 실제로 변경되었는지 확인
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(currentFilters);

    if (filtersChanged) {
      setCurrentFilters(filters);

      // 활성 필터가 있으면 즉시 데이터 재페칭
      const hasActiveFilters =
        filters.statuses.length > 0 ||
        filters.managerIds.length > 0 ||
        filters.dateBefore ||
        filters.dateAfter;

      if (hasActiveFilters) {
        try {
          setIsFiltered(true);
          const searchParams = {
            projectId: parseInt(projectId),
            view: isStepView ? ('step' as const) : ('status' as const),
            statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
            managerIds: filters.managerIds.length > 0 ? filters.managerIds : undefined,
            dateBefore: filters.dateBefore,
            dateAfter: filters.dateAfter,
          };

          const searchResult = await searchTasks(searchParams);
          setFilteredData(searchResult);
        } catch (error) {
          console.error('필터링 실패:', error);
          // 실패 시 원본 데이터 사용
          setIsFiltered(false);
          setFilteredData(null);
        }
      } else {
        // 활성 필터가 없으면 원본 데이터 사용
        setIsFiltered(false);
        setFilteredData(null);
      }
    }
  };

  // 현재 표시할 데이터 결정 (필터링된 데이터 또는 원본 데이터)
  const displayData = isFiltered ? filteredData : dashboardData;

  // 필터링된 데이터 재페칭 함수
  const handleRefetchFilteredData = async () => {
    if (!isFiltered) return;

    try {
      const searchParams = {
        projectId: parseInt(projectId),
        view: isStepView ? ('step' as const) : ('status' as const),
        statuses: currentFilters.statuses.length > 0 ? currentFilters.statuses : undefined,
        managerIds: currentFilters.managerIds.length > 0 ? currentFilters.managerIds : undefined,
        dateBefore: currentFilters.dateBefore,
        dateAfter: currentFilters.dateAfter,
      };

      const searchResult = await searchTasks(searchParams);
      setFilteredData(searchResult);
    } catch (error) {
      console.error('필터링된 데이터 재페칭 실패:', error);
      // 실패 시 원본 데이터 사용
      setIsFiltered(false);
      setFilteredData(null);
    }
  };

  // 로딩 상태 처리 (프로젝트 상태도 함께 체크)
  if (isLoading || isStatusLoading) {
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
    <div className="h-full w-full bg-white flex flex-col">
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
            onFilterChange={handleFilterChange}
            assignees={getAllAssignees()}
            buttonRect={filterButtonRect}
            initialFilters={
              isFilterOpen
                ? {
                    ...currentFilters,
                    statuses: currentFilters.statuses.map(getDisplayStatusValue), // API 상태값을 UI 상태값으로 변환
                    // 날짜 순서 변환: dateAfter는 시작일, dateBefore는 종료일
                    dateAfter: currentFilters.dateAfter,
                    dateBefore: currentFilters.dateBefore,
                  }
                : undefined
            }
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
              steps={displayData && 'steps' in displayData ? displayData.steps : []}
              projectId={projectId}
              isCompleted={Boolean(isCompleted?.result?.isCompleted)}
              onRefetchFilteredData={handleRefetchFilteredData}
            />
          ) : (
            <StatusBoard
              statusGroups={
                displayData && 'statusGroups' in displayData ? displayData.statusGroups : []
              }
              projectId={projectId}
              isCompleted={Boolean(isCompleted?.result?.isCompleted)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
