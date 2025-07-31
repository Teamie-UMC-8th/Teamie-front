'use client';

import { useMasterPortfolioDetail } from '@/hooks/mutations/useMasterPortfolio';
import { useParams } from 'next/navigation';

export default function MasterPortfolioDetail() {
  const params = useParams();
  const portfolioId = Number(params.portfolioId);

  const { data, isLoading, error } = useMasterPortfolioDetail(portfolioId);

  if (isLoading) return <div>포트폴리오 상세 정보를 불러오는 중...</div>;
  if (error) return <div>포트폴리오 상세 정보를 불러오는데 실패했습니다.</div>;
  if (!data) return <div>포트폴리오 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">포트폴리오 상세</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">카테고리</h2>
          <p className="text-gray-700">{data.category}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">기여도</h2>
          <p className="text-gray-700">{data.contributionRate}%</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">주요 업무</h2>
          <p className="text-gray-700">{data.mainTask}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">담당 업무</h2>
          <p className="text-gray-700">{data.assignedTask}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">주요 성과</h2>
          <p className="text-gray-700">{data.keyAchievement}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">상세 정보</h2>
          <p className="text-gray-700">{data.detailInfo}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">인사이트</h2>
          <p className="text-gray-700">{data.insight}</p>
        </div>
      </div>
    </div>
  );
}
