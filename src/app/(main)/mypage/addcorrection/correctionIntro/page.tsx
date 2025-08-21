'use client';
/* eslint-disable @next/next/no-img-element */

import CorrectionRequestStartButton from '@/features/correction/components/CorrectionRequestStartButton';
import LoadingModal from '@/features/correction/components/AddLoadingModal';
import { useEffect, useRef, useState } from 'react';
import { useUser } from '@/hooks/mutations/useUser';
// import { useRouter } from 'next/navigation';
import { CreateCorrectionRequest } from '@/types/api/correction';
import Image from 'next/image';

export default function CorrectionIntro() {
  // const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [isLoadingOpen, setIsLoadingOpen] = useState(false);
  const [startFromLast, setStartFromLast] = useState(false);
  const [payload, setPayload] = useState<CreateCorrectionRequest | null>(null);
  const { data: currentUser } = useUser();
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jd, setJd] = useState('');

  // 이 페이지를 마지막 방문 위치로 기록 (복귀 라우팅에 사용) + 모달 복구
  useEffect(() => {
    try {
      sessionStorage.setItem('correctionIntro:last', 'true');
      if (sessionStorage.getItem('correctionIntro:modal')) {
        setIsLoadingOpen(true);
        setStartFromLast(true);
        // payload는 비워서 재생성 방지
        setPayload(null);
      }
    } catch {}
  }, []);

  // JD 입력 필드 자동 리사이즈 비활성화 (고정 높이 유지)

  const handleStart = () => {
    const company = companyName.trim();
    const job = jobTitle.trim();
    const jdText = jd.trim();

    if (!company || !job || !jdText) {
      alert('기업명, 직무명, JD를 모두 입력해주세요.');
      return;
    }

    const payload = {
      // title은 백엔드에서 이후 자동 생성/수정될 예정이므로 임시로 동일 값 전달
      title: company,
      jobTitle: job,
      jd: jdText,
      // 기업명은 submissionTarget에 전달
      submissionTarget: company,
    } as const;
    console.log('[AI 첨삭 생성] 요청 페이로드:', payload);
    try {
      // analyzing, tailored에서 공통으로 사용할 기업명 캐시 저장
      // 생성 직전에 저장하여 이후 전 페이지에서 동일 기업명이 노출되도록 함
      sessionStorage.setItem('lastCorrectionCompanyName', company);
      sessionStorage.setItem('correctionIntro:modal', 'true');
    } catch {}
    setPayload(payload);
    setIsLoadingOpen(true);
  };

  /* TODO: Sidebar 제거 후 간격 재조정 */
  return (
    <div
      className="ml-[320px]
    max-lg:ml-[24px]"
    >
      <div className="flex flex-col items-center">
        <LoadingModal isOpen={isLoadingOpen} payload={payload} startFromLast={startFromLast} />
        <div
          className="w-[1323px] h-[52px] bg-[#E9F8F8] rounded-tl-[8px] rounded-tr-[8px] px-[24px] py-[12px] font-semibold text-[20px]
        max-lg:w-[908px]"
        >
          AI 지원 맞춤 포트폴리오 첨삭
        </div>
        <div
          className="w-[1359px] h-auto pb-[40px] bg-[#F8F8F8] rounded-[16px] relative
        max-lg:w-[928px] max-lg:h-[1068px]"
          style={{ boxShadow: '0px 0px 10px 0px #00000033' }}
        >
          <div
            className="flex items-start ml-[60px] mt-[32px]
          max-lg:ml-[32px] max-lg:mt-[8px]"
          >
            <img
              src="/icons/AiCharacter.svg"
              alt="AI 로고"
              className="translate-y-[18px]
            max-lg:w-[70px] max-lg:h-[70px] max-lg:translate-y-[32px]"
            />
            <div className="relative">
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
                  안녕하세요! {currentUser?.name ?? '팀원'}님의 포트폴리오를 첨삭할 AI, 티미입니다.
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

          <div
            className="relative mt-[36px] ml-[560px] w-[770px] h-[600px]
            max-lg:ml-[150px] max-lg:mt-[16px] "
          >
            <Image
              src="/icons/SubBubble.svg"
              alt="말풍선"
              width={770}
              height={620}
              className="absolute top-0 left-0"
            />
            <div className="flex flex-col absolute top-[36px] left-[48px]" ref={formRef}>
              <p className="font-semibold text-[18px] ">기업명</p>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="border border-[#BBBBBB] w-[645px] h-[42px] rounded-[4px] mt-[2px] px-[12px]"
              />
              <p className="font-semibold text-[18px] mt-[16px]">직무명</p>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="border border-[#BBBBBB] w-[645px] h-[42px] rounded-[4px] mt-[2px] px-[12px]"
              />
              <p className="font-semibold text-[18px] mt-[16px]">Job Description</p>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                className="border border-[#BBBBBB] w-[645px] h-[268px] resize-none overflow-y-auto rounded-[4px] mt-[2px] px-[12px] py-[10px] mb-[8px] "
              />

              <CorrectionRequestStartButton
                onStart={handleStart}
                disabled={!(companyName.trim() && jobTitle.trim() && jd.trim())}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
