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
    <div className="w-[280px] max-lg:w-full h-full max-lg:h-[138px] bg-white border-gray-200 flex flex-col p-6 shadow-lg z-1">
      {/* 뒤로가기 */}
      <div
        className="flex items-center gap-2 justify-end mb-8 cursor-pointer hover:bg-gray-50 p-2 rounded max-lg:justify-start max-lg:mb-4"
        onClick={() => {
          if (currentStep === 0) {
            router.push('/mypage/aimasterportfolio');
          } else {
            goToStep(currentStep - 1);
          }
        }}
      >
        <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        <p className="font-normal text-lg text-black-400">돌아가기</p>
      </div>

      {/* 스텝 리스트 */}
      <div className="flex flex-col gap-[28px] max-lg:flex-row max-lg:gap-[16px] max-lg:justify-end max-lg:w-full">
        {steps.map((step, index) => {
          const isActive = currentStep + 1 === step.id;
          const isCompleted = currentStep + 1 > step.id;
          const isClickable = true;

          return (
            <div key={step.id} className="relative max-lg:flex max-lg:items-center max-lg:gap-[12px]">
              {/* 스텝 항목 */}
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
                  className={`w-[32px] max-lg:w-[28px] h-[32px] max-lg:h-[28px] rounded-full flex items-center justify-center text-white font-medium text-lg ${
                    isActive ? 'bg-black' : isCompleted ? 'bg-gray-400' : 'bg-gray-300'
                  }`}
                >
                  {step.id}
                </div>

                <span
                  className={`text-lg font-medium max-lg:whitespace-nowrap ${
                    isActive ? 'text-black' : isCompleted ? 'text-gray-600' : 'text-gray-500'
                  } ${
                    isActive
                      ? 'max-lg:text-[18px] max-lg:leading-[26px] max-lg:font-bold max-lg:text-center max-lg:text-black'
                      : ''
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* 연결 선 */}
              {index < steps.length - 1 && (
                <div
                  className={`bg-gray-200 absolute left-[15px] top-[44px] w-0.5 h-[44px] 
                              max-lg:static max-lg:w-[28px] max-lg:h-0.5 max-lg:left-auto max-lg:top-auto`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
