import React from 'react';
import { useUser } from '@/hooks/mutations/useUser';
import CommentMenuDropdown from './CommentDropdown';

type Props = {
  idx: number; // 댓글 구분
  cocommentIdx?: number; // 대댓글 구분
  replyToIndex: number | null; // 대댓글이 달리는 댓글의 인덱스
  replyToCocommentId?: number | null; // 대댓글이 달리는 대댓글의 ID
  replyValue: string; // 대댓글 입력값
  submittedReply?: string; // 제출된 대댓글
  onChange: (idx: number, value: string) => void; // 대댓글 입력값 변경 핸들러
  onSubmit: (idx: number) => void; // 대댓글 제출 핸들러
  formatDate: () => string; // 날짜 포맷 함수
  submittedReplyUser?: { imageUrl: string; name: string }; // 제출된 대댓글의 사용자 정보
  isAddingCocomment?: boolean; // 대댓글 추가 중 상태
  isDeletingCocomment?: boolean; // 대댓글 삭제 중 상태
  onCocommentEdit?: (cocommentId: number, content: string) => void; // 대댓글 수정 핸들러
  onCocommentDelete?: (cocommentId: number) => void; // 대댓글 삭제 핸들러
  onCocommentReply?: (cocommentId: number) => void; // 대댓글에 대한 대댓글 입력 핸들러
  editCocommentId?: number | null; // 수정 중인 대댓글 ID
  editCocommentContent?: string; // 수정 중인 대댓글 내용
  onCocommentEditChange?: (content: string) => void; // 대댓글 수정 내용 변경 핸들러
  onCocommentEditSubmit?: () => void; // 대댓글 수정 제출 핸들러
  isEdited?: boolean; // 수정 여부
  readOnly?: boolean; // 프로젝트 종료 시 읽기 전용
};

export default function ReplyComment({
  idx,
  cocommentIdx,
  replyToIndex,
  replyToCocommentId,
  replyValue,
  submittedReply,
  onChange,
  onSubmit,
  formatDate,
  submittedReplyUser,
  isAddingCocomment = false,
  isDeletingCocomment = false,
  onCocommentEdit,
  onCocommentDelete,
  onCocommentReply,
  editCocommentId,
  editCocommentContent = '',
  onCocommentEditChange,
  onCocommentEditSubmit,
  isEdited = false,
  readOnly = false,
}: Props) {
  // 현재 사용자 정보 가져오기
  const { data: currentUser } = useUser();

  // 현재 댓글이 대댓글 입력 중인 댓글이라면, 입력 필드를 렌더링
  if (replyToIndex === idx) {
    if (readOnly) return null;
    return (
      <div className="flex items-center ml-[28px] w-[1340px]">
        <img
          src="/icons/arrow-reply.svg"
          alt="대댓글 화살표"
          className="w-[24px] h-[24px] mr-[20px]"
        />
        <img
          className="mr-[20px] w-[44px] h-[44px] rounded-full object-cover"
          src={currentUser?.imageUrl || '/icons/myprofile.svg'}
          alt="댓글프로필"
        />
        <div className="relative w-[1224px]">
          <input
            value={replyValue}
            onChange={(e) => onChange(idx, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && replyValue.trim()) {
                e.preventDefault();
                onSubmit(idx);
              }
            }}
            disabled={isAddingCocomment}
            className="rounded-[8px] w-[1224px] min-h-[46px] pl-[12px] py-[10px] bg-white border-[2px] border-[#BBBBBB]
            max-lg:w-[671px] disabled:opacity-50"
            placeholder={
              isAddingCocomment
                ? '대댓글을 추가하는 중...'
                : replyToCocommentId
                  ? '대댓글에 대한 대댓글을 작성하세요'
                  : '댓글을 작성하세요'
            }
          />
          {replyValue.trim() !== '' && (
            <button
              onClick={() => onSubmit(idx)}
              disabled={isAddingCocomment}
              className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
              max-lg:translate-x-[-550px]"
            >
              <img src="/icons/comment-enter.svg" alt="대댓글 전송" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 제출된 대댓글이 있을 경우 출력 UI 렌더링
  if (submittedReply) {
    return (
      <div className="flex items-center ml-[20px] w-[1340px] group">
        <img
          src="/icons/arrow-reply.svg"
          alt="대댓글 화살표"
          className="w-[24px] h-[24px] mr-[20px]"
        />
        <div className="flex flex-col items-center mr-[12px]">
          <img
            src={submittedReplyUser?.imageUrl || currentUser?.imageUrl || '/icons/myprofile.svg'}
            alt="프로필"
            className="w-[44px] h-[44px] rounded-full object-cover"
          />
          <div className="text-[12px] text-black mt-[2px]">
            {submittedReplyUser?.name || currentUser?.name || '김티미'}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="relative">
            {/* 대댓글 수정 처리 */}
            {editCocommentId && editCocommentId === cocommentIdx ? (
              <div className="relative">
                <input
                  value={editCocommentContent}
                  onChange={(e) => onCocommentEditChange?.(e.target.value)}
                  className="rounded-[8px] w-[1224px] min-h-[46px] pl-[12px] py-[10px] bg-white border-[2px] border-[#BBBBBB] ml-[16px]
                  max-lg:w-[671px]"
                  placeholder="대댓글을 수정하세요"
                />
                <button
                  onClick={onCocommentEditSubmit}
                  disabled={!editCocommentContent.trim()}
                  className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img src="/icons/comment-enter.svg" alt="대댓글 수정" />
                </button>
              </div>
            ) : (
              <div
                className="bg-[#F8F8F8] rounded-[8px] w-[1224px] min-h-[46px] ml-[16px] pl-[12px] py-[10px]
              max-lg:w-[671px]"
              >
                {submittedReply}
              </div>
            )}
            {/* 대댓글 드롭다운 메뉴 */}
            {!readOnly &&
              !editCocommentId &&
              !isDeletingCocomment &&
              onCocommentEdit &&
              onCocommentDelete && (
                <CommentMenuDropdown
                  type="cocomment"
                  onSelect={(action) => {
                    console.log('📋 대댓글 드롭다운 메뉴 선택:', {
                      action,
                      cocommentId: cocommentIdx,
                    });

                    if (action === 'reply') {
                      console.log('💬 대댓글에 대한 대댓글 입력 모드 시작:', {
                        cocommentId: cocommentIdx,
                      });
                      onCocommentReply?.(cocommentIdx || 0);
                    } else if (action === 'edit') {
                      console.log('✏️ 대댓글 수정 모드 시작:', {
                        cocommentId: cocommentIdx,
                        content: submittedReply,
                      });
                      onCocommentEdit(cocommentIdx || 0, submittedReply || '');
                    } else if (action === 'delete') {
                      console.log('🗑️ 대댓글 삭제 요청:', { cocommentId: cocommentIdx });
                      onCocommentDelete(cocommentIdx || 0);
                    }
                  }}
                />
              )}
          </div>
          <div className="text-[#898989] text-[12px] ml-[24px] mt-[4px]">
            {formatDate()}
            {isEdited && ' (수정됨)'}
          </div>
        </div>
      </div>
    );
  }

  // 아무것도 해당하지 않으면 렌더링하지 않음
  return null;
}
