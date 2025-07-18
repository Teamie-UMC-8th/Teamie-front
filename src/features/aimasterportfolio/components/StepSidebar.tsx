import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface StepSidebarProps {
  currentStep: number;
  steps: {
    id: number;
    title: string;
  }[];
  goToStep: (step: number) => void;
}

export default function StepsSidebar({ steps, currentStep, goToStep }: StepSidebarProps) {
  const router = useRouter();
  const handleStepClick = (stepId: number) => {
    goToStep(stepId - 1);
  };
  
  return (
    <div className="w-[280px] h-full bg-white border-r border-gray-200 flex flex-col p-6">
      <div
        className="flex items-center gap-2 justify-end mb-8 cursor-pointer hover:bg-gray-50 p-2 rounded"
        onClick={() => {
          if (currentStep === 0) {
            router.push('/mypage/aimasterportfolio');
          } else {
            goToStep(currentStep - 1);
          }
        }}
      >
        <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        <p className="font-normal text-lg text-gray-700">돌아가기</p>
      </div>

      <div className="flex flex-col gap-[28px]">
        {steps.map((step, index) => {
          const isActive = currentStep + 1 === step.id;
          const isCompleted = currentStep + 1 > step.id;
          const isClickable = true;

          return (
            <div key={step.id} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-4 top-12 w-0.5 h-[44px] bg-gray-200 pointer-events-none" />
              )}

              <div
                className={`flex items-center gap-4 py-3 select-none transition-colors ${
                  isClickable
                    ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100'
                    : 'cursor-not-allowed opacity-60'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isClickable) {
                    handleStepClick(step.id);
                  }
                }}
              >
                <div
                  className={`
                    w-[32px] h-[32px] rounded-full flex items-center justify-center text-white font-medium text-lg relative
                    ${isActive ? 'bg-black' : isCompleted ? 'bg-gray-400' : 'bg-gray-300'}
                  `}
                >
                  {step.id}
                </div>

                <span
                  className={`
                    text-lg font-medium
                    ${isActive ? 'text-black' : isCompleted ? 'text-gray-600' : 'text-gray-500'}
                  `}
                >
                  {step.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
