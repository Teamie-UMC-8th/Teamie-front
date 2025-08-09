import { useState, useEffect } from 'react';
import {
  useAddComment,
  useGetComments,
  useAddCocomment,
  useUpdateCocomment,
} from '@/hooks/mutations/useCommentMutations';
import { useParams } from 'next/navigation';
import { useUser } from '@/hooks/mutations/useUser';
import CommentMenuDropdown from './CommentDropdown';
import EditComment from './EditComment';
import ReplyComment from './ReplyComment';
import { deleteComment } from './DeleteComment';
import { Comment, Cocomment } from '@/types/api/comment';

export default function AddComment() {
  // 댓글 입력 상태 관리
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyToIndex, setReplyToIndex] = useState<number | null>(null);
  const [replyComments, setReplyComments] = useState<{ [key: number]: string }>({});
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editComment, setEditComment] = useState('');

  // 대댓글 수정 상태 관리
  const [editCocommentId, setEditCocommentId] = useState<number | null>(null);
  const [editCocommentContent, setEditCocommentContent] = useState('');

  // 현재 사용자 정보 가져오기
  const { data: currentUser } = useUser();

  // 댓글 조회 및 추가
  const params = useParams();
  const taskId = Number(params.taskId);
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    error: commentsError,
  } = useGetComments(taskId);
  const { mutate: addCommentMutation, isPending: isAddingComment } = useAddComment();
  const { mutate: addCocommentMutation, isPending: isAddingCocomment } = useAddCocomment();
  const { mutate: updateCocommentMutation, isPending: isUpdatingCocomment } = useUpdateCocomment();

  // 댓글 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (commentsData?.result?.comments) {
      setComments(commentsData.result.comments);
    }
  }, [commentsData]);

  const handleComment = () => {
    if (newComment.trim() === '') return;

    addCommentMutation(
      { taskId, content: newComment },
      {
        onSuccess: (data) => {
          // 성공 시 입력 필드만 초기화 (댓글 목록은 useQuery가 자동으로 업데이트)
          setNewComment('');
        },
        onError: (error: Error) => {
          console.error('댓글 추가 실패:', error);
          alert(error.message || '댓글 추가에 실패했습니다.');
        },
      }
    );
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

    const commentId = comments[idx].commentId;
    const content = replyComments[idx].trim();

    addCocommentMutation(
      { commentId, content },
      {
        onSuccess: (data) => {
          // 성공 시 입력 필드 초기화 및 replyToIndex 초기화
          setReplyComments((prev) => {
            const newReplies = { ...prev };
            delete newReplies[idx];
            return newReplies;
          });
          setReplyToIndex(null);
        },
        onError: (error: Error) => {
          console.error('대댓글 추가 실패:', error);
          alert(error.message || '대댓글 추가에 실패했습니다.');
        },
      }
    );
  };

  // 대댓글 수정 처리
  const handleCocommentEdit = (cocommentId: number, content: string) => {
    setEditCocommentId(cocommentId);
    setEditCocommentContent(content);
  };

  // 대댓글 수정 제출 처리
  const handleCocommentEditSubmit = () => {
    if (!editCocommentContent || editCocommentContent.trim() === '') return;

    updateCocommentMutation(
      { cocommentId: editCocommentId!, content: editCocommentContent.trim() },
      {
        onSuccess: (data) => {
          setEditCocommentId(null);
          setEditCocommentContent('');
        },
        onError: (error: Error) => {
          console.error('대댓글 수정 실패:', error);
          alert(error.message || '대댓글 수정에 실패했습니다.');
        },
      }
    );
  };

  // 대댓글 삭제 처리
  const handleCocommentDelete = (cocommentId: number) => {
    if (confirm('대댓글을 삭제하시겠습니까?')) {
      // 실제 삭제 API가 준비되면 여기에 구현
      console.log('대댓글 삭제:', cocommentId);
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // 로딩 중일 때
  if (isLoadingComments) {
    return (
      <div className="mt-[83px] ml-[95px] max-lg:ml-[79px]">
        <div className="text-center py-4">댓글을 불러오는 중...</div>
      </div>
    );
  }

  // 에러가 있을 때
  if (commentsError) {
    return (
      <div className="mt-[83px] ml-[95px] max-lg:ml-[79px]">
        <div className="text-center py-4 text-red-500">댓글을 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <>
      {/* 댓글 입력 UI */}
      <div
        className="flex flex-row mt-[83px] ml-[95px] items-center
      max-lg:ml-[79px]"
      >
        <img
          className="mr-[28px] w-[44px] h-[44px] rounded-full object-cover"
          src={currentUser?.imageUrl || '/icons/myprofile.svg'}
          alt="댓글프로필"
        />
        <div className="relative">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isAddingComment) {
                handleComment();
              }
            }}
            disabled={isAddingComment}
            className="p-[20px] w-[1288px] h-[50px] bg-white rounded-[8px] border-[2px] border-[#BBBBBB]
            max-lg:w-[735px] disabled:opacity-50"
            placeholder={isAddingComment ? '댓글을 추가하는 중...' : '댓글을 작성하세요'}
          />

          <button
            onClick={handleComment}
            disabled={isAddingComment || newComment.trim() === ''}
            className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src="/icons/comment-enter.svg" alt="전송" />
          </button>
        </div>
      </div>

      {/* 댓글 출력 UI 및 수정/삭제/대댓글 기능 */}
      {comments.map((comment, idx) => (
        <div
          key={comment.commentId}
          className="mt-[40px] ml-[95px]
        max-lg:ml-[79px] max-lg:mt-[32px]"
        >
          <div className="flex items-center mb-[8px] w-[1360px] group">
            <div className="flex flex-col items-center mr-[20px]">
              <img
                src={comment.users.imageUrl || '/icons/myprofile.svg'}
                alt="댓글프로필"
                className="w-[44px] h-[44px] rounded-full object-cover mr-[8px]"
              />
              <div className="text-[12px] text-black mt-[2px]">
                {comment.users.name || 'Teamie'}
              </div>
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
                      updated[idx] = { ...updated[idx], content: editComment.trim() };
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
                    {comment.content}
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
                        setEditComment(comment.content);
                        setEditIndex(idx);
                        setReplyToIndex(null);
                      } else if (action === 'delete') {
                        const newComments = comments.filter((_, i) => i !== idx);
                        const newReplies = { ...replyComments };
                        delete newReplies[idx];
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
              <div className="text-[#898989] text-[12px] ml-[12px] mt-[4px]">
                {formatDate(comment.createdAt)}
              </div>
            </div>
          </div>

          {/* 대댓글 출력 */}
          {comment.cocomments &&
            comment.cocomments.length > 0 &&
            comment.cocomments.map((cocomment) => (
              <ReplyComment
                key={cocomment.cocommentId}
                idx={idx}
                cocommentIdx={cocomment.cocommentId}
                replyToIndex={replyToIndex}
                replyValue={replyComments[idx] || ''}
                submittedReply={cocomment.content}
                submittedReplyUser={cocomment.users}
                onChange={handleReplyChange}
                onSubmit={handleReplySubmit}
                formatDate={() => formatDate(cocomment.createdAt)}
                isAddingCocomment={isAddingCocomment}
                onCocommentEdit={handleCocommentEdit}
                onCocommentDelete={handleCocommentDelete}
                editCocommentId={editCocommentId}
                editCocommentContent={editCocommentContent}
                onCocommentEditChange={setEditCocommentContent}
                onCocommentEditSubmit={handleCocommentEditSubmit}
              />
            ))}

          {/* 대댓글 입력 필드 */}
          {replyToIndex === idx && (
            <ReplyComment
              idx={idx}
              replyToIndex={replyToIndex}
              replyValue={replyComments[idx] || ''}
              onChange={handleReplyChange}
              onSubmit={handleReplySubmit}
              formatDate={formatDate}
              isAddingCocomment={isAddingCocomment}
            />
          )}
        </div>
      ))}
    </>
  );
}
