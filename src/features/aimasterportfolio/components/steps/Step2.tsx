'use client';

import { useState } from 'react';
import MeetingLogModal from '../MeetingLogModal';

export default function Step2() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedLogContent, setSelectedLogContent] = useState('');
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const toggleCardSelection = (index: number) => {
    setSelectedIndexes((prev) => {
      const alreadySelected = prev.includes(index);

      if (alreadySelected) {
        // 선택 해제
        return prev.filter((i) => i !== index);
      } else {
        // 최대 8개까지만 선택
        if (prev.length >= 8) return prev;
        return [...prev, index];
      }
    });
  };

  const length = selectedIndexes.length;

  return (
    <div className="flex flex-col gap-[16px] items-center">
      <div>
        <strong>
          포트폴리오 생성 시에 참고하면 좋을 회의록이 있다면 최대 8개까지 선택해주세요.
        </strong>
        <br />
        아래 내용들이 포함된 회의록이 있다면, 생성에 큰 도움이 돼요!
        <br />
        <br />
        <ul className="list-disc list-inside">
          <li>프로젝트 시작 배경, 해결하고자 한 문제, 전하고자 한 메세지 또는 컨셉</li>
          <li>역할별 인원 구성, 협업 파트 구성</li>
          <li>시작 전, 목표로 한 수치화된 지표</li>
          <li>실제로 달성한 정량적 성과와 받은 피드백</li>
          <li>어려웠던 점과 극복한 방법</li>
        </ul>
        <br />
        회의록은 필수로 선택하지 않아도 되지만, 양질의 회의록이 많다면 좋은 마스터 포트폴리오를 생성할 수 있어요.
        제가 참고할 회의록을 모두 선택하셨다면, 생성을 시작할게요!
      </div>

      <div className="w-fit flex flex-col justify-center items-center border-[2px] border-[#81D7D4] bg-[#DAF3F3] rounded-[100px] py-[16px] px-[36px]">
        <h3 className="text-[#000000] text-[20px] max-lg:text-[18px] leading-[28px] max-lg:leading-[26px] font-normal tracking-[0.8px]">
          생성 시 최대 <strong>N Credit</strong>이 사용됩니다
        </h3>
        <p className="text-[#898989] text-[14px] leading-[22px]">
          {length}개의 회의록이 선택되었습니다.
        </p>
      </div>

      {Number(length) === 0 ? (
        <div className="bg-[#F8F8F8] rounded-[8px] shadow-[0_0_4px_rgba(0,0,0,0.20)] px-[16px] py-[24px] text-[#505050] text-center min-w-[660px] mt-8">
          OOO님이 참석한 일정에 작성된 회의록이 없어요.
          <br /> 회의록 없이 마스터 포트폴리오를 생성할게요.
        </div>
      ) : (
        <div className="w-full max-lg:w-[475px] max-lg:h-[512px] border-[1.5px] border-[#898989] rounded-[20px] p-[16px] max-h-[512px] overflow-y-auto">
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[16px]">
            {Array.from({ length: 6 }).map((_, index) => {
              const isSelected = selectedIndexes.includes(index);

              return (
                <div key={index} className="flex flex-col gap-[8px]">
                  <div
                    onClick={() => toggleCardSelection(index)}
                    className={`flex flex-col w-full max-lg:w-[419px] rounded-[8px] p-[16px] cursor-pointer shadow-[0_0_4px_rgba(0,0,0,0.25)]
                      ${isSelected ? 'bg-[#DAF3F3] border-[2px] border-[#81D7D4]' : 'bg-[#F8F8F8] border border-transparent'}
                    `}
                  >
                    <div className="p-2 rounded-[4px] border border-[#E7E7E7] bg-white text-black text-[18px] leading-[26px] font-normal tracking-[0.72px]">
                      3주차 정기 회의
                    </div>

                    <div className="w-full flex gap-[14px] mt-[8px]">
                      <div className="flex-1 text-[#898989] text-[14px] leading-[22px] font-normal tracking-[0.56px]">
                        일자
                      </div>
                      <div className="flex-9 text-black text-[14px] leading-[22px] font-normal tracking-[0.56px]">
                        2025.05.25
                      </div>
                    </div>

                    <div className="w-full flex gap-[8px] mt-[8px]">
                      <div className="flex-1 text-[#898989] text-[14px] leading-[22px] font-normal tracking-[0.56px] whitespace-pre">
                        회의록
                      </div>

                      <div
                        className="relative group flex-9 rounded-[4px] border border-[#E7E7E7] bg-white text-black text-[14px] leading-[22px] font-normal tracking-[0.56px] whitespace-pre-wrap px-[12px] py-[4px] overflow-hidden"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        <div className="absolute inset-0 bg-[rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-[4px]" />
                        내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용...
                        <button
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-[12px] py-[4px] text-[14px] font-semibold rounded-[4px] shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                          onClick={(e) => {
                            e.stopPropagation(); // 카드 클릭 방지
                            setSelectedLogContent('...');
                            setOpenModal(true);
                          }}
                        >
                          회의록 보기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <MeetingLogModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="일정A"
        date="2025.05.25"
        content={selectedLogContent}
      />
    </div>
  );
}
