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
        <img src="/icons/delete.svg" alt="삭제" className="mt-[28px]" />
      </div>

      {/* Divider line */}
      <div className="mt-[10px] ml-[88px] border-[#E7E7E7] border-[1px] " />

      <div>
        <div className="flex flex-row mt-[60px] ml-[128px] items-center">
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px]">
            마감 기한
          </div>
          <img src="/icons/deadline-calendar.svg" alt="마감기한" className="ml-[28px]" />
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] ml-[160px]">
            담당자
          </div>
          <img src="/icons/plus-circle.svg" alt="담당자" className="ml-[28px]" />
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] ml-[160px]">
            진행상태
          </div>
          <div className="w-[80px] h-[34px] bg-[#E7E7E7] grid place-items-center rounded-[4px] gap-[10px] ml-[28px]">
            시작전
          </div>
          <img src="/icons/drop-down.svg" alt="진행상태" className="ml-[4px]" />
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

        <div className="flex flex-row mt-[83px] ml-[183px] items-center">
          <img className="mr-[20px]" src="/icons/comment-profile.svg" alt="댓글프로필" />
          <div className="relative">
            <input
              className="p-[20px] w-[1109px] h-[50px]  bg-white rounded-[8px] border-[2px] border-[#BBBBBB] "
              placeholder="댓글을 작성하세요"
            />
            <img
              className="absolute right-[7px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] cursor-pointer"
              src="/icons/comment-enter.svg"
              alt="전송"
            />
          </div>
          <p className="ml-[20px] text-[18px] ">활동 기록 보기</p>
          <img className="pl-[8px]" src="/icons/toggledesign.svg" alt="활동기록" />
        </div>
      </div>
    </div>
  );
}
