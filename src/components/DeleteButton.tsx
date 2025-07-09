type DeleteButtonProps = {
  onClick?: () => void;
  className?: string;
};

export default function DeleteButton({ onClick, className = "" }: DeleteButtonProps) {
  return (
    <button onClick={onClick} className={className}>
      <img src="/icons/delete.svg" alt="삭제" className="w-[36px] h-[36px]" />
    </button>
  );
}