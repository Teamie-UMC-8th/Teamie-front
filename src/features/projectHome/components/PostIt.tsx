'use client';

export default function PostIt() {
  return (
    <div>
      <img src="/icons/Post-it.svg" alt="게시판 포스트잇" className="absolute" />
      <img
        src="/icons/delete_steps.svg"
        alt="삭제 아이콘"
        className="relative w-[16px] h-[16px] cursor-pointer ml-[100px] translate-y-[4px]"
        onClick={() => {}}
      />
    </div>
  );
}
