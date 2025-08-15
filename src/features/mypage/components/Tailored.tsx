'use client';

// no Link usage; using programmatic navigation for conditional routing
import { useRouter } from 'next/navigation';
import { useCorrectionList } from '@/hooks/mutations/useGetCorrection';
import { formatDate } from '@/utils/formatDate';
import { Correction } from '@/types/api/correction';
import { fetchCorrectionDetail, fetchGeneratedCorrection } from '@/services/correction/correction';

export default function Tailored() {
  const { data, isLoading, error } = useCorrectionList();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-[24px] max-lg:grid-cols-2">
        <div className="bg-[#F8F8F8] w-[465px] h-[156px] rounded-[8px] flex items-center justify-center max-lg:w-[421px] max-lg:h-[180px]">
          <div className="text-[16px] text-gray-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-2 gap-[24px] max-lg:grid-cols-2">
        <div className="bg-[#F8F8F8] w-[465px] h-[156px] rounded-[8px] flex items-center justify-center max-lg:w-[421px] max-lg:h-[180px]">
          <div className="text-[16px] text-red-500">데이터를 불러올 수 없습니다.</div>
        </div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-[24px] max-lg:grid-cols-2">
        <div className="bg-[#F8F8F8] w-[465px] h-[156px] rounded-[8px] flex items-center justify-center max-lg:w-[421px] max-lg:h-[180px]">
          <div className="text-[16px] text-gray-500">AI 첨삭 내역이 없습니다.</div>
        </div>
      </div>
    );
  }

  const corrections = data?.data ?? [];

  return (
    <div className="grid grid-cols-2 max-lg:w-[868px] gap-[24px] max-lg:grid-cols-2">
      {corrections.map((correction: Correction) => (
        <button
          key={correction.correctionId}
          onClick={async (e) => {
            e.preventDefault();
            // 1) 생성 결과가 이미 존재하면 상세 페이지로 이동 (우선순위 높음)
            try {
              const gen = await fetchGeneratedCorrection(correction.correctionId);
              if (
                gen &&
                Array.isArray(gen.projects) &&
                gen.projects.length > 0 &&
                gen.firstCorrection
              ) {
                try {
                  sessionStorage.removeItem(`analyzingPrefetch:${correction.correctionId}`);
                } catch {}
                router.push(`/mypage/tailoredportfolio/${correction.correctionId}`);
                return;
              }
            } catch {}

            // 2) 세션 캐시에 analyzing 프리패치가 남아있으면 이어서 진행
            try {
              if (sessionStorage.getItem(`analyzingPrefetch:${correction.correctionId}`)) {
                router.push(
                  `/mypage/addcorrection/analyzing?correctionId=${correction.correctionId}&submissionTarget=${encodeURIComponent(
                    correction.submissionTarget || ''
                  )}`
                );
                return;
              }
            } catch {}

            // 3) 서버 상태로 분기. 상세 조회에 status가 있다면 NOT_STARTED 등 진행 중으로 간주
            try {
              const detail = await fetchCorrectionDetail(correction.correctionId);
              const status = (detail as unknown as { status?: string })?.status;
              if (status && status !== 'DONE') {
                router.push(
                  `/mypage/addcorrection/analyzing?correctionId=${correction.correctionId}&submissionTarget=${encodeURIComponent(
                    correction.submissionTarget || ''
                  )}`
                );
                return;
              }
            } catch {}

            // 4) 기본: 완료 상태이거나 판단 불가 → 기존 상세 페이지로 이동
            router.push(`/mypage/tailoredportfolio/${correction.correctionId}`);
          }}
          className="bg-[#F8F8F8] w-[465px] h-[190px] rounded-[8px] px-[13px] cursor-pointer
            max-lg:w-[421px] max-lg:h-[180px]"
          style={{ boxShadow: '0px 0px 4px 0px #00000033' }}
        >
          {/* 제목 영역 */}
          <div className="bg-white w-full h-[48px] rounded-[4px] border border-[#E7E7E7] flex items-center px-[12px] mb-[16px]">
            <p className="text-[18px] text-black truncate">{correction.title}</p>
          </div>

          {/* 정보 영역 */}
          <div className="space-y-[12px] ml-[12px]">
            <div className="flex items-center">
              <span className="text-[16px] text-[#505050] w-[60px] text-left">생성 일자</span>
              <span className="text-[16px] text-black ml-[16px]">
                {formatDate(correction.createdAt)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-[16px] text-[#505050] w-[60px] text-left">기업명</span>
              <span className="text-[16px] text-black ml-[16px] truncate">
                {correction.submissionTarget || '기업명'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-[16px] text-[#505050] w-[60px] text-left">직무명</span>
              <span className="text-[16px] text-black ml-[16px] truncate">
                {correction.jobTitle}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
