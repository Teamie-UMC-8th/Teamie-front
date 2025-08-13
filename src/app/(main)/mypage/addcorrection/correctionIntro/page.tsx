'use client';
/* eslint-disable @next/next/no-img-element */

import CorrectionRequestStartButton from '@/features/correction/components/CorrectionRequestStartButton';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateCorrection } from '@/hooks/mutations/useCreateCorrection';

export default function CorrectionIntro() {
  const router = useRouter();
  const createCorrection = useCreateCorrection();
  const formRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    const container = formRef.current;
    const inputs = container?.querySelectorAll('input') ?? [];
    const textarea = container?.querySelector('textarea');

    const title = (inputs[0] as HTMLInputElement | undefined)?.value?.trim() ?? '';
    const jobTitle = (inputs[1] as HTMLInputElement | undefined)?.value?.trim() ?? '';
    const jd = (textarea as HTMLTextAreaElement | null)?.value?.trim() ?? '';

    if (!title || !jobTitle || !jd) {
      alert('기업명, 직무명, JD를 모두 입력해주세요.');
      return;
    }

    const payload = {
      title,
      jobTitle,
      jd,
      submissionTarget: '포트폴리오',
    } as const;

    // 디버그: 요청 페이로드 로그
    console.log('[AI 첨삭 생성] 요청 페이로드:', payload);

    createCorrection.mutate(payload, {
      onSuccess: (data) => {
        // 디버그: 성공 응답 로그
        console.log('[AI 첨삭 생성] 성공 응답:', data);
        try {
          sessionStorage.setItem('lastCorrectionId', String(data.id));
        } catch {}
        router.push(
          `/mypage/addcorrection/analyzing?correctionId=${data.id}&companyName=${encodeURIComponent(
            title
          )}`
        );
      },
      onError: (error) => {
        // 디버그: 실패 응답 로그
        console.error('[AI 첨삭 생성] 실패:', error);
        // 가능한 경우 서버 응답 본문도 함께 출력
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const responseData = (error as any)?.response?.data;
          if (responseData) {
            console.error('[AI 첨삭 생성] 서버 응답 데이터:', responseData);
          }
        } catch {}
        alert('첨삭 생성에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  /* TODO: Sidebar 제거 후 간격 재조정 */
  return (
    <div
      className="ml-[300px]
    max-lg:ml-[24px]"
    >
      <div className="flex flex-col items-center">
        <div
          className="w-[1323px] h-[52px] bg-[#E9F8F8] rounded-tl-[8px] rounded-tr-[8px] px-[24px] py-[12px] font-semibold text-[20px]
        max-lg:w-[908px]"
        >
          AI 지원 맞춤 포트폴리오 첨삭
        </div>
        <div
          className="w-[1359px] h-[800px] bg-[#F8F8F8] rounded-[16px] relative
        max-lg:w-[928px] max-lg:h-[878px]"
          style={{ boxShadow: '0px 0px 10px 0px #00000033' }}
        >
          <div
            className="flex items-start ml-[60px] mt-[32px]
          max-lg:ml-[32px] max-lg:mt-[8px]"
          >
            <img
              src="/icons/AiCharacter.svg"
              alt="AI 로고"
              className="translate-y-[34px]
            max-lg:w-[60px] max-lg:h-[60px] max-lg:translate-y-[32px]"
            />
            <div
              className="relative ml-[28px]
            max-lg:ml-[8px]"
            >
              <img src="/icons/TitleBubble.svg" alt="말풍선" className="block max-lg:hidden" />
              <img
                src="/icons/ResponsiveTitleBubble.svg"
                alt="반응형 말풍선"
                className="hidden max-lg:block"
              />
              <div
                className="absolute top-[0px] left-[0px] text-[18px] text-black py-[44px] px-[104px] max-w-[1100px]
              max-lg:px-[90px] max-lg:py-[40px]"
              >
                <p className="font-semibold">
                  안녕하세요! 두현우님의 포트폴리오를 첨삭할 AI, 티미입니다.
                </p>
                <p className="mt-[36px]">
                  지원하고자 하는 기업명, 직무명, 그리고 해당 포지션의 Job Description을
                  입력해주시면, 기업 분석 정보를 생성할게요.
                </p>
                <p className="mt-[36px]">
                  JD (Job Description)는 채용공고에 명시된 직무 설명서로, 회사에서 어떤 일을 할
                  사람을 찾고 있는지, 그 사람이 어떤 능력을 가져야 하는지 정리한 글이에요.
                </p>
                <p>주로 담당할 업무, 자격요건, 우대사항 등이 포함돼요.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div
              className="absolute right-7 mt-[16px]
            max-lg:right-0"
            >
              <img src="/icons/SubBubble.svg" alt="말풍선" />
              <div className="absolute top-[40px] left-[50px] flex-col" ref={formRef}>
                <p className="font-semibold text-[18px] ">기업명</p>
                <input className="border border-[#BBBBBB] w-[645px] h-[42px] rounded-[4px] mt-[2px] px-[12px]" />
                <p className="font-semibold text-[18px] mt-[16px]">직무명</p>
                <input className="border border-[#BBBBBB] w-[645px] h-[42px] rounded-[4px] mt-[2px] px-[12px]" />
                <p className="font-semibold text-[18px] mt-[16px]">Job Description</p>
                <textarea className="border border-[#BBBBBB] w-[645px] h-[64px] rounded-[4px] mt-[2px] px-[12px] py-[10px] " />

                <CorrectionRequestStartButton onStart={handleStart} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
