type Props = {
  value: string; // 댓글 수정 입력값
  onChange: (value: string) => void; // 댓글 수정 입력값 변경 핸들러
  onSubmit: () => void; // 댓글 수정 제출 핸들러
};

export default function EditComment({ value, onChange, onSubmit }: Props) {
  return (
    <div
      className="relative w-[1288px]
    max-lg:w-[735px]"
    >
      {/* 입력 필드: 댓글 내용을 수정할 수 있도록 함 */}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-[20px] w-full h-[50px] bg-white rounded-[8px] border-[2px] border-[#BBBBBB]"
        placeholder="댓글을 수정하세요"
      />
      {/* 수정 완료 버튼: 클릭 시 수정 완료 처리 함수 호출 */}
      <button
        onClick={onSubmit}
        className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] cursor-pointer"
      >
        <img src="/icons/comment-enter.svg" alt="수정완료" />
      </button>
    </div>
  );
}
