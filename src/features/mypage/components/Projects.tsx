'use client';

import {
  useMasterPortfolioList,
  useCorrectionProjects,
} from '@/hooks/queries/useGetMasterPortfolio';
import { useUpdateMainTask } from '@/hooks/mutations/useUser';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { formatDateRange } from '@/utils/formatDate';
import { useState, useRef, useEffect } from 'react';
import { MasterPortfolio } from '@/types/api/masterportfolio';
import { CATEGORY_MAP } from '@/constants/category';

export default function Projects() {
  const pathname = usePathname();
  const isProjectSelectPage = pathname === '/mypage/addcorrection/projectSelect';
  const isMyPage = pathname === '/mypage';
  const { data } = useMasterPortfolioList();
  const { data: selectable } = useCorrectionProjects();
  const updateMainTask = useUpdateMainTask();

  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<Set<number>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTaskClick = (portfolioId: number, currentTask: string) => {
    setEditingTask(portfolioId);
    setEditValue(currentTask || '');
  };

  const handleTaskSave = (portfolioId: number) => {
    updateMainTask.mutate(
      { portfolioId, mainTask: editValue },
      {
        onSuccess: () => {
          console.log('주요 업무 업데이트 성공');
          setEditingTask(null);
        },
        onError: (error) => {
          console.error('주요 업무 업데이트 실패:', error);
          alert('주요 업무 업데이트에 실패했습니다.');
        },
      }
    );
  };

  const handleTaskKeyDown = (e: React.KeyboardEvent, portfolioId: number) => {
    if (e.key === 'Enter') {
      handleTaskSave(portfolioId);
    } else if (e.key === 'Escape') {
      setEditingTask(null);
    }
  };

  const handleTaskBlur = (portfolioId: number) => {
    handleTaskSave(portfolioId);
  };

  const handleProjectSelect = (portfolioId: number, e: React.MouseEvent) => {
    if (isProjectSelectPage) {
      e.preventDefault();
      e.stopPropagation();

      setSelectedProjects((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(portfolioId)) {
          newSet.delete(portfolioId);
        } else {
          if (newSet.size < 6) {
            newSet.add(portfolioId);
          }
        }
        return newSet;
      });
    }
  };

  const getSelectionOrder = (portfolioId: number) => {
    if (!isProjectSelectPage || !selectedProjects.has(portfolioId)) return null;
    return Array.from(selectedProjects).indexOf(portfolioId) + 1;
  };

  useEffect(() => {
    if (editingTask && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTask]);

  const isUpdating = updateMainTask.isPending;

  // 카테고리 정규화 유틸은 다른 곳에서 사용 중이므로 여기서는 제거 (미사용 경고 방지)

  return (
    <div
      className={`grid grid-cols-2 ${
        isProjectSelectPage
          ? 'max-lg:w-full gap-x-[24px] gap-y-[24px]'
          : 'max-lg:w-[868px] gap-[24px]'
      }${!isMyPage ? ' max-lg:grid-cols-1' : ''}`}
    >
      {(isProjectSelectPage
        ? (selectable || []).map((p) => ({
            projectId: p.id,
            portfolioId: p.id,
            projectName: p.name,
            category: 'PROJECT',
            contributionRate: 0,
            startDate: p.createdAt,
            endDate: p.updatedAt,
            mainTask: '',
          }))
        : data?.data || []
      ).map((item: MasterPortfolio) => (
        <Link
          key={item.portfolioId}
          href={isProjectSelectPage ? '#' : `/mypage/aimasterportfolio/${item.portfolioId}`}
        >
          {(() => {
            const masterProjectIdSet = new Set(
              (data?.data || []).map((mp: MasterPortfolio) => Number(mp.projectId))
            );
            const isDisabledOnSelectPage =
              isProjectSelectPage && !masterProjectIdSet.has(Number(item.projectId));
            return (
              <button
                className={`relative w-[465px] h-[192px] rounded-[8px] grid justify-center cursor-pointer transition-all duration-100 ${
                  !isProjectSelectPage && 'max-lg:w-[421px] max-lg:h-[180px]'
                } ${
                  isProjectSelectPage && selectedProjects.has(item.portfolioId)
                    ? 'bg-[#81D7D41A] border-3 border-[#81D7D4]'
                    : 'bg-[#F8F8F8]'
                }`}
                style={{
                  boxShadow:
                    isProjectSelectPage && selectedProjects.has(item.portfolioId)
                      ? '0px 0px 8px 0px #81D7D466'
                      : '0px 0px 4px 0px #00000033',
                }}
                onClick={(e) => {
                  // 주요 업무 영역이 편집 중이면 Link 클릭을 막음
                  if (editingTask === item.portfolioId) {
                    e.preventDefault();
                    e.stopPropagation();
                  } else {
                    if (isDisabledOnSelectPage) {
                      e.preventDefault();
                      e.stopPropagation();
                      return;
                    }
                    handleProjectSelect(item.portfolioId, e);
                  }
                }}
              >
                {isDisabledOnSelectPage && (
                  <div className="absolute inset-0 rounded-[8px] bg-[#0000001A]" />
                )}
                <div
                  className="relative bg-white w-[439px] h-[48px] rounded-[4px] border-[1px] border-[#E7E7E7] flex flex-col justify-center mt-[12px] mx-[13px]
              max-lg:w-[397px] max-lg:h-[40px] max-lg:ml-[12px]"
                >
                  <p className="absolute text-[18px] left-[12px] max-lg:text-[16px] truncate max-w-[60%]">
                    {item.projectName}
                  </p>
                  <div
                    className={`absolute right-[8px] w-[80px] h-[32px] rounded-[4px] flex items-center justify-center max-lg:right-[4px]`}
                    style={{
                      backgroundColor:
                        CATEGORY_MAP[item.category as keyof typeof CATEGORY_MAP]?.color ||
                        '#C8C8C8',
                    }}
                  >
                    <span className="text-[16px]">
                      {CATEGORY_MAP[item.category as keyof typeof CATEGORY_MAP]?.label ||
                        item.category}
                    </span>
                  </div>
                </div>

                <div className="relative w-[439px] h-[96px] mx-[13px] pt-[16px] pb-[20px] mt-[-36px] max-lg:w-[397px] max-lg:h-[96px] max-lg:ml-[12px]">
                  {isDisabledOnSelectPage && (
                    <div className="absolute left-[60px] bg-[#F8F8F8] border border-[#BBBBBB] rounded-[6px] px-[20px] py-[6px] text-[#505050] text-[14px]">
                      마스터 포트폴리오가 작성되지 않은 프로젝트입니다.
                    </div>
                  )}
                  {isProjectSelectPage && selectedProjects.has(item.portfolioId) && (
                    <div className="absolute -bottom-[24px] -right-[0px] w-[28px] h-[28px] bg-[#505050] rounded-[4px] flex items-center justify-center">
                      <span className="text-white text-[16px] font-bold">
                        {getSelectionOrder(item.portfolioId)}
                      </span>
                    </div>
                  )}
                  <div className="flex mb-[12px] items-center">
                    <div className="text-[16px] text-[#505050] mr-[38px] ml-[12px] ">기여도</div>
                    <div className="text-[16px] text-black mr-[24px]">{item.contributionRate}%</div>
                    <div
                      className=" bg-white border border-[#E7E7E7] rounded-[2px] w-[286px] h-[10px]
                max-lg:w-[248px]"
                    >
                      <div
                        className="bg-[#81D7D4] rounded-[2px] h-[8px]"
                        style={{ width: `${item.contributionRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex mb-[12px]">
                    <div className="text-[16px] text-[#505050] mr-[20px] ml-[12px] ">진행 기간</div>
                    <div className="text-[16px] text-black truncate flex-1 text-left">
                      {formatDateRange(item.startDate, item.endDate)}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[16px] text-[#505050] mr-[20px] ml-[12px] ">주요 업무</div>
                    {editingTask === item.portfolioId ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleTaskKeyDown(e, item.portfolioId)}
                        onBlur={() => handleTaskBlur(item.portfolioId)}
                        className="text-[16px] text-black bg-transparent focus:outline-none flex-1 text-left h-6"
                        placeholder="담당한 업무를 짧게 요약해서 입력해주세요"
                        disabled={isUpdating}
                      />
                    ) : (
                      <div
                        className={`text-[16px] truncate flex-1 px-1 py-1 rounded transition-colors text-left h-6 flex items-center ${
                          isUpdating
                            ? 'cursor-not-allowed opacity-50'
                            : isProjectSelectPage
                              ? 'cursor-default'
                              : 'cursor-pointer hover:bg-gray-100'
                        }`}
                        onClick={(e) => {
                          if (isUpdating || isProjectSelectPage) return;
                          e.preventDefault();
                          e.stopPropagation();
                          handleTaskClick(item.portfolioId, item.mainTask);
                        }}
                      >
                        <span className={item.mainTask ? 'text-black' : 'text-[#898989]'}>
                          {item.mainTask || '담당한 업무를 짧게 요약해서 입력해주세요'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })()}
        </Link>
      ))}
    </div>
  );
}
