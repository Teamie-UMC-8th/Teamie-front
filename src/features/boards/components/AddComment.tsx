import { useState } from 'react';
import CommentToggle from './CommentToggle';

export default function AddComment() {
  // 버튼을 눌렀을 때 댓글 추가
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);

  const handleComment = () => {
    if (comment.trim() === '') return;

    setComments((prev) => [...prev, comment]); // 기존 댓글 뒤에 추가
    setComment(''); // 입력창 초기화
  };

  return (
    <>
      <div className="flex flex-row mt-[83px] ml-[183px] items-center">
        <img className="mr-[24px]" src="/icons/comment-profile.svg" alt="댓글프로필" />
        <div className="relative">
          <input
            className="p-[20px] w-[1109px] h-[50px]  bg-white rounded-[8px] border-[2px] border-[#BBBBBB] "
            placeholder="댓글을 작성하세요"
          />
          <button className="absolute right-[7px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] cursor-pointer">
            <img src="/icons/comment-enter.svg" alt="전송" />
          </button>
        </div>
        <p className="ml-[20px] text-[18px] ">활동 기록 보기</p>
        <CommentToggle />
      </div>

      {/* 댓글 목록 */}
      <div className="flex mt-[40px] ml-[183px] items-center">
        <div className="flex flex-col items-center mr-[24px]">
          <img src="/icons/comment-profile.svg" alt="댓글프로필" />
          <div className="text-[12px] text-black mt-[2px]">두현우</div>
        </div>
        <div className="flex flex-col ">
          <div className="relative">
            <div className="bg-[#F8F8F8] rounded-[8px] w-[1288px] h-[46px] pl-[12px] py-[10px]">
              댓글 영역
            </div>
            <button className="absolute right-[8px] top-1/2 -translate-y-1/2 cursor-pointer">
              <img src="/icons/comment-dropdown.svg" alt="댓글 드롭다운" />
            </button>
          </div>
          <div className="text-[#898989] text-[12px] ml-[12px]">현재 시간</div>
        </div>
      </div>
    </>
  );
}
