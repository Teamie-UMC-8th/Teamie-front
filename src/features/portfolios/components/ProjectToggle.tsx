'use client';

type ToggleOption = 'project' | 'ai';

interface ProjectToggleProps {
  selected: ToggleOption;
  setSelected: (value: ToggleOption) => void;
}

export default function ProjectToggle({ selected, setSelected }: ProjectToggleProps) {
  return (
    <div className="flex bg-[#F8F8F8] w-[207px] h-[42px] rounded-[4px] items-center justify-center border border-[#E7E7E7]">
      <button
        onClick={() => setSelected('project')}
        className={`w-[87px] h-[34px] text-[18px] rounded-[4px] transition-colors  ${
          selected === 'project' ? 'bg-[#84D9D4] text-white' : 'text-[#B2B2B2]'
        }`}
      >
        프로젝트
      </button>
      <button
        onClick={() => setSelected('ai')}
        className={`w-[112px] h-[34px] text-[18px] rounded-[4px] transition-colors  ${
          selected === 'ai' ? 'bg-[#84D9D4] text-white' : 'text-[#B2B2B2]'
        }`}
      >
        AI 지원 맞춤
      </button>
    </div>
  );
}
