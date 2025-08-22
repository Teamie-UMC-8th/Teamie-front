import { useMasterPortfolioQuestions } from '@/hooks/queries/useGetMasterPortfolio';
import { useParams } from 'next/navigation';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import {
  MasterPortfolioQuestion,
  PatchMasterPortfolioQuestionItem,
  PatchMasterPortfolioQuestionsRequest,
} from '@/types/api/masterportfolio';

export function Divider() {
  return <div className="w-full h-[1px] my-[24px] bg-[#E7E7E7]" />;
}

export type Step3Handle = {
  buildDraftPayload: () => PatchMasterPortfolioQuestionsRequest;
  clearLocalDraft: () => void;
  saveToLocalStorage: () => void;
};

const Step3 = forwardRef<Step3Handle>(function Step3(_, ref) {
  const params = useParams();
  const portfolioId = Number(params.portfolioId);
  const { data: masterPortfolioQuestions } = useMasterPortfolioQuestions(portfolioId);

  // 로컬 상태: questionId -> { answer, reason }
  const [localAnswers, setLocalAnswers] = useState<
    Record<number, { answer: 'YES' | 'NO' | null; reason: string }>
  >({});

  const questions: MasterPortfolioQuestion[] = useMemo(
    () => (masterPortfolioQuestions?.result as MasterPortfolioQuestion[]) ?? [],
    [masterPortfolioQuestions]
  );

  // 페이지 진입 시 저장된 임시저장 데이터 로드
  useEffect(() => {
    const savedData = localStorage.getItem(`step3-draft-${portfolioId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setLocalAnswers(parsed);
      } catch (e) {
        console.error('저장된 데이터 파싱 실패:', e);
      }
    }
  }, [portfolioId]);

  // API 데이터와 로컬 데이터 동기화 (로컬 데이터 우선)
  useEffect(() => {
    if (!questions || questions.length === 0) return;

    setLocalAnswers((prev) => {
      const next = { ...prev }; // 기존 로컬 데이터 유지

      for (const q of questions) {
        if (q.questionId) {
          // 로컬에 없으면 API 데이터 사용, 있으면 로컬 데이터 유지
          if (!(q.questionId in prev)) {
            next[q.questionId] = {
              answer: (q.answer as 'YES' | 'NO' | null) ?? null,
              reason: q.reason ?? '',
            };
          }
        }
      }
      return next;
    });
  }, [questions]);

  // 임시저장을 localStorage에 저장하는 함수
  const saveToLocalStorage = () => {
    if (Object.keys(localAnswers).length > 0) {
      localStorage.setItem(`step3-draft-${portfolioId}`, JSON.stringify(localAnswers));
    }
  };

  useImperativeHandle(ref, () => ({
    buildDraftPayload: () => {
      const payload: PatchMasterPortfolioQuestionsRequest = [];

      for (const q of questions) {
        // questionId가 없으면 스킵
        if (!q.questionId) {
          console.warn('Question ID가 없습니다:', q);
          continue;
        }

        const state = localAnswers[q.questionId] ?? { answer: null, reason: '' };
        const originalAnswer = (q.answer as 'YES' | 'NO' | null) ?? null;
        const originalReason = q.reason ?? '';

        if (q.questionType === 'YES_NO') {
          // YES_NO 타입: answer가 있어야 함
          if (state.answer === null) continue;

          const changedAnswer = state.answer !== originalAnswer;
          const changedReason = state.answer === 'NO' && state.reason !== originalReason;

          if (changedAnswer || changedReason) {
            const item: PatchMasterPortfolioQuestionItem = {
              questionId: q.questionId,
              answer: state.answer,
            };
            // NO 답변일 때만 reason 추가
            if (state.answer === 'NO' && state.reason.trim()) {
              item.reason = state.reason.trim();
            }

            // 안전장치: YES 답변인데 reason이 있으면 제거
            if (state.answer === 'YES' && item.reason) {
              delete item.reason;
              console.warn(`질문 ID ${q.questionId}: YES 답변인데 reason이 있어서 제거했습니다.`);
            }

            console.log(
              `질문 ID ${q.questionId}: answer=${state.answer}, reason 포함 여부=${item.reason ? 'YES' : 'NO'}`
            );
            payload.push(item);
          }
        } else if (q.questionType === 'TEXT') {
          // TEXT 타입: reason만 관리하지만 answer도 필요할 수 있음
          if (state.reason !== originalReason && state.reason.trim()) {
            payload.push({
              questionId: q.questionId,
              reason: state.reason.trim(),
            });
          }
        }
      }

      console.log('Generated payload:', payload);
      return payload;
    },
    clearLocalDraft: () => {
      localStorage.removeItem(`step3-draft-${portfolioId}`);
      setLocalAnswers({});
    },
    saveToLocalStorage: saveToLocalStorage,
  }));

  const handleYesNo = (questionId: number, value: 'YES' | 'NO') => {
    setLocalAnswers((prev) => ({
      ...prev,
      [questionId]: {
        answer: value,
        reason: value === 'YES' ? '' : (prev[questionId]?.reason ?? ''), // YES면 빈 문자열
      },
    }));
    console.log(`질문 ID ${questionId}: ${value} 선택, reason 초기화됨`);
  };

  const handleReasonChange = (questionId: number, reason: string) => {
    setLocalAnswers((prev) => ({
      ...prev,
      [questionId]: {
        answer: prev[questionId]?.answer ?? null,
        reason,
      },
    }));
  };

  return (
    <div className="w-full h-fullmax-w-4xl mx-auto bg-white">
      <div className="mb-8">
        <p className="text-lg text-black-400 leading-relaxed">
          프로젝트와 관련하여 궁금한 점들이 생겼어요. <br />
          답변해주시면, 참고해서 더 좋은 품질의 마스터 포트폴리오를 생성할게요.
        </p>
      </div>

      <div className="space-y-8  rounded-[12px] bg-[#F8F8F8] shadow-[0_0_4px_rgba(0,0,0,0.20)] p-[24px]">
        {questions.map((q, idx) => {
          const state = localAnswers[q.questionId!] ?? { answer: null, reason: '' };
          return (
            <div key={q.questionId}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-black-400 font-medium flex-1 ">
                  {idx + 1}. {q.question}
                </p>
                {q.questionType === 'YES_NO' && (
                  <div className="flex gap-3 ml-4 ">
                    <button
                      onClick={() => handleYesNo(q.questionId!, 'YES')}
                      className={`w-[77px] h-[30px] rounded-md font-regular transition-colors cursor-pointer items-center justify-center whitespace-nowrap ${
                        state.answer === 'YES'
                          ? 'border-[1px] border-[#81D7D4] bg-[#DAF3F3]'
                          : 'border-[0.6px] border-[#898989] bg-[#FFF]'
                      }`}
                    >
                      예
                    </button>
                    <button
                      onClick={() => handleYesNo(q.questionId!, 'NO')}
                      className={`w-[77px] h-[30px] rounded-md font-regular transition-colors cursor-pointer items-center justify-center whitespace-nowrap ${
                        state.answer === 'NO'
                          ? 'border-[1px] border-[#81D7D4] bg-[#DAF3F3]'
                          : 'border-[0.6px] border-[#898989] bg-[#FFF]'
                      }`}
                    >
                      아니오
                    </button>
                  </div>
                )}
              </div>

              {q.questionType === 'YES_NO' && state.answer === 'NO' && (
                <textarea
                  value={state.reason}
                  onChange={(e) => handleReasonChange(q.questionId!, e.target.value)}
                  placeholder="올바른 내용을 알려주세요."
                  className="w-full p-4 border border-gray-400 rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:border-transparent bg-[#FFF]"
                />
              )}

              {q.questionType === 'TEXT' && (
                <textarea
                  value={state.reason}
                  onChange={(e) => handleReasonChange(q.questionId!, e.target.value)}
                  placeholder="올바른 내용을 알려주세요."
                  className="w-full p-4 border border-gray-400 rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:border-transparent bg-[#FFF]"
                />
              )}

              {idx < questions.length - 1 && <Divider />}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Step3;
