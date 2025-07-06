'use client';

export default function aiportfolio() {
  return (
    <div>
      <header className="flex items-center">
        <img src="/icons/arrow-left.svg" alt="뒤로가기" className="mt-[29px] ml-[97px]" />
        <h1 className="text-[24px] text-[#898989] font-semibold mt-[28px] ml-[20px]">
          제출처를 입력해주세요.
        </h1>
      </header>

      {/* Divider line */}
      <div className="mt-[10px] ml-[128px] border-[#E7E7E7] border-[1px] " />

      <body>
        <div className="flex flex-row mt-[60px] ml-[168px] items-center">
          <div className="w-[100px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px]">
            생성 일자
          </div>
          <p className="text-black text-[20px] grid place-items-center ml-[28px]">2000.04.21</p>
          <div className="w-[100px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] ml-[160px]">
            분류
          </div>
          <div className="w-[75px] h-[34px] bg-[#BED9FB] grid place-items-center rounded-[4px] gap-[10px] ml-[28px]">
            진행상태
          </div>
          <div className="w-[36px] h-[36px] grid place-items-center">
            <img src="/icons/drop-down.svg" alt="진행상태" />
          </div>
          <div className="w-[100px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] ml-[160px] ">
            직무명
          </div>
          <input
            className="w-[183px] h-[30px] text-[20px] ml-[28px] grid place-items-center text-[#898989] "
            placeholder="직무명을 입력해주세요."
          />
        </div>
        <div className="flex flex-row mt-[40px] ml-[168px] ">
          <div className="w-[113px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] mr-[20px] rounded-[4px]">
            강조 포인트
          </div>
          <textarea
            className="w-[965px] h-[102px] text-[18px] border border-[#BBBBBB] rounded-[8px] p-[10px] resize-none text-[#898989]"
            placeholder="포트폴리오에서 강조하고 싶은 포인트를 입력해주세요"
          />
        </div>

        <div className="flex flex-row mt-[80px] ml-[168px]">
          <div className="text-[22px] mr-[4px]">기업 분석 정보</div>
          <img src="/icons/mi_circle-information.svg" alt="분석 아이콘" />
        </div>
        <input className="flex flex-row mt-[19px] ml-[168px] place-items-center border border-[#BBBBBB] w-[1520px] h-[200px] rounded-[8px]" />

        <div className="flex flex-row mt-[40px] ml-[168px] text-[22px] items-center">
          <div>JD (Job Description)</div>
          <div className="text-[18px] text-[#898989] ml-[4px] mr-[4px]">(선택)</div>
          <img src="/icons/mi_circle-information.svg" alt="정보 아이콘" />
        </div>
        <textarea
          className="mt-[16px] ml-[168px] w-[1520px] h-[162px] border border-[#BBBBBB] text-[#898989] rounded-[8px] resize-none pt-[16px] pl-[20px] text-[20px] "
          placeholder="채용공고의 JD를 복사 후 붙여넣기 해주세요."
        />
        <button className="mt-[60px] ml-[770.5px] cursor-pointer ">
          <img src="/icons/AiPortfolioCreate.svg" alt="포트폴리오생성" />
        </button>
      </body>
    </div>
  );
}
