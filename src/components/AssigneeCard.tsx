interface AssigneeCardProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md';
  showCheckbox?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export default function AssigneeCard({
  name,
  imageUrl,
  size = 'sm',
  showCheckbox = false,
  checked = false,
  onChange,
  className = '',
}: AssigneeCardProps) {
  const sizeClasses = {
    sm: 'w-[16px] h-[16px] text-[12px]',
    md: 'w-6 h-6 text-sm',
  };

  const textSizeClasses = {
    sm: 'text-[12px]',
    md: 'text-[16px]]',
  };

  const paddingClasses = {
    sm: 'px-[3px] pr-[9px] py-[2px]',
    md: 'px-1 pr-3 py-1',
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <div
      className={`inline-flex items-center gap-[8px] rounded-[30px] ${paddingClasses[size]} ${className}`}
      style={!showCheckbox ? { boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.25)' } : {}}
    >
      {showCheckbox && (
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheckboxChange}
          className="w-4 h-4 text-[#81D7D4] rounded border-gray-300 focus:ring-[#81D7D4]"
        />
      )}

      <img
        src={imageUrl || '/icons/assignee.svg'}
        alt={`${name} 프로필`}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
      <span className={`${textSizeClasses[size]}`}>{name}</span>
    </div>
  );
}
