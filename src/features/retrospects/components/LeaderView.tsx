"use client";

import { useState } from "react";
import ProjectEndModal from "./ProjectEndModal";

export default function LeaderView() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full px-[255px] pt-[60px] max-lg:px-[128px]">
      {/* 제목 */}
      <h2
        className="
          font-[Pretendard] text-[#000000] whitespace-nowrap
          font-bold text-[24px] leading-[29px] tracking-[0.04em]
          max-lg:font-semibold max-lg:text-[22px] max-lg:leading-[28px] max-lg:tracking-[0]
          mb-[16px]
        "
      >
        회고
      </h2>

      {/* 구분선 */}
      <hr className="w-full border-t-[2px] border-[#E7E7E7] rotate-180 mb-[195px]" />

      {/* 카드 영역 (MemberView와 동일하게 반응형 적용) */}
      <div
        className="
          flex gap-[100px] pl-[360px] pr-[361px]
          max-lg:flex-col max-lg:gap-[80px] max-lg:px-[198px]
        "
      >
        {/* 팀장 카드 */}
        <div className="w-[562px] h-[310px] bg-white rounded-[16px] shadow-[0_0_15px_rgba(0,0,0,0.2)] flex flex-col items-center text-center p-[24px] gap-[20px] pt-[53px]">
          <strong className="text-[18px] font-bold leading-[26px] mb-[20px]">
            팀장만 종료 가능합니다.
          </strong>
          <p className="text-[16px] leading-[24px] text-black mb-[15px]">
            프로젝트를 종료하면 프로젝트 대시보드 내의 <br />
            모든 내용을 수정하거나 삭제할 수 없게 됩니다. <br />
            또, 지금까지 진행한 내용을 바탕으로 팀 회고와 개인회고를 작성합니다.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#81D7D4] border border-[#81D7D4] rounded-[6px] px-[40px] py-[10px] text-white text-[18px] font-bold leading-[22px] w-[178px] h-[46px] whitespace-nowrap"
          >
            프로젝트 종료
          </button>
        </div>

        {/* 팀원 카드 */}
        <div className="w-[562px] h-[310px] bg-[#F8F8F8] rounded-[16px] shadow-[0_0_15px_rgba(0,0,0,0.2)] flex flex-col items-center text-center p-[24px] pt-[40px] text-[#898989]">
          <strong className="text-[18px] font-bold leading-[26px] text-[#898989] mb-[20px]">
            팀장은 이탈이 불가능합니다. <br />
            팀장 권한을 타 팀원에게 부여한 후 이탈해주세요.
          </strong>
          <p className="text-[16px] leading-[24px] mb-[40px]">
            프로젝트에서 이탈하면 팀원들과의 실시간 연동이 종료되며, <br />
            업로드한 자료는 팀원들이 자유롭게 사용할 수 있습니다. <br />
            팀 회고는 진행되지 않으며, 개인 회고만 진행하게 됩니다.
          </p>
          <button
            className="bg-[#EFC9C9] border border-[#EFC9C9] rounded-[6px] px-[40px] py-[10px] text-white text-[18px] font-bold leading-[22px] w-[178px] h-[46px] whitespace-nowrap opacity-50 cursor-not-allowed mb-[40px]"
            disabled
          >
            프로젝트 이탈
          </button>
        </div>
      </div>

      {/* 종료 모달 */}
      {isModalOpen && (
        <ProjectEndModal
          onConfirm={() => {
            alert("프로젝트 종료!");
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
