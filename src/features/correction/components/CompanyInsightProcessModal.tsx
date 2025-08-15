'use client';

import Portal from '@/components/Portal';
import Image from 'next/image';

type LinkItem = { name: string; url: string };

type CompanyInsightProcessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
  keywords?: string[];
  links?: LinkItem[];
};

export default function CompanyInsightProcessModal({
  isOpen,
  onClose,
  companyName,
  keywords = [],
  links = [],
}: CompanyInsightProcessModalProps) {
  if (!isOpen) return null;

  const displayKeywords = keywords && keywords.length > 0 ? keywords : ['검색어'];
  const displayLinks =
    links && links.length > 0 ? links : [{ name: '사이트명', url: '사이트 주소주소주소' }];

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] bg-black/30 flex items-center justify-center">
        <div
          className="w-[960px] h-[589px] bg-white rounded-[16px] overflow-hidden"
          style={{ boxShadow: '0px 0px 15px 0px #00000033' }}
        >
          {/* Header */}
          <div className="flex justify-end px-[12px] py-[12px]">
            <button onClick={onClose} className="cursor-pointer ">
              <Image
                src="/icons/CloseModal.svg"
                alt="닫기"
                width={24}
                height={24}
                className="mt-0"
              />
            </button>
          </div>
          <div className="text-[20px] font-semibold ml-[40px]">기업 분석 정보 생성 단계</div>
          <p className="border-t-[1px] border-[#BBBBBB] w-[878px] ml-[40px] mt-[8px]"></p>

          {/* Body */}
          <div className="px-[52px] py-[20px] pb-[40px]">
            {/* 안내 문장 (analyzing과 동일 포맷) */}
            <div className="text-[16px] items-center">
              <div className="flex gap-[16px]">
                <Image src="/icons/Cdot.svg" alt="포인터" width={10} height={10} />
                <div>
                  {companyName
                    ? `${companyName}의 인재상과 사업 방향성, 강점과 약점을 분석할게요.`
                    : '기업명의 인재상과 사업 방향성, 강점과 약점을 분석할게요.'}
                </div>
              </div>
              <div className="border-l-[2px] border-[#E7E7E7] h-[32px] ml-[4px]" />
            </div>

            {/* 검색을 진행할게요. */}
            <div className="flex items-center text-[16px]">
              <Image
                src="/icons/Cdot.svg"
                alt="포인터"
                width={10}
                height={10}
                className="mr-[16px]"
              />
              <p>검색을 진행할게요.</p>
            </div>
            <div className="flex">
              <div className="border-l-[2px] border-[#E7E7E7] ml-[4px] mr-[20px]" />
              <div className="mt-[6px] flex flex-wrap gap-[8px]">
                {displayKeywords.map((kw, idx, arr) => (
                  <div
                    key={`${String(kw)}-${idx}`}
                    className={`border border-[#BBBBBB] rounded-[6px] bg-[#F8F8F8] h-[36px] px-[12px] py-[6px] flex items-center ${
                      idx === arr.length - 1 ? 'mb-[24px]' : ''
                    }`}
                  >
                    <Image
                      src="/icons/SearchIcon.svg"
                      alt="검색 아이콘"
                      width={16}
                      height={16}
                      className="mr-[4px]"
                    />
                    <p className="text-[14px]">{String(kw)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 검색 결과를 수집할게요. */}
            <div className="flex items-center text-[16px]">
              <Image
                src="/icons/Cdot.svg"
                alt="포인터"
                width={10}
                height={10}
                className="mr-[16px]"
              />
              <p>검색 결과를 수집할게요.</p>
            </div>
            <div className="flex">
              <div className="h-[206px] ml-[4px] mr-[22px]" />
              <div className="border border-[#BBBBBB] rounded-[8px] bg-[#F8F8F8] w-full h-[206px] mt-[6px] p-[12px] overflow-y-auto">
                <div className="flex flex-col gap-[12px]">
                  {displayLinks.map((item, idx) => (
                    <a
                      key={`${item.url}-${idx}`}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Image
                        src="/icons/URLIcon.svg"
                        alt="URL 아이콘"
                        width={18}
                        height={18}
                        className="mr-[8px]"
                      />
                      <p className="break-all">{`${item.name ? item.name + ' ' : ''}${item.url}`}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
