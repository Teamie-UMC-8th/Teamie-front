import { useCreateTask } from '@/hooks/mutations/useCreateTask';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

interface AddTaskButtonProps {
  stepId: number;
  stepName: string;
  className?: string;
  isCompleted: boolean;
}

export default function AddTaskButton({ stepId, className = '', isCompleted }: AddTaskButtonProps) {
  const createTaskMutation = useCreateTask();
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;

  const handleClick = async () => {
    // 프로젝트가 종료된 경우 업무 추가 비활성화
    if (isCompleted) return;

    try {
      const response = await createTaskMutation.mutateAsync(stepId);

      // 성공 시 생성된 업무의 상세 페이지로 리다이렉트
      if (response.result?.taskId) {
        router.push(`/projects/${projectId}/tasks/${response.result.taskId}`);
      }
    } catch (error) {
      console.error('업무 생성 실패:', error);
      alert('업무 생성에 실패했습니다.');
    }
  };

  return (
    <button
      className={`flex bg-[#FFFFFF] text-[#898989] w-[20.313rem] h-[2.75rem] items-center justify-center rounded-[0.5rem] text-[1rem] cursor-pointer border border-[#BBBBBB] ${
        isCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F8F8F8]'
      } ${className}`}
      onClick={handleClick}
      disabled={createTaskMutation.isPending || isCompleted}
    >
      + 업무 추가
    </button>
  );
}
