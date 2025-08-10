import { useState } from 'react';

export function Divider() {
  return <div className="w-full h-[1px] my-[24px] bg-[#E7E7E7]" />;
}

interface Step3Props {
  onAnswersChange?: (answers: {
    projectGoal: boolean | null;
    workDomain: boolean | null;
    workDomainDetail: string;
    achievement: boolean | null;
    roleContribution: boolean | null;
    roleContributionDetail: string;
  }) => void;
}

export default function Step3({ onAnswersChange }: Step3Props) {
  const [answers, setAnswers] = useState({
    projectGoal: null as boolean | null,
    workDomain: null as boolean | null,
    workDomainDetail: '',
    achievement: null as boolean | null,
    roleContribution: null as boolean | null,
    roleContributionDetail: '',
  });

  const handleYesNo = (question: string, value: boolean) => {
    const newAnswers = {
      ...answers,
      [question]: value,
    };
    setAnswers(newAnswers);
    onAnswersChange?.(newAnswers);
  };

  const handleTextChange = (question: string, value: string) => {
    const newAnswers = {
      ...answers,
      [question]: value,
    };
    setAnswers(newAnswers);
    onAnswersChange?.(newAnswers);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <p className="text-lg text-black-400 leading-relaxed">
          프로젝트와 관련하여 궁금한 점들이 생겼어요. <br />
          답변해주시면, 참고해서 더 좋은 품질의 마스터 포트폴리오를 생성할게요.
        </p>
      </div>

      <div className="space-y-8  rounded-[12px] bg-[#F8F8F8] shadow-[0_0_4px_rgba(0,0,0,0.20)] p-[24px]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-black-400 font-medium flex-1">
            1. 이 프로젝트의 핵심 목표는 &quot;언어교육을 통한 실질적 관계 형성 및 학습 환경
            조성&quot;이었나요?
          </p>
          <div className="flex gap-3 ml-4">
            <button
              onClick={() => handleYesNo('projectGoal', true)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                answers.projectGoal === true
                  ? 'border-[1px] border-[#81D7D4] bg-[#DAF3F3]'
                  : 'border-[0.6px] border-[#898989] bg-[#FFF]'
              }`}
            >
              예
            </button>
            <button
              onClick={() => handleYesNo('projectGoal', false)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                answers.projectGoal === false
                  ? 'border-[1px] border-[#81D7D4] bg-[#DAF3F3]'
                  : 'border-[0.6px] border-[#898989] bg-[#FFF]'
              }`}
            >
              아니오
            </button>
          </div>
        </div>

        <Divider />

        <div className="flex items-center justify-between mb-4">
          <p className="text-black-400 font-medium flex-1">
            2. 이 프로젝트에서 &quot;기획-조직운영 도메인 업무 활동 계획 수립 및 실행 총괄&quot;을
            주로 담당하신 것이 맞나요?
          </p>
          <div className="flex gap-3 ml-4">
            <button
              onClick={() => handleYesNo('workDomain', true)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                answers.workDomain === true
                  ? 'border-[1px] border-[#81D7D4] bg-[#DAF3F3]'
                  : 'border-[0.6px] border-[#898989] bg-[#FFF]'
              }`}
            >
              예
            </button>
            <button
              onClick={() => handleYesNo('workDomain', false)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                answers.workDomain === false
                  ? 'border-[1px] border-[#81D7D4] bg-[#DAF3F3]'
                  : 'border-[0.6px] border-[#898989] bg-[#FFF]'
              }`}
            >
              아니오
            </button>
          </div>
        </div>
        <textarea
          value={answers.workDomainDetail}
          onChange={(e) => handleTextChange('workDomainDetail', e.target.value)}
          placeholder="올바른 내용을 알려주세요."
          className="w-full p-4 border border-gray-400 mb-[0px] rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:border-transparent bg-[#FFF]"
        />

        <Divider />

        <div className="flex items-center justify-between mb-4">
          <p className="text-black-400 font-medium flex-1">
            3. 전년대비 참여율 120% 달성, 회원 유지율 25%의 성과를 달성하신 것이 맞나요?
          </p>
          <div className="flex gap-3 ml-4">
            <button
              onClick={() => handleYesNo('achievement', true)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                answers.achievement === true
                  ? 'border-[1px] border-[#81D7D4] bg-[#DAF3F3]'
                  : 'border-[0.6px] border-[#898989] bg-[#FFF]'
              }`}
            >
              예
            </button>
            <button
              onClick={() => handleYesNo('achievement', false)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                answers.achievement === false
                  ? 'border-[1px] border-[#81D7D4] bg-[#DAF3F3]'
                  : 'border-[0.6px] border-[#898989] bg-[#FFF]'
              }`}
            >
              아니오
            </button>
          </div>
        </div>

        <Divider />

        <div className="flex items-center justify-between mb-4">
          <p className="text-black-400 font-medium flex-1">
            4. 프로젝트에 참여한 가장 인상적인 출 및 영향이었으며, 역할 분담은 어떻게 이루어졌나요?
          </p>
          <div className="flex gap-3 ml-4">
            <button
              onClick={() => handleYesNo('roleContribution', true)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                answers.roleContribution === true
                  ? 'border-[1px] border-[#81D7D4] bg-[#DAF3F3]'
                  : 'border-[0.6px] border-[#898989] bg-[#FFF]'
              }`}
            >
              예
            </button>

            <button
              onClick={() => handleYesNo('roleContribution', false)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                answers.roleContribution === false
                  ? 'border-[1px] border-[#81D7D4] bg-[#DAF3F3]'
                  : 'border-[0.6px] border-[#898989] bg-[#FFF]'
              }`}
            >
              아니오
            </button>
          </div>
        </div>
        <textarea
          value={answers.roleContributionDetail}
          onChange={(e) => handleTextChange('roleContributionDetail', e.target.value)}
          placeholder="올바른 내용을 알려주세요."
          className="w-full p-4 border border-gray-400 rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:border-transparent bg-[#FFF]"
        />
      </div>
    </div>
  );
}
