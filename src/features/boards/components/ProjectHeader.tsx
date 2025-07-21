interface ProjectHeaderProps {
  projectName: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ProjectHeader({ projectName, isOpen, onToggle }: ProjectHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="cursor-pointer flex bg-[#DAF3F3] w-[20.313rem] h-[4.25rem] items-center justify-between rounded-[0.5rem]"
    >
      <span className="font-medium text-[1.125rem] mx-auto">{projectName}</span>
      <img
        src="/icons/arrow-down.svg"
        className={`w-[2rem] h-[2rem] mr-[0.25rem] ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
  );
}
