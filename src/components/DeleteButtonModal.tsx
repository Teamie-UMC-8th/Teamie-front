type DeleteButtonModalProps = {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteButtonModal({ title, onConfirm, onCancel }: DeleteButtonModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative w-[460px] bg-[#F8F8F8] shadow-[0_0_15px_rgba(0,0,0,0.2)] rounded-[12px] px-[32px] pt-[40px] pb-[40px]">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-[8px] right-[8px] w-[24px] h-[24px] cursor-pointer"
          onClick={onCancel}
        >
          <img src="/icons/곱하기.svg" alt="닫기" className="w-[24px] h-[24px]" />
        </button>

        {/* 질문 문구 */}
        <h3 className="text-[24px] leading-[30px] font-[Pretendard] font-bold text-center text-[#000000] mb-[32px]">
          {title}
        </h3>

        {/* 버튼 그룹 */}
        <div className="flex justify-center gap-[20px]">
          <button
            onClick={onConfirm} // 
            className="w-[134px] h-[46px] px-[10px] py-[8px]
                       bg-[#FFFFFF] rounded-[8px]
                       text-[24px] leading-[30px] font-[Pretendard] font-medium
                       text-[#000000] whitespace-nowrap cursor-pointer"
            style={{ border: "1.5px solid #BBBBBB" }}
          >
            예
          </button>

          <button
            onClick={onCancel}
            className="w-[134px] h-[46px] px-[10px] py-[8px]
                       bg-[#FFFFFF] rounded-[8px]
                       text-[24px] leading-[30px] font-[Pretendard] font-medium
                       text-[#000000] whitespace-nowrap cursor-pointer"
            style={{ border: "1.5px solid #BBBBBB" }}
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}
