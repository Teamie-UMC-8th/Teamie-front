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

  useEffect(() => {
    if (!questions || questions.length === 0) return;
    setLocalAnswers((prev) => {
      const next: Record<number, { answer: 'YES' | 'NO' | null; reason: string }> = { ...prev };
      for (const q of questions) {
        next[q.id!] = {
          answer: (q.answer as 'YES' | 'NO' | null) ?? null,
          reason: q.reason ?? '',
        };
      }
      return next;
    });
  }, [questions]);

  // 외부에서 호출할 임시저장 페이로드 생성기
  useImperativeHandle(ref, () => ({
    buildDraftPayload: () => {
      const payload: PatchMasterPortfolioQuestionsRequest = [];

      for (const q of questions) {
        const state = localAnswers[q.id!] ?? { answer: null, reason: '' };
        const originalAnswer = (q.answer as 'YES' | 'NO' | null) ?? null;
        const originalReason = q.reason ?? '';

        if (q.questionType === 'YES_NO') {
          if (state.answer === null) continue;
          const changedAnswer = state.answer !== originalAnswer;
          const changedReason = state.answer === 'NO' && state.reason !== originalReason;

          if (changedAnswer || changedReason) {
            const item: PatchMasterPortfolioQuestionItem = {
              questionId: q.id!,
              answer: state.answer,
            };
            if (state.answer === 'NO') {
              item.reason = state.reason;
            }
            payload.push(item);
          }
        } else {
          // TEXT: reason만 관리
          if (state.reason !== originalReason) {
            payload.push({ questionId: q.id!, reason: state.reason });
          }
        }
      }

      return payload;
    },
  }));

  const handleYesNo = (questionId: number, value: 'YES' | 'NO') => {
    setLocalAnswers((prev) => ({
      ...prev,
      [questionId]: {
        answer: value,
        reason: value === 'YES' ? '' : (prev[questionId]?.reason ?? ''),
      },
    }));
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
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <p className="text-lg text-black-400 leading-relaxed">
          프로젝트와 관련하여 궁금한 점들이 생겼어요. <br />
          답변해주시면, 참고해서 더 좋은 품질의 마스터 포트폴리오를 생성할게요.
        </p>
      </div>

      <div className="space-y-8  rounded-[12px] bg-[#F8F8F8] shadow-[0_0_4px_rgba(0,0,0,0.20)] p-[24px]">
        {questions.map((q, idx) => {
          const state = localAnswers[q.id!] ?? { answer: null, reason: '' };
          return (
            <div key={q.id}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-black-400 font-medium flex-1">
                  {idx + 1}. {q.question}
                </p>
                {q.questionType === 'YES_NO' && (
                  <div className="flex gap-3 ml-4">
                    <button
                      onClick={() => handleYesNo(q.id!, 'YES')}
                      className={`px-6 py-2 rounded-md font-medium transition-colors ${
                        state.answer === 'YES'
                          ? 'border-[1px] border-[#81D7D4] bg-[#DAF3F3]'
                          : 'border-[0.6px] border-[#898989] bg-[#FFF]'
                      }`}
                    >
                      예
                    </button>
                    <button
                      onClick={() => handleYesNo(q.id!, 'NO')}
                      className={`px-6 py-2 rounded-md font-medium transition-colors ${
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
                  onChange={(e) => handleReasonChange(q.id!, e.target.value)}
                  placeholder="사유를 입력해주세요."
                  className="w-full p-4 border border-gray-400 rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:border-transparent bg-[#FFF]"
                />
              )}

              {q.questionType === 'TEXT' && (
                <textarea
                  value={state.reason}
                  onChange={(e) => handleReasonChange(q.id!, e.target.value)}
                  placeholder="답변을 입력해주세요."
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
