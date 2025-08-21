'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMasterPortfolioDetail } from '@/hooks/queries/useGetMasterPortfolio';
import Image from 'next/image';
import Dropdown from '@/components/Dropdown';

export default function MenuButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const portfolioId = Number(params.portfolioId);

  // 포트폴리오 정보에서 프로젝트 ID 가져오기
  const { data: portfolioDetail } = useMasterPortfolioDetail(portfolioId);
  const projectId = portfolioDetail?.projectId;

  const menuItems = [
    {
      label: '프로젝트 홈으로 이동',
      href: `/projects/${projectId || ''}`,
      onClick: () => router.push(`/projects/${projectId}`),
    },
    {
      label: '개인 회고로 이동',
      href: `/projects/${projectId || ''}/retrospect`,
      onClick: () => {
        if (projectId) {
          router.push(`/projects/${projectId}/retrospect`);
        }
      },
    },
  ];

  return (
    <div className="absolute top-0 right-[20px] relative ml-auto justify-end max-lg:w-[32px] max-lg:h-[32px]">
      <Dropdown
        isOpen={open}
        onToggle={() => setOpen((prev) => !prev)}
        trigger={
          <Image
            src="/icons/menu-icon.svg"
            alt="메뉴"
            width={36}
            height={36}
            className="w-[36px] h-[36px] cursor-pointer"
          />
        }
        items={menuItems}
        dropdownClassName="right-0"
        width="w-[265px]"
      />
    </div>
  );
}
