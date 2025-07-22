interface AddTaskButtonProps {
  stepName: string;
  className?: string;
}

export default function AddTaskButton({ stepName, className = '' }: AddTaskButtonProps) {
  const handleClick = () => {
    // TODO: 업무 상세 페이지 라우팅
    alert(`${stepName}에 새 업무 추가`);
  };

  return (
    <button
      className={`flex bg-[#FFFFFF] text-[#898989] w-[20.313rem] h-[2.75rem] items-center justify-center rounded-[0.5rem] text-[1rem] cursor-pointer border border-[#BBBBBB] border-[0.094rem] ${className}`}
      onClick={handleClick}
    >
      + 업무 추가
    </button>
  );
}
