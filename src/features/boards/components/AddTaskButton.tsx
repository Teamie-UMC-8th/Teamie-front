import { useCreateTask } from '@/hooks/mutations/useCreateTask';

interface AddTaskButtonProps {
  stepId: number;
  stepName: string;
  className?: string;
}

export default function AddTaskButton({ stepId, className = '' }: AddTaskButtonProps) {
  const createTaskMutation = useCreateTask();

  const handleClick = async () => {
    try {
      await createTaskMutation.mutateAsync(stepId);
      // 성공 시 쿼리 무효화로 자동으로 데이터가 업데이트됩니다
    } catch (error) {
      console.error('업무 생성 실패:', error);
      alert('업무 생성에 실패했습니다.');
    }
  };

  return (
    <button
      className={`flex bg-[#FFFFFF] text-[#898989] w-[20.313rem] h-[2.75rem] items-center justify-center rounded-[0.5rem] text-[1rem] cursor-pointer border border-[#BBBBBB] ${className}`}
      onClick={handleClick}
      disabled={createTaskMutation.isPending}
    >
      + 업무 추가
    </button>
  );
}
