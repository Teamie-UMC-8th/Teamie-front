'use client';

import { useState, useEffect } from 'react';
import PostItModal from './PostItModal';
import Portal from '@/components/Portal';
import DeleteButtonModal from '@/components/DeleteButtonModal';

interface PostItProps {
  content?: string;
  onDelete?: () => void;
  createdAt?: number;
}

export default function PostIt({ content = '', onDelete, createdAt }: PostItProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postItContent, setPostItContent] = useState(content);

  // 남은 시간 계산
  useEffect(() => {
    if (!createdAt) return;

    const updateTimeLeft = () => {
      const now = Date.now();
      const timeElapsed = now - createdAt;
      const fortyEightHours = 48 * 60 * 60 * 1000;
      const remainingTime = fortyEightHours - timeElapsed;

      if (remainingTime <= 0) {
        if (onDelete) {
          onDelete();
        }
        return;
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // 1분마다 업데이트

    return () => clearInterval(interval);
  }, [createdAt, onDelete]);

  const handlePostItClick = () => {
    // PostIt 클릭 시 아무 일도 일어나지 않음
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveContent = (newContent: string) => {
    setPostItContent(newContent);
    setIsModalOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setIsDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div onClick={handlePostItClick} className="cursor-pointer group">
        <img
          src="/icons/Post-it.svg"
          alt="게시판 포스트잇"
          className="absolute flex flex-col items-center"
        />
        <div className="flex items-center translate-y-[4px]">
          <p className="w-[8px] h-[8px] rounded-full bg-[#898989] relative ml-[56px]" />
          <img
            src="/icons/delete_steps.svg"
            alt="삭제 아이콘"
            className="relative w-[16px] h-[16px] ml-[36px] right-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            onClick={handleDeleteClick}
          />
        </div>
        <div className="relative w-[100px] h-[88px] ml-[11px] mt-[8px] text-[14px] whitespace-pre-wrap overflow-hidden">
          {postItContent || content}
        </div>
      </div>

      {isModalOpen && (
        <Portal>
          <PostItModal onClose={handleCloseModal} onSave={handleSaveContent} />
        </Portal>
      )}

      {isDeleteModalOpen && (
        <Portal>
          <DeleteButtonModal
            title="포스트잇을 삭제하시겠습니까?"
            confirmText="삭제"
            cancelText="취소"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </Portal>
      )}
    </>
  );
}
