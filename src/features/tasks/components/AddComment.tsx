import { useState } from 'react';
import useToggle from '../hooks/useToggle';
import CommentMenuDropdown from './CommentDropdown';

export default function AddComment() {
  // 버튼을 눌렀을 때 댓글 추가
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [replyToIndex, setReplyToIndex] = useState<number | null>(null);
  const [replyComments, setReplyComments] = useState<{ [key: number]: string }>({});

  // 토글 on일 때만 댓글 목록이 보임
  const { isOn, toggle } = useToggle();

  const handleComment = () => {
    if (comment.trim() === '') return;

    setComments((prev) => [comment, ...prev]); // 기존 댓글 앞에 추가: 최신 댓글이 위에 오도록 함
    setComment(''); // 입력창 초기화
  };

  const handleReplyChange = (idx: number, value: string) => {
    setReplyComments((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  const handleReplySubmit = (idx: number) => {
    if (!replyComments[idx] || replyComments[idx].trim() === '') return;
    // 대댓글 전송 후 입력 필드 초기화 및 replyToIndex 초기화
    setReplyComments((prev) => ({
      ...prev,
      [idx]: prev[idx].trim(),
    }));
    setReplyToIndex(null);
  };

  return (
    <>
      {/* 댓글 입력 필드 */}
      <div className="flex flex-row mt-[83px] ml-[135px] items-center">
        <img className="mr-[20px]" src="/icons/comment-profile.svg" alt="댓글프로필" />
        <div className="relative">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="p-[20px] w-[1109px] h-[50px]  bg-white rounded-[8px] border-[2px] border-[#BBBBBB] "
            placeholder="댓글을 작성하세요"
          />
          <button
            onClick={handleComment}
            className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] cursor-pointer"
          >
            <img src="/icons/comment-enter.svg" alt="전송" />
          </button>
        </div>
        <p className="ml-[20px] text-[18px] ">활동 기록 보기</p>
        <button onClick={toggle}>
          <img
            src={isOn ? '/icons/toggle-on.svg' : '/icons/toggle-off.svg'}
            alt="토글 아이콘"
            className="w-[48px] h-[24px] ml-[8px]"
          />
        </button>
      </div>

      {/* 댓글 목록 */}
      {isOn &&
        comments.map((cmt, idx) => (
          <div key={idx} className="mt-[40px] ml-[135px]">
            <div className="flex items-center mb-[8px]">
              <div className="flex flex-col items-center mr-[20px]">
                <img src="/icons/comment-profile.svg" alt="댓글프로필" />
                <div className="text-[12px] text-black mt-[2px]">Teamie</div>
              </div>
              <div className="flex flex-col">
                <div className="relative">
                  <div className="bg-[#F8F8F8] rounded-[8px] w-[1288px] min-h-[46px] pl-[12px] py-[10px]">
                    {cmt}
                  </div>
                  <CommentMenuDropdown
                    onSelect={(action) => {
                      if (action === 'reply') {
                        setReplyToIndex(idx);
                      } else {
                        console.log(action);
                        setReplyToIndex(null);
                      }
                    }}
                  />
                </div>
                <div className="text-[#898989] text-[12px] ml-[12px] mt-[4px]">
                  {new Date().toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </div>
              </div>
            </div>
            {/* 대댓글 입력 필드 */}
            {replyToIndex === idx && (
              <div className="flex items-start ml-[20px] ">
                <img
                  src="/icons/arrow-reply.svg"
                  alt="대댓글 화살표"
                  className="w-[24px] h-[24px] mr-[20px] mt-[20px]"
                />
                <img
                  className="mr-[20px] mt-[10px]"
                  src="/icons/comment-profile.svg"
                  alt="댓글프로필"
                />
                <div className="relative w-[1224px] mt-[10px]">
                  <input
                    value={replyComments[idx] || ''}
                    onChange={(e) => handleReplyChange(idx, e.target.value)}
                    className="rounded-[8px] w-[1224px] min-h-[46px] pl-[12px] py-[10px] bg-white border-[2px] border-[#BBBBBB]"
                    placeholder="댓글을 작성하세요"
                  />
                  <button
                    onClick={() => handleReplySubmit(idx)}
                    className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] cursor-pointer"
                  >
                    <img src="/icons/comment-enter.svg" alt="대댓글 전송" />
                  </button>
                </div>
              </div>
            )}
            {/* 대댓글 출력 */}
            {replyComments[idx] && replyToIndex !== idx && (
              <div className="flex items-start ml-[20px] ">
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
                  <div className="bg-[#F8F8F8] rounded-[8px] w-[1224px] min-h-[46px] ml-[10px] pl-[12px] py-[10px]">
                    {replyComments[idx]}
                  </div>
                  <div className="text-[#898989] text-[12px] ml-[24px] mt-[4px]">
                    {new Date().toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
    </>
  );
}
