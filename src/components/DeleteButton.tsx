import { useState } from "react";
import DeleteButtonModal from "./DeleteButtonModal";

type DeleteButtonProps = {
  onDelete: () => void;
  modalTitle?: string;
  className?: string;
};

export default function DeleteButton({
  onDelete,
  modalTitle = "이 일정을 정말 삭제하시겠습니까?",
  className = "",
}: DeleteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className={className}>
        <img src="/icons/delete.svg" alt="삭제" className="w-[36px] h-[36px]" />
      </button>

      {isModalOpen && (
        <DeleteButtonModal
          title={modalTitle}
          onConfirm={handleDelete}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
