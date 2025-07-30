'use client';

import AddProfileButton from '@/components/AddProfileButton';
import BackButton from '@/components/BackButton';
import DeleteButton from '@/components/DeleteButton';
import AddComment from '@/features/tasks/components/AddComment';
import CommentToggle from '@/features/tasks/components/CommentToggle';
import FileUploader from '@/features/tasks/components/FileUploader';
import TaskDropdown from '@/features/tasks/components/TaskDropdown';

export default function taskDetailPage() {
  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BackButton />
          <h1 className="text-[24px] text-black font-semibold">빈 일정</h1>
        </div>
        <div className="max-lg:mr-[74px]">
          <DeleteButton
            onDelete={() => {
              // 삭제 로직 작성
            }}
            modalTitle="이 일정을 정말 삭제하시겠습니까?"
            confirmText="삭제"
            cancelText="취소"
          />
        </div>
      </div>

      <div className="mt-[6px] max-lg:w-[910px] flex flex-col">
        {/* 구분선 */}
        <div className="border-[#E7E7E7] border-[1px] w-full" />
        {/* 리마인드 메세지 */}
        <div className="flex justify-end mt-[12px]">
          <div className="bg-[#81D7D4] w-[138px] h-[34px] rounded-[4px] text-white font-bold px-[12px] py-[4px] text-[18px] cursor-pointer">
            리마인드 메세지
          </div>
        </div>
      </div>

      {/* 업무 상세 정보 */}
      <div className="flex flex-col">
        <div
          className="flex mt-[40px] ml-[40px] items-center gap-[160px] w-[1100px]
        max-lg:flex-col max-lg:items-start max-lg:ml-[24px]"
        >
          {/* 마감 기한 */}
          <div className="flex items-center">
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] mr-[28px]">
              일자
            </div>
            <div className="text-[20px]">2025.01.01</div>
            <img src="/icons/deadline-calendar.svg" alt="마감기한" className="ml-[20px]" />
          </div>
          {/* 시작 시간 */}
          <div className="flex items-center">
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] mr-[28px]">
              시작 시간
            </div>
            <div className="text-[20px]">18:00</div>
            <img src="/icons/timePicker.svg" alt="타임 피커" className="ml-[20px]" />
          </div>
          {/* 마감 기한 */}
          <div className="flex items-center">
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] mr-[28px]">
              장소
            </div>
            <div className="text-[20px]">000관 000호</div>
          </div>
        </div>

        {/* 참석자 */}
        <div
          className="flex items-center ml-[40px] mt-[40px]
          max-lg:ml-[0px]"
        >
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px]  mr-[28px]">
            참석자
          </div>
          <AddProfileButton />
        </div>

        {/* 비고 */}
        <div
          className="flex flex-row mt-[40px] ml-[40px] w-[1415px]
        max-lg:ml-[24px]"
        >
          <div className="min-w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px]">
            비고
          </div>
          <textarea
            className="w-[1290px] min-w-[1109px] h-[84px] px-[20px] py-[16px] border-[2px] rounded-[6px] border-[#BBBBBB] ml-[28px] 
          max-lg:w-[735px] max-lg:min-w-[735px]"
          />
        </div>

        {/* 회의록 */}
        <div
          className="flex-col mt-[40px] ml-[40px]
        max-lg:ml-[24px]"
        >
          <div className="flex items-center">
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] mr-[28px]">
              회의록
            </div>
            <div className="border-l-[2px] border-[#898989] h-[22px]" />
            <p className="text-[18px] ml-[12px] mr-[12px]">기록자</p>
            <div className="border-l-[2px] border-[#898989] h-[22px] mr-[12px]" />
            <AddProfileButton />
          </div>
          <textarea
            className="w-[1415px] h-[428px] px-[20px] py-[16px] border-[2px] rounded-[6px] border-[#BBBBBB] mt-[15px]
          max-lg:w-[735px] max-lg:min-w-[735px]"
          />
        </div>
      </div>
    </div>
  );
}
