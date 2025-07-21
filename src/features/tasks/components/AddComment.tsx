import { useState } from 'react';
import useToggle from '../hooks/useToggle';
import CommentMenuDropdown from './CommentDropdown';
import EditComment from './EditComment';
import ReplyComment from './ReplyComment';
import { deleteComment } from './DeleteComment';

export default function AddComment() {
  // 댓글 입력 상태 관리
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [replyToIndex, setReplyToIndex] = useState<number | null>(null);
  const [replyComments, setReplyComments] = useState<{ [key: number]: string }>({});
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editComment, setEditComment] = useState('');

  // 토글 제어
  const { isOn, toggle } = useToggle();

  // 댓글 추가 함수
  const handleComment = () => {
    if (newComment.trim() === '') return;

    setComments((prev) => [newComment, ...prev]); // 기존 댓글 앞에 추가: 최신 댓글이 위에 오도록 함
    setNewComment(''); // 입력창 초기화
  };

  // 대댓글 작성 처리
  const handleReplyChange = (idx: number, value: string) => {
    setReplyComments((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  // 대댓글 제출 처리
  const handleReplySubmit = (idx: number) => {
    if (!replyComments[idx] || replyComments[idx].trim() === '') return;
    // 대댓글 전송 후 입력 필드 초기화 및 replyToIndex 초기화
    setReplyComments((prev) => ({
      ...prev,
      [idx]: prev[idx].trim(),
    }));
    setReplyToIndex(null);
  };

  // 날짜 포맷 함수
  const formatDate = () =>
    new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  return (
    <>
      {/* 댓글 입력 UI */}
      <div
        className="flex flex-row mt-[83px] ml-[95px] items-center
      max-lg:ml-[79px]"
      >
        <img className="mr-[20px]" src="/icons/comment-profile.svg" alt="댓글프로필" />
        <div className="relative">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="p-[20px] w-[1109px]  h-[50px]  bg-white rounded-[8px] border-[2px] border-[#BBBBBB]
            max-lg:w-[735px]"
            placeholder="댓글을 작성하세요"
          />

          <button
            onClick={handleComment}
            className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] cursor-pointer"
          >
            <img src="/icons/comment-enter.svg" alt="전송" />
          </button>
        </div>
        <div
          className="flex ml-[20px] justify-center min-w-fit
        max-lg:translate-y-[-48px] max-lg:translate-x-[-186px]"
        >
          <p className=" mr-[8px] text-[18px]">활동 기록 보기</p>
          <button onClick={toggle}>
            <img
              src={isOn ? '/icons/toggle-on.svg' : '/icons/toggle-off.svg'}
              alt="토글 아이콘"
              className="w-[48px] h-[24px]"
            />
          </button>
        </div>
      </div>

      {/* 댓글 출력 UI 및 수정/삭제/대댓글 기능 */}
      {isOn &&
        comments.map((cmt, idx) => (
          <div
            key={idx}
            className="mt-[40px] ml-[95px]
          max-lg:ml-[103px] max-lg:mt-[32px]"
          >
            <div className="flex items-center mb-[8px] w-[1360px]">
              <div className="flex flex-col items-center mr-[20px]">
                <img src="/icons/comment-profile.svg" alt="댓글프로필" className="min-w-fit" />
                <div className="text-[12px] text-black mt-[2px]">Teamie</div>
              </div>
              <div className="flex flex-col">
                <div className="relative">
                  {/* 댓글 수정 및 삭제 처리 */}
                  {editIndex === idx ? (
                    <EditComment
                      value={editComment}
                      onChange={setEditComment}
                      onSubmit={() => {
                        if (editComment.trim() === '') return;
                        const updated = [...comments];
                        updated[idx] = editComment.trim();
                        setComments(updated);
                        setEditComment('');
                        setEditIndex(null);
                      }}
                    />
                  ) : (
                    <div
                      className="bg-[#F8F8F8] rounded-[8px] w-[1288px] min-h-[46px] pl-[12px] py-[10px] min-w-fit
                    max-lg:w-[735px]"
                    >
                      {cmt}
                    </div>
                  )}
                  {/* 댓글 드롭다운 메뉴 */}
                  {editIndex !== idx && (
                    <CommentMenuDropdown
                      onSelect={(action) => {
                        if (action === 'reply') {
                          setReplyToIndex(idx);
                          setEditIndex(null);
                        } else if (action === 'edit') {
                          setEditComment(comments[idx]);
                          setEditIndex(idx);
                          setReplyToIndex(null);
                        } else if (action === 'delete') {
                          const [newComments, newReplies] = deleteComment(
                            idx,
                            comments,
                            replyComments
                          );
                          setComments(newComments);
                          setReplyComments(newReplies);
                          setReplyToIndex(null);
                          setEditIndex(null);
                        } else {
                          setReplyToIndex(null);
                          setEditIndex(null);
                        }
                      }}
                    />
                  )}
                </div>
                <div className="text-[#898989] text-[12px] ml-[12px] mt-[4px]">{formatDate()}</div>
              </div>
            </div>
            {/* 대댓글 입력 및 출력 UI */}
            <ReplyComment
              idx={idx}
              replyToIndex={replyToIndex}
              replyValue={replyComments[idx] || ''}
              submittedReply={
                replyComments[idx] && replyToIndex !== idx ? replyComments[idx] : undefined
              }
              onChange={handleReplyChange}
              onSubmit={handleReplySubmit}
              formatDate={formatDate}
            />
          </div>
        ))}
    </>
  );
}
