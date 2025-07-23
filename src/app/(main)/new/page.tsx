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

      <main className="flex items-center justify-center mt-[8rem]">
        <div className="flex flex-col items-start justify-center gap-[1rem]">
          <div className="lg:text-[1.375rem] text-[1.25rem] font-semibold px-[0.25rem]">
            프로젝트 명
          </div>
          <div className="flex justify-center gap-[1rem]">
            {/*프로젝트 이름 입력*/}
            <input
              placeholder="프로젝트 이름을 입력해주세요."
              className="lg:w-[27.5rem] lg:h-[3.125rem] w-[20.75rem] h-[3rem] border-[0.125rem] border-[#BBBBBB] rounded-[0.5rem] px-[1rem] py-[0.75rem] lg:text-[1.125rem] text-[1rem]"
            />
            <button
              className="cursor-pointer self-center px-[0.75rem] py-[0.25rem] whitespace-nowrap bg-[#81D7D4] rounded-[0.25rem] text-white font-bold text-[1.125rem]"
              onClick={() => setInviteVisible((prev) => !prev)}
            >
              + 생성하기
            </button>
          </div>
        </div>
      </main>

      {inviteVisible && (
        <div className="flex items-center justify-center mt-[3.75rem]">
          <div className="flex flex-col items-cetner gap-[1rem]">
            <h2 className="px-[0.25rem] lg:text-[1.375rem] text-[1.25rem] font-semibold text-black">
              링크로 팀원 초대
              <span className="hidden lg:inline px-[0.5rem] text-[1rem] font-normal">
                (유효기간: 7일)
              </span>
            </h2>

            <div className="bg-[#FFFFFF] p-[2.5rem] border-[0.125rem] border-[#BBBBBB] rounded-[0.75rem] relative">
              <div className="bg-[#F8F8F8] rounded-[0.75rem] relative">
                <p className="lg:px-[7.5rem] px-[4.75rem] py-[2rem] lg:text-[1.125rem] text-[1rem] text-center">
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
                  className="absolute top-[0.75rem] right-[0.75rem] cursor-pointer"
                  onClick={handleCopyText}
                >
                  <img src="/icons/copy_url.svg" alt="copy_url" />
                </button>

                {/* 복사 완료 모달 */}
                {showCopyModal && (
                  <div className="absolute bottom-[-1.25rem] left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-[#F8F8F8] text-[#505050] px-[1.25rem] py-[0.5rem] border-[0.09375rem] border-[#BBBBBB] rounded-[0.375rem] lg:text-[1.125rem] text-[1rem] whitespace-nowrap">
                      초대 메세지가 복사되었습니다.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              className="cursor-pointer self-center lg:mt-[2rem] mt-[1.5rem] px-[2.5rem] py-[0.625rem] bg-[#81D7D4] text-white font-bold text-[1.125rem] rounded-[0.375rem]"
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
