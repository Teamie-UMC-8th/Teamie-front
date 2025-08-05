'use client';

import { useMasterPortfolioList } from '@/hooks/mutations/useMasterPortfolio';
import { useUpdateMainTask } from '@/hooks/mutations/useUser';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { formatDateRange } from '@/utils/formatDate';
import { useState, useRef, useEffect } from 'react';

export default function Projects() {
  const pathname = usePathname();
  const isAnalyzeFinPage = pathname === '/mypage/addcorrection/projectSelect';
  const isMyPage = pathname === '/mypage';
  const { data } = useMasterPortfolioList();
  const updateMainTask = useUpdateMainTask();

  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
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

  useEffect(() => {
    if (editingTask && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTask]);

  const isUpdating = updateMainTask.isPending;

  return (
    <div className={`grid grid-cols-2 gap-[24px] ${!isMyPage ? 'max-lg:grid-cols-1' : ''}`}>
      {data?.data.map((item) => (
        <Link key={item.portfolioId} href={`/mypage/aimasterportfolio/${item.portfolioId}`}>
          <button
            className={`bg-[#F8F8F8] w-[465px] h-[192px] rounded-[8px] grid justify-center cursor-pointer ${
              !isAnalyzeFinPage && 'max-lg:w-[421px] max-lg:h-[180px]'
            }`}
            style={{ boxShadow: '0px 0px 4px 0px #00000033' }}
            onClick={(e) => {
              // 주요 업무 영역이 편집 중이면 Link 클릭을 막음
              if (editingTask === item.portfolioId) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <div
              className="relative bg-white w-[439px] h-[48px] rounded-[4px] border-[1px] border-[#E7E7E7] flex flex-col justify-center mt-[12px] mx-[13px]
              max-lg:w-[397px] max-lg:h-[40px] max-lg:ml-[12px]"
            >
              <p className="absolute text-[18px] left-[12px] max-lg:text-[16px] truncate max-w-[60%]">
                {item.projectName}
              </p>
              <div
                className={`absolute right-[8px] ${
                  item.category === '동아리' ? 'bg-[#CDE3C9]' : 'bg-[#FBD5D5]'
                } w-[80px] h-[32px] rounded-[4px] flex items-center justify-center max-lg:right-[4px]`}
              >
                <span className="text-[16px]">{item.category}</span>
              </div>
            </div>

            <div className="w-[439px] h-[96px] mx-[13px] pt-[16px] pb-[20px] mt-[-36px] max-lg:w-[397px] max-lg:h-[96px] max-lg:ml-[12px]">
              <div className="flex mb-[12px]">
                <div className="text-[16px] text-[#505050] mr-[38px] ml-[12px] ">기여도</div>
                <div className="text-[16px] text-black mr-[24px]">{item.contributionRate}%</div>
                <img src="/icons/percent-bar.svg" alt="Percent Bar" className="max-lg:w-[247px]" />
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
                        : 'cursor-pointer hover:bg-gray-100'
                    }`}
                    onClick={(e) => {
                      if (isUpdating) return;
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
        </Link>
      ))}
    </div>
  );
}
