'use client';
import AddProfileButton from '@/components/AddProfileButton';
import DeleteButton from '@/components/DeleteButton';
import AddComment from '@/features/tasks/components/AddComment';
import CommentToggle from '@/features/tasks/components/CommentToggle';
import TaskDropdown from '@/features/tasks/components/TaskDropdown';

export default function taskDetailPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="/icons/arrow-left.svg"
            alt="뒤로가기"
            className="mt-[29px] ml-[48px] mr-[20px]"
          />
          <h1 className="text-[24px] text-[#898989] font-semibold mt-[28px]">
            업무명을 입력해주세요.
          </h1>
        </div>
        <DeleteButton onDelete={() => {}} />
      </div>

      {/* Divider line */}
      <div className="mt-[10px] ml-[88px] border-[#E7E7E7] border-[1px] " />

      <div>
        <div className="flex flex-row mt-[60px] ml-[128px] items-center">
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px]">
            마감 기한
          </div>
          <img src="/icons/deadline-calendar.svg" alt="마감기한" className="ml-[28px]" />
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] ml-[160px] mr-[28px]">
            담당자
          </div>
          <AddProfileButton />
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] ml-[160px]">
            진행상태
          </div>
          <TaskDropdown />
        </div>

        <div className="flex flex-row mt-[40px] ml-[128px]">
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px]">
            첨부파일
          </div>
          <div className="w-[207px] h-[160px] border-[2px] rounded-[6px] border-[#BBBBBB] grid place-items-center ml-[28px] ">
            <img src="/icons/file-upload.svg" alt="파일 업로드" />
          </div>
        </div>

        <div className="flex flex-row mt-[40px] ml-[128px]">
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px]">
            비고
          </div>
          <div className="w-[1109px] h-[84px] border-[2px] rounded-[6px] border-[#BBBBBB] grid place-items-center ml-[28px] "></div>
        </div>

        <AddComment />
      </div>
    </div>
  );
}
