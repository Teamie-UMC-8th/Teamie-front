'use client';

import { useState } from 'react';

export default function New() {
  const [inviteVisible, setInviteVisible] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);

  const handleRedirect = () => {
    window.alert('프로젝트로 이동');
  };

  const handleCopyText = async () => {
    const textToCopy = `💡 프로젝트에 참여해 주세요!
아래 링크를 통해 참여를 수락하면, 
바로 협업을 시작할 수 있어요.
👉 참여하기: 참여 URL
링크 유효기간: 날짜까지`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setShowCopyModal(true);
      setTimeout(() => {
        setShowCopyModal(false);
      }, 5000);
    } catch (err) {
      window.alert('텍스트 복사에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <header className="flex items-center justify-between pb-[1rem] px-[0.5rem] border-b-[0.125rem] border-[#E7E7E7]">
        <h1 className="text-[1.375rem] lg:text-[1.5rem] font-semibold lg:font-bold">
          프로젝트 생성
        </h1>
      </header>

      <main className="flex items-center justify-center mt-[128px]">
        <div className="flex flex-col items-start justify-center gap-[16px]">
          <div className="text-[22px] font-semibold px-[4px]">프로젝트 명</div>
          <div className="flex justify-center gap-[16px]">
            {/*프로젝트 이름 입력*/}
            <input
              placeholder="프로젝트 이름을 입력해주세요."
              className="w-[440px] h-[50px] border-[2px] border-[#BBBBBB] rounded-[8px] px-[16px] py-[12px] text-[18px]"
            />
            <button
              className="cursor-pointer self-center px-[12px] py-[4px] whitespace-nowrap bg-[#81D7D4] rounded-[4px] text-white font-bold text-[18px]"
              onClick={() => setInviteVisible((prev) => !prev)}
            >
              + 생성하기
            </button>
          </div>
        </div>
      </main>

      {inviteVisible && (
        <div className="flex items-center justify-center mt-[60px]">
          <div className="flex flex-col items-cetner gap-[16px]">
            <h2 className="px-[4px] text-[22px] font-semibold text-black">
              링크로 팀원 초대
              <span className="px-[8px] text-[16px] font-normal">(유효기간: 7일)</span>
            </h2>

            <div className="bg-[#FFFFFF] p-[40px] border-[2px] border-[#BBBBBB] rounded-[12px] relative">
              <div className="bg-[#F8F8F8] rounded-[12px] relative">
                <p className="px-[120px] py-[32px] text-[18px] text-center">
                  💡 프로젝트에 참여해 주세요!
                  <br />
                  아래 링크를 통해 참여를 수락하면, <br />
                  바로 협업을 시작할 수 있어요.
                  <br />
                  👉 참여하기: 참여 URL
                  <br />
                  링크 유효기간: 날짜까지
                </p>

                <button
                  className="absolute top-[12px] right-[12px] cursor-pointer"
                  onClick={handleCopyText}
                >
                  <img src="/icons/copy_url.svg" alt="copy_url" />
                </button>

                {/* 복사 완료 모달 */}
                {showCopyModal && (
                  <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-[#F8F8F8] text-[#505050] px-[20px] py-[8px] border-[1.5px] border-[#BBBBBB] rounded-[6px] text-[18px] whitespace-nowrap">
                      초대 메세지가 복사되었습니다.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              className="cursor-pointer self-center mt-[32px] px-[40px] py-[10px] bg-[#81D7D4] text-white font-bold text-[18px] rounded-[6px]"
              onClick={handleRedirect}
            >
              프로젝트로 이동
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
