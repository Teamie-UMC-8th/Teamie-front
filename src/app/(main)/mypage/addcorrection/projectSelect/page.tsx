'use client';

import Projects from '@/features/mypage/components/Projects';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import MasterLoadingModal from '@/features/aimasterportfolio/components/MasterLoadingModal';
import { fetchGeneratedCorrection, postGenerateCorrection } from '@/services/correction/correction';

export default function ProjectSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const correctionIdFromQuery =
    Number(searchParams.get('correctionId')) || Number(searchParams.get('id'));
  const correctionId = useMemo(() => {
    if (Number.isFinite(correctionIdFromQuery) && correctionIdFromQuery > 0)
      return correctionIdFromQuery;
    try {
      const last = Number(sessionStorage.getItem('lastCorrectionId'));
      return Number.isFinite(last) ? last : NaN;
    } catch {
      return correctionIdFromQuery;
    }
  }, [correctionIdFromQuery]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Projects 컴포넌트에서 선택된 포트폴리오 ID들을 sessionStorage에 저장하도록 하고, 여기서 읽어 사용
  const getSelectedProjectIds = (): number[] => {
    try {
      const raw = sessionStorage.getItem('projectSelect:selected');
      const arr = raw ? (JSON.parse(raw) as number[]) : [];
      return Array.isArray(arr)
        ? arr
            .slice(0, 6)
            .map((n) => Number(n))
            .filter(Number.isFinite)
        : [];
    } catch {
      return [];
    }
  };

  const waitUntilGenerated = useCallback(async (id: number) => {
    const maxWaitMs = 120000; // 2분
    const start = Date.now();
    while (true) {
      const result = await fetchGeneratedCorrection(id).catch(() => null);
      if (
        result &&
        Array.isArray(result.projects) &&
        result.projects.length > 0 &&
        result.firstCorrection
      ) {
        try {
          sessionStorage.setItem(`generatedCorrection:${id}`, JSON.stringify(result));
        } catch {}
        return result;
      }
      if (Date.now() - start > maxWaitMs) throw new Error('Timeout waiting for generated data.');
      await new Promise((res) => setTimeout(res, 2000));
    }
  }, []);

  const handleGenerate = async (e: React.MouseEvent) => {
    e.preventDefault();
    const ids = getSelectedProjectIds();
    if (!correctionId || ids.length === 0) return;
    try {
      setIsGenerating(true);
      await postGenerateCorrection(correctionId, { selectedProjects: ids });
      await waitUntilGenerated(correctionId);
      router.push(`/mypage/tailoredportfolio/${correctionId}`);
    } catch (err) {
      console.error('[ProjectSelect] generate failed:', err);
      alert('첨삭 생성에 실패했습니다. 다시 시도해주세요.');
      setIsGenerating(false);
    }
  };
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
          className="w-[1359px] h-[970px] bg-[#F8F8F8] rounded-[16px] relative
        max-lg:w-[928px] max-lg:h-[947px]"
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
              <img
                src="/icons/ProjectSelectBubble.svg"
                alt="로딩중 말풍선"
                className="block max-lg:hidden"
              />
              <img
                src="/icons/ResponsiveProjectSelectBubble.svg"
                alt="반응형 프로젝트 선택 말풍선"
                className="hidden max-lg:block"
              />
              <div
                className="absolute top-[0px] left-[0px] py-[42px] px-[90px] text-[18px]
              max-lg:text-[16px]"
              >
                <p>어떤 프로젝트의 내용을 포트폴리오로 제출하려고 하시나요?</p>
                <p>선택하신 프로젝트의 마스터 포트폴리오를 바탕으로 첨삭을 진행할게요.</p>
                <div className="flex mt-[36px]">
                  <p className="font-semibold">최대 6개</p>
                  <p>의 프로젝트까지 선택 가능해요.</p>
                </div>
                <div
                  className="border border-[#898989] rounded-[12px] w-[1008px] h-[506px] mt-[24px] px-[24px] py-[24px] overflow-y-auto
                max-lg:mt-[50px] max-lg:w-[521px] max-lg:h-[512px] max-lg:px-[28px] max-lg:py-[24px] max-lg:ml-[57px]"
                >
                  <Projects />
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative ml-[920px] mt-[20px]
          max-lg:ml-[496px]"
          >
            <img src="/icons/CorrectionStartBubble.svg" alt="첨삭 시작 말풍선" />
            <button
              onClick={handleGenerate}
              className="absolute top-[36px] left-[52px] cursor-pointer"
            >
              <img src="/icons/CorrectionStartButton.svg" alt="첨삭 시작 버튼" />
            </button>
          </div>

          {isGenerating && <MasterLoadingModal isOpen startFromLast />}
        </div>
      </div>
    </div>
  );
}
