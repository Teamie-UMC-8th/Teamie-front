import React from 'react';

type Props = {
  idx: number; // 댓글 구분
  replyToIndex: number | null; // 대댓글이 달리는 댓글의 인덱스
  replyValue: string; // 대댓글 입력값
  submittedReply?: string; // 제출된 대댓글
  onChange: (idx: number, value: string) => void; // 대댓글 입력값 변경 핸들러
  onSubmit: (idx: number) => void; // 대댓글 제출 핸들러
  formatDate: () => string; // 날짜 포맷 함수
};

export default function ReplyComment({
  idx,
  replyToIndex,
  replyValue,
  submittedReply,
  onChange,
  onSubmit,
  formatDate,
}: Props) {
  // 현재 댓글이 대댓글 입력 중인 댓글이라면, 입력 필드를 렌더링
  if (replyToIndex === idx) {
    return (
      <div className="flex items-start ml-[20px] w-[1340px]">
        <img
          src="/icons/arrow-reply.svg"
          alt="대댓글 화살표"
          className="w-[24px] h-[24px] mr-[20px] mt-[20px]"
        />
        <img
          className="mr-[20px] mt-[10px] min-w-[48px]"
          src="/icons/comment-profile.svg"
          alt="댓글프로필"
        />
        <div className="relative w-[1224px] mt-[10px]">
          <input
            value={replyValue}
            onChange={(e) => onChange(idx, e.target.value)}
            className="rounded-[8px] w-[1224px] min-h-[46px] pl-[12px] py-[10px] bg-white border-[2px] border-[#BBBBBB]
            max-lg:w-[671px]"
            placeholder="댓글을 작성하세요"
          />
          <button
            onClick={() => onSubmit(idx)}
            className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] cursor-pointer
            max-lg:translate-x-[-550px]"
          >
            <img src="/icons/comment-enter.svg" alt="대댓글 전송" />
          </button>
        </div>
      </div>
    );
  }

  // 제출된 대댓글이 있을 경우 출력 UI 렌더링
  if (submittedReply) {
    return (
      <div className="flex items-start ml-[20px] w-[1340px] ">
        <img
          src="/icons/arrow-reply.svg"
          alt="대댓글 화살표"
          className="w-[24px] h-[24px] mr-[20px] mt-[20px]"
        />
        <div className="flex flex-col items-center mr-[12px] mt-[10px]">
          <img src="/icons/comment-profile.svg" alt="프로필" />
          <div className="text-[12px] text-black mt-[2px]">김티미</div>
        </div>
        <div className="flex flex-col mt-[12px]">
          <div
            className="bg-[#F8F8F8] rounded-[8px] w-[1224px] min-h-[46px] ml-[10px] pl-[12px] py-[10px]
          max-lg:w-[671px]"
          >
            {submittedReply}
          </div>
          <div className="text-[#898989] text-[12px] ml-[24px] mt-[4px]">{formatDate()}</div>
        </div>
      </div>
    );
  }

  // 아무것도 해당하지 않으면 렌더링하지 않음
  return null;
}
