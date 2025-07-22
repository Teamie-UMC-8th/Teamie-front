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
      <div className="w-[17.5rem] h-[2rem] lg:w-[20.75rem] lg:h-[2.438rem] flex items-center px-[0.625rem] py-[0.375rem] justify-between bg-[#E7E7E7] rounded-[0.25rem]">
        <input
          type="text"
          placeholder={placeholder}
          className="rounded text-[1.125rem] pl-[0.125rem] text-[#898989]"
          onChange={onChange}
        />
        <img
          src="/icons/search.svg"
          className="w-[1.5rem] h-[1.5rem] lg:w-[1.75rem] lg:h-[1.75rem]"
        />
      </div>
      <button onClick={onFilterClick}>
        <img src="/icons/filter.svg" className="w-[2rem] h-[2rem]" />
      </button>
    </div>
  );
}
