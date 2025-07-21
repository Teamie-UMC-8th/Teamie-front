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
      <div className="flex items-center">
        <div className="flex items-center">
          <BackButton />
          <h1 className="text-[24px] text-black font-semibold mt-[28px]">빈 업무</h1>
        </div>
        <div className="ml-[1375px] translate-y-[18px]">
          <DeleteButton
            onDelete={() => {
              // 삭제 로직 작성
            }}
            modalTitle="이 업무를 정말 삭제하시겠습니까?"
            confirmText="삭제"
            cancelText="취소"
          />
        </div>
      </div>

      {/* 구분선 */}
      <div className="mt-[10px] ml-[40px] border-[#E7E7E7] border-[1px] w-[1495px] " />

      {/* 업무 상세 정보 */}
      <div>
        <div
          className="flex mt-[60px] ml-[80px] items-center 
        max-lg:flex-col max-lg:items-start max-lg:ml-[48px]"
        >
          {/* 마감 기한 */}
          <div className="flex items-center">
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] mr-[28px]">
              마감 기한
            </div>
            <div className="text-[20px]">2025.01.01</div>
            <img src="/icons/deadline-calendar.svg" alt="마감기한" className="ml-[20px]" />
          </div>
          {/* 담당자 */}
          <div
            className="flex items-center ml-[160px]
          max-lg:ml-0 max-lg:mt-[40px]"
          >
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px]  mr-[28px]">
              담당자
            </div>
            <AddProfileButton />
          </div>
          {/* 진행 상태 */}
          <div
            className="flex items-center ml-[160px]
          max-lg:ml-0 max-lg:mt-[40px]"
          >
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] ">
              진행상태
            </div>
            <TaskDropdown />
          </div>
        </div>
        {/* 첨부파일 */}
        <div
          className="flex flex-row mt-[40px] ml-[80px]
        max-lg:ml-[48px]"
        >
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px]">
            첨부파일
          </div>
          <FileUploader />
        </div>
        {/* 비고 */}
        <div
          className="flex flex-row mt-[40px] ml-[80px]
        max-lg:ml-[48px]"
        >
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px]">
            비고
          </div>
          <textarea
            className="w-[1109px] h-[84px] px-[20px] py-[16px] border-[2px] rounded-[6px] border-[#BBBBBB] ml-[28px] 
          max-lg:w-[735px]"
          />
        </div>
        <AddComment />
      </div>
    </div>
  );
}
