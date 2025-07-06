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
      className={`flex bg-[#FFFFFF] text-[#898989] w-[325px] h-[44px] items-center justify-center rounded-[8px] text-[16px] border border-[#BBBBBB] border-[1.5px] ${className}`}
      onClick={handleClick}
    >
      + 업무 추가
    </button>
  );
}
