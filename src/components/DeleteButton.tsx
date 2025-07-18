import { useState } from "react";
import DeleteButtonModal from "./DeleteButtonModal";

type DeleteButtonProps = {
  onDelete: () => void;
  modalTitle?: string;
  confirmText?: string;
  cancelText?: string;
  className?: string;
};

export default function DeleteButton({
  onDelete,
  modalTitle = "이 일정을 정말 삭제하시겠습니까?",
  confirmText = "예",
  cancelText = "아니오",
  className = "",
}: DeleteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className={`${className} cursor-pointer`}>
        <img src="/icons/delete.svg" alt="삭제" className="w-[36px] h-[36px]" />
      </button>

      {isModalOpen && (
        <DeleteButtonModal
          title={modalTitle}
          confirmText={confirmText}
          cancelText={cancelText}
          onConfirm={handleDelete}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
