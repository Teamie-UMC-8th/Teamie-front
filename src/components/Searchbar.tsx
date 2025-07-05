interface SearchbarProps {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterClick?: () => void;
}

export function Searchbar({
  placeholder = '검색어를 입력하세요.',
  onChange,
  onFilterClick,
}: SearchbarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[332px] h-[39px] flex items-center px-[10px] py-[6px] justify-between bg-[#E7E7E7] rounded-[4px]">
        <input
          type="text"
          placeholder={placeholder}
          className="rounded text-[18px] pl-[2px] text-[#898989]"
          onChange={onChange}
        />
        <img src="/icons/search.svg" className="w-[28px] h-[28px]" />
      </div>
      <button onClick={onFilterClick}>
        <img src="/icons/filter.svg" className="w-[32px] h-[32px]" />
      </button>
    </div>
  );
}
