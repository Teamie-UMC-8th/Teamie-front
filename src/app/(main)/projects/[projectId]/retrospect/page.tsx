"use client";

export default function PersonalRetroPage() {
  return (
    <div className="pt-[125px] pl-[313px]">
      {/* 제목 */}
      <h2 className="mb-[16px] font-[Pretendard] font-bold text-[24px] leading-[29px] tracking-[0.04em] text-black whitespace-nowrap">
        회고
      </h2>

      {/* 구분선 */}
      <hr className="w-[1495px] border-t-[2px] border-[#E7E7E7] mb-[40px]" />

      {/* 카드 두 개 나란히 */}
      <div className="flex gap-[100px]">
        {/* 팀장 카드 */}
        <div className="w-[562px] h-[310px] bg-white rounded-[16px] shadow-[0_0_15px_rgba(0,0,0,0.2)] flex flex-col items-center text-center p-[24px] gap-[53px]">
          <strong className="text-[16px] font-bold leading-[26px] mb-[8px]">
            팀장만 종료 가능합니다.
          </strong>
          <p className="text-[14px] leading-[22px] text-black mb-[32px]">
            프로젝트를 종료하면 프로젝트 대시보드 내의 <br />
            모든 내용을 수정하거나 삭제할 수 없게 됩니다. <br />
            또, 지금까지 진행한 내용을 바탕으로 팀 회고와 개인회고를 작성합니다.
          </p>
          <button className="bg-[#81D7D4] border border-[#81D7D4] rounded-[6px] px-[40px] py-[10px] text-white text-[14px] font-bold leading-[22px] w-[178px] h-[46px] whitespace-nowrap">
            프로젝트 종료
          </button>
        </div>

        {/* 팀원 카드 */}
        <div className="w-[562px] h-[310px] bg-[#F8F8F8] rounded-[16px] shadow-[0_0_15px_rgba(0,0,0,0.2)] flex flex-col items-center text-center p-[24px]">
          <strong className="text-[16px] font-bold leading-[26px] text-[#888888] mb-[8px]">
            팀장은 이탈이 불가능합니다.
          </strong>
          <p className="text-[14px] font-medium leading-[22px] text-[#888888] mb-[8px]">
            팀장 권한을 타 팀원에게 부여한 후 이탈해주세요.
          </p>
          <p className="text-[14px] leading-[22px] text-[#888888] mb-[32px]">
            프로젝트에서 이탈하면 팀원들과의 실시간 연동이 종료되며, <br />
            업로드한 자료는 팀원들이 자유롭게 사용할 수 있습니다. <br />
            팀 회고는 진행되지 않으며, 개인 회고만 진행하게 됩니다.
          </p>
          <button className="bg-[#EFC9C9] border border-[#EFC9C9] rounded-[6px] px-[40px] py-[10px] text-white text-[14px] font-bold leading-[22px] w-[178px] h-[46px] whitespace-nowrap">
            프로젝트 이탈
          </button>
        </div>
      </div>
    </div>
  );
}
