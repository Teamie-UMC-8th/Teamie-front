'use client';

import { useState } from 'react';

interface StepItem {
  id: number;
  title: string;
  status: '시작 전' | '진행 중' | '완료';
  deadline: string;
  assignee?: string;
}

interface Step {
  id: number;
  name: string;
  items: StepItem[];
}

const initialSteps: Step[] = [
  {
    id: 1,
    name: '기획',
    items: [
      {
        id: 1,
        title: '기획서 초안 작성',
        status: '진행 중',
        deadline: '2024-05-04',
        assignee: '홍길동',
      },
      {
        id: 2,
        title: '요구사항 정리',
        status: '시작 전',
        deadline: '2024-05-07',
      },
    ],
  },
  {
    id: 2,
    name: '디자인',
    items: [
      {
        id: 3,
        title: '와이어프레임 제작',
        status: '완료',
        deadline: '2024-05-10',
        assignee: '김디자이너',
      },
    ],
  },
];

export default function DashboardPage() {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [openStepIds, setOpenStepIds] = useState<number[]>([]);

  const toggleStep = (id: number) => {
    setOpenStepIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const addStep = () => {
    const newId = steps.length ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    // TODO: 이름 설정할 수 있도록
    setSteps([...steps, { id: newId, name: `새 STEP ${newId}`, items: [] }]);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '마감일 없음';

    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '마감일 없음';

    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${month}월 ${day}일`;
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <header className="flex items-center justify-between mb-[16px] px-[8px]">
        <h1 className="text-[24px] font-bold">업무 대시보드</h1>
        <div className="flex items-center gap-3">
          <div className="w-[332px] h-[39px] flex items-center px-[10px] py-[6px] justify-between bg-[#E7E7E7] rounded-[4px]">
            <input
              type="text"
              placeholder="검색어를 입력하세요."
              className="rounded text-[18px] pl-[2px] text-[#898989]"
            />
            <img src="/icons/search.svg" className="w-[28px] h-[28px]" />
          </div>
          <button>
            <img src="/icons/filter.svg" className="w-[32px] h-[32px]" />
          </button>
        </div>
      </header>
      <div className="border-t-[2px] px-[8px] py-[20px] border-[#E7E7E7]">
        <div className="inline-flex items-center p-[4px] bg-[#F8F8F8] border border-[#E7E7E7] rounded-[4px]">
          <button className="bg-[#81D7D4] text-white px-4 py-1 rounded font-semibold text-[18px]">
            STEP 별로 보기
          </button>
          <button className="bg-[#F8F8F8] text-gray-700 px-4 py-1 rounded font-semibold text-[18px]">
            진행 상태별로 보기
          </button>
        </div>
      </div>
      <main className="flex-1 overflow-x-auto">
        <div className="grid grid-cols-4 gap-x-[36px] gap-y-[60px] mt-[40px] px-[35px]">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col">
              <div className="flex bg-[#DAF3F3] w-[325px] h-[68px] items-center justify-between rounded-[8px]">
                <span className="font-medium text-[18px] mx-auto">{step.name}</span>
                <button onClick={() => toggleStep(step.id)}>
                  <img
                    src="/icons/arrow-down.svg"
                    alt="화살표"
                    className={`w-[32px] h-[32px] mr-[4px] transition-transform ${openStepIds.includes(step.id) ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
              {openStepIds.includes(step.id) && (
                <div className="flex flex-col gap-3 mt-6">
                  {step.items.length === 0 && <div></div>}
                  {step.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white w-[325px] h-[122px] rounded-[8px] border border-[#BBBBBB] p-4 flex items-start gap-3"
                    >
                      <label className="inline-flex items-center flex-shrink-0 mt-1">
                        <input
                          type="checkbox"
                          className="peer appearance-none w-[20px] h-[20px] border-2 border-[#898989] rounded bg-white checked:bg-[#81D7D4]"
                        />
                        <svg
                          className="hidden peer-checked:block -ml-5 pointer-events-none"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          stroke="white"
                          strokeWidth="3"
                          fill="none"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </label>

                      <div className="flex flex-col flex-1 gap-[10px]">
                        <div className="font-normal text-[16px] text-black mt-[1px]">
                          {item.title}
                        </div>

                        <div className="flex items-center justify-between gap-[2px] text-[14px] text-[#898989]">
                          {formatDate(item.deadline) === '마감일 없음' ? (
                            <span>마감일 없음</span>
                          ) : (
                            <span>{formatDate(item.deadline)}까지</span>
                          )}
                          <div
                            className={`flex items-center justify-center px-2 py-0.5 w-[63px] h-[22px] rounded-full font-semibold ${
                              item.status === '진행 중'
                                ? 'bg-[#B6F5DF] text-[#505050]'
                                : item.status === '완료'
                                  ? 'bg-[#D1D5DB] text-[#505050]'
                                  : 'bg-[#E7E7E7] text-[#505050]'
                            }`}
                          >
                            {item.status}
                          </div>
                        </div>

                        {item.assignee && (
                          <div className="mt-auto">
                            <div
                              className="inline-flex items-center gap-[4px] rounded-[30px] p-[3px] pr-[9px]"
                              style={{ boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.25)' }}
                            >
                              <img
                                src="/icons/assignee.svg"
                                alt="참석자 아이콘"
                                className="w-[16px] h-[16px]"
                              />
                              <span className="text-[12px]">{item.assignee}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    className="flex bg-[#FFFFFF] text-[#898989] w-[325px] h-[44px] items-center justify-center rounded-[8px] text-[16px] mt-[8px] border border-[#BBBBBB] border-[1.5px]"
                    onClick={() => alert(`${step.name}에 새 업무 추가`)}
                  >
                    + 업무 추가
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={addStep}
            className="flex bg-[#F8F8F8] text-[#898989] w-[325px] h-[68px] items-center justify-center rounded-[8px] font-medium text-[18px]"
          >
            + STEP 추가
          </button>
        </div>
      </main>
    </div>
  );
}
