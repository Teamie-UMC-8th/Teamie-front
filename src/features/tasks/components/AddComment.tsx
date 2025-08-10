import { useState, useEffect } from 'react';
import {
  useAddComment,
  useGetComments,
  useAddCocomment,
  useUpdateCocomment,
  useDeleteCocomment,
  useDeleteComment,
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

  // 대댓글에 대한 대댓글 입력 상태 관리
  const [replyToCocommentId, setReplyToCocommentId] = useState<number | null>(null);
  const [cocommentReplyValue, setCocommentReplyValue] = useState('');

  // 삭제된 대댓글 ID 추적
  const [deletedCocommentIds, setDeletedCocommentIds] = useState<Set<number>>(new Set());

  // 현재 사용자 정보 가져오기
  const { data: currentUser } = useUser();

  // 댓글 조회 및 추가
  const params = useParams();
  const taskId = Number(params.taskId);
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    error: commentsError,
    refetch: refetchComments,
  } = useGetComments(taskId);
  const { mutate: addCommentMutation, isPending: isAddingComment } = useAddComment();
  const { mutate: addCocommentMutation, isPending: isAddingCocomment } = useAddCocomment();
  const { mutate: updateCocommentMutation, isPending: isUpdatingCocomment } = useUpdateCocomment();
  const { mutate: deleteCocommentMutation, isPending: isDeletingCocomment } = useDeleteCocomment();
  const { mutate: deleteCommentMutation, isPending: isDeletingComment } = useDeleteComment();

  // 댓글 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (commentsData?.result?.comments) {
      console.log('📥 서버에서 댓글 데이터 로드:', commentsData.result.comments);

      // 삭제된 대댓글을 필터링하여 로컬 상태 업데이트
      const filteredComments = commentsData.result.comments.map((comment) => ({
        ...comment,
        cocomments:
          comment.cocomments?.filter(
            (cocomment) => !deletedCocommentIds.has(cocomment.cocommentId)
          ) || [],
      }));

      console.log('🔍 삭제된 대댓글 필터링 후:', {
        originalCount: commentsData.result.comments.reduce(
          (acc, c) => acc + (c.cocomments?.length || 0),
          0
        ),
        filteredCount: filteredComments.reduce((acc, c) => acc + (c.cocomments?.length || 0), 0),
        deletedIds: Array.from(deletedCocommentIds),
      });

      // 로컬 상태와 서버 데이터를 병합
      setComments((prevComments) => {
        // 서버 데이터를 기준으로 하되, 로컬에서 추가된 대댓글은 보존
        return filteredComments.map((serverComment) => {
          const localComment = prevComments.find((c) => c.commentId === serverComment.commentId);

          if (localComment) {
            // 로컬에서 추가된 대댓글 중 서버에 없는 것들을 찾아서 병합
            const localOnlyCocomments =
              localComment.cocomments?.filter(
                (localCocomment) =>
                  !serverComment.cocomments?.some(
                    (serverCocomment) => serverCocomment.cocommentId === localCocomment.cocommentId
                  ) && !deletedCocommentIds.has(localCocomment.cocommentId)
              ) || [];

            return {
              ...serverComment,
              cocomments: [...(serverComment.cocomments || []), ...localOnlyCocomments],
            };
          }

          return serverComment;
        });
      });
    }
  }, [commentsData, deletedCocommentIds]);

  // 댓글 상태가 변경될 때마다 로그 출력
  useEffect(() => {
    console.log('📊 현재 댓글 상태:', comments);
  }, [comments]);

  const handleComment = () => {
    if (newComment.trim() === '') return;

    addCommentMutation(
      { taskId, content: newComment },
      {
        onSuccess: (data) => {
          // 성공 시 입력 필드만 초기화 (댓글 목록은 useQuery가 자동으로 업데이트)
          setNewComment('');
          // 로컬 상태에 새 댓글 추가
          const newCommentData = {
            commentId: data.result.commentId,
            content: data.result.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            users: {
              imageUrl: currentUser?.imageUrl || '/icons/myprofile.svg',
              name: currentUser?.name || '사용자',
            },
            cocomments: [],
          };
          setComments((prev) => [newCommentData, ...prev]);
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

    console.log('💬 대댓글 추가 API 호출:', {
      commentId,
      content,
      replyToCocommentId,
      isReplyToCocomment: !!replyToCocommentId,
    });

    addCocommentMutation(
      { commentId, content },
      {
        onSuccess: (data) => {
          console.log('✅ 대댓글 추가 성공:', data);

          // 성공 시 입력 필드 초기화 및 replyToIndex 초기화
          setReplyComments((prev) => {
            const newReplies = { ...prev };
            delete newReplies[idx];
            return newReplies;
          });
          setReplyToIndex(null);
          setReplyToCocommentId(null); // 대댓글에 대한 대댓글 모드도 초기화

          // 로컬 상태에 새 대댓글 추가
          const newCocommentData = {
            cocommentId: data.result.cocommentId,
            content: data.result.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            users: {
              imageUrl: currentUser?.imageUrl || '/icons/myprofile.svg',
              name: currentUser?.name || '사용자',
            },
          };
          setComments((prev) =>
            prev.map((comment, commentIdx) =>
              commentIdx === idx
                ? {
                    ...comment,
                    cocomments: [...(comment.cocomments || []), newCocommentData],
                  }
                : comment
            )
          );
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

          // 로컬 상태에서 대댓글 내용 업데이트
          setComments((prev) =>
            prev.map((comment) => ({
              ...comment,
              cocomments:
                comment.cocomments?.map((cocomment) =>
                  cocomment.cocommentId === editCocommentId
                    ? {
                        ...cocomment,
                        content: editCocommentContent.trim(),
                        updatedAt: new Date().toISOString(),
                      }
                    : cocomment
                ) || [],
            }))
          );
        },
        onError: (error: Error) => {
          console.error('대댓글 수정 실패:', error);
          alert(error.message || '대댓글 수정에 실패했습니다.');
        },
      }
    );
  };

  // 대댓글에 대한 대댓글 입력 처리
  const handleCocommentReply = (cocommentId: number) => {
    // 해당 대댓글이 속한 댓글의 인덱스를 찾기
    const commentIndex = comments.findIndex((comment) =>
      comment.cocomments?.some((cocomment) => cocomment.cocommentId === cocommentId)
    );

    if (commentIndex !== -1) {
      console.log('💬 대댓글에 대한 대댓글 입력 모드 시작:', {
        cocommentId,
        commentIndex,
      });

      // 해당 댓글의 대댓글 입력 모드 활성화
      setReplyToIndex(commentIndex);
      setReplyToCocommentId(cocommentId); // 어떤 대댓글에 대한 대댓글인지 저장
      setEditCocommentId(null); // 수정 모드 해제
    }
  };

  // 대댓글 삭제 처리
  const handleCocommentDelete = (cocommentId: number) => {
    console.log('🗑️ 대댓글 삭제 요청:', { cocommentId });

    // 먼저 로컬 상태에서 해당 대댓글을 제거
    setComments((prev) =>
      prev.map((comment) => ({
        ...comment,
        cocomments:
          comment.cocomments?.filter((cocomment) => cocomment.cocommentId !== cocommentId) || [],
      }))
    );
    setDeletedCocommentIds((prev) => new Set([...prev, cocommentId]));

    deleteCocommentMutation(cocommentId, {
      onSuccess: () => {
        console.log('🎉 대댓글 삭제 성공:', cocommentId);
        // 성공 후 서버에서 최신 데이터를 다시 가져옴
        refetchComments();
      },
      onError: (error: Error) => {
        console.error('💥 대댓글 삭제 실패:', { cocommentId, error });
        // 실패 시 삭제된 ID에서 제거하고 원래 상태로 되돌림
        setDeletedCocommentIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(cocommentId);
          return newSet;
        });
        refetchComments();
        alert(error.message || '대댓글 삭제에 실패했습니다.');
      },
    });
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

          {newComment.trim() !== '' && (
            <button
              onClick={handleComment}
              disabled={isAddingComment}
              className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] cursor-pointer "
            >
              <img src="/icons/comment-enter.svg" alt="전송" />
            </button>
          )}
        </div>
      </div>

      {/* 댓글 출력 UI 및 수정/삭제/대댓글 기능 */}
      {comments.map((comment, idx) => (
        <div
          key={comment.commentId}
          className={`${idx === 0 ? 'mt-[40px]' : 'mt-[16px]'} ml-[95px]
        max-lg:ml-[79px] ${idx === 0 ? 'max-lg:mt-[32px]' : 'max-lg:mt-[12px]'}`}
        >
          <div className="flex items-center mb-[8px] w-[1360px] group">
            <div className="flex flex-col items-center mr-[20px]">
              <img
                src={comment.users.imageUrl || '/icons/myprofile.svg'}
                alt="댓글프로필"
                className="w-[44px] h-[44px] rounded-full object-cover"
              />
              <div className="text-[12px] text-black mt-[2px] text-center">
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
                    className="bg-[#F8F8F8] rounded-[8px] w-[1288px] min-h-[46px] pl-[12px] py-[10px] min-w-fit ml-[8px]
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
                        const commentId = comments[idx].commentId;
                        console.log('🗑️ 댓글 삭제 요청:', { commentId, commentIndex: idx });

                        // 먼저 로컬 상태에서 해당 댓글을 제거
                        const newComments = comments.filter((_, i) => i !== idx);
                        const newReplies = { ...replyComments };
                        delete newReplies[idx];
                        setComments(newComments);
                        setReplyComments(newReplies);
                        setReplyToIndex(null);
                        setEditIndex(null);

                        // API 호출
                        deleteCommentMutation(commentId, {
                          onSuccess: () => {
                            console.log('🎉 댓글 삭제 성공:', commentId);
                            // 성공 후 서버에서 최신 데이터를 다시 가져옴
                            refetchComments();
                          },
                          onError: (error: Error) => {
                            console.error('💥 댓글 삭제 실패:', { commentId, error });
                            // 실패 시 원래 상태로 되돌림
                            setComments(comments);
                            setReplyComments(replyComments);
                            refetchComments();
                            alert(error.message || '댓글 삭제에 실패했습니다.');
                          },
                        });
                      } else {
                        setReplyToIndex(null);
                        setEditIndex(null);
                      }
                    }}
                  />
                )}
              </div>
              <div className="text-[#898989] text-[12px] ml-[16px] mt-[4px] ">
                {formatDate(comment.createdAt)}
              </div>
            </div>
          </div>

          {/* 대댓글 출력 */}
          {comment.cocomments &&
            comment.cocomments.length > 0 &&
            comment.cocomments.map((cocomment, cocommentIndex) => (
              <div
                key={cocomment.cocommentId}
                className={cocommentIndex < comment.cocomments.length - 1 ? 'mb-[8px]' : 'mb-[8px]'}
              >
                <ReplyComment
                  idx={idx}
                  cocommentIdx={cocomment.cocommentId}
                  replyToIndex={null}
                  replyToCocommentId={null}
                  replyValue=""
                  submittedReply={cocomment.content}
                  submittedReplyUser={cocomment.users}
                  onChange={() => {}}
                  onSubmit={() => {}}
                  formatDate={() => formatDate(cocomment.createdAt)}
                  isAddingCocomment={isAddingCocomment}
                  isDeletingCocomment={isDeletingCocomment}
                  onCocommentEdit={handleCocommentEdit}
                  onCocommentDelete={handleCocommentDelete}
                  onCocommentReply={handleCocommentReply}
                  editCocommentId={editCocommentId}
                  editCocommentContent={editCocommentContent}
                  onCocommentEditChange={setEditCocommentContent}
                  onCocommentEditSubmit={handleCocommentEditSubmit}
                />
              </div>
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
