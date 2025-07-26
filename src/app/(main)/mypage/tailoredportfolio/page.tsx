'use client';

import { useState } from 'react';
import DeleteButton from '@/components/DeleteButton';
import ReductionToggle from '@/features/correction/components/ReductionToggle';
import TailoredDropdown from '@/features/correction/components/TailoredDropdown';
import Link from 'next/link';
import ReductionMark from '@/features/correction/components/ReductionMark';
import ConcretizationMark from '@/features/correction/components/ConcretizationMark';
import ConcretizationToggle from '@/features/correction/components/ConcretizationToggle';

export default function tailoredPortfolio() {
  const [toggleROn, setRToggleOn] = useState(false);
  const [toggleCOn, setCToggleOn] = useState(false);
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Link href="/mypage">
            <img src="/icons/arrow-left.svg" alt="뒤로가기" className="mt-[29px]" />
          </Link>
          <h1
            className="text-[24px] font-semibold mt-[28px] ml-[20px]
          max-lg:ml-[8px]"
          >
            프로젝트 A
          </h1>
        </div>
        <DeleteButton
          onDelete={() => {
            // 삭제 로직 작성
          }}
          modalTitle="이 AI 첨삭 내용을 정말 삭제하시겠습니까?"
          confirmText="삭제"
          cancelText="취소"
        />
      </div>

      {/* Divider line */}
      <div
        className="mt-[10px] ml-[40px] border-[#E7E7E7] border-[1px]
      max-lg:ml-[0px]"
      />

      <div>
        <div
          className="flex flex-row mt-[60px] ml-[80px] items-center w-[1500px]
        max-lg:ml-[24px] max-lg:flex-col max-lg:items-start"
        >
          <div className="flex items-center">
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px]">
              생성 일자
            </div>
            <p className="text-black text-[20px] grid place-items-center ml-[28px]">2000.04.21</p>
          </div>

          <div
            className="flex items-center ml-[312px]
          max-lg:ml-[0px] max-lg:mt-[40px]"
          >
            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px]">
              기업명
            </div>
            <p className="ml-[28px] text-[20px] mr-[342px]">제출처명</p>

            <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] ">
              직무명
            </div>
            <p className="text-[20px] ml-[28px]">직무</p>
          </div>
        </div>

        <div
          className="ml-[80px] mt-[60px]
        max-lg:ml-[24px]"
        >
          <div className="text-[22px] font-semibold">기업 분석 정보</div>
          <textarea
            className=" mt-[16px] border-[2px] border-[#BBBBBB] w-[1520px] h-[162px] rounded-[8px] px-[20px] py-[16px] text-[18px]
          max-lg:w-[928px] max-lg:h-[176px]"
          />
        </div>

        <div
          className="ml-[80px] mt-[80px]
        max-lg:ml-[24px] max-lg:mt-[40px]"
        >
          <div className="text-[22px] font-semibold">JD (Job Description)</div>
          <textarea
            className=" mt-[16px] border-[2px] border-[#BBBBBB] w-[1520px] h-[162px] rounded-[8px] px-[20px] py-[16px] text-[18px]
          max-lg:w-[928px] max-lg:h-[176px]"
          />
        </div>
      </div>

      <div
        className="flex mt-[80px] ml-[96px]
      max-lg:ml-[40px]"
      >
        <div className="bg-[#E9F8F8] w-[160px] h-[58px] rounded-tl-[8px] rounded-tr-[8px] grid place-items-end">
          <p className="font-bold mr-[40px] text-[18px]">프로젝트 A</p>
          <div className="w-[160px] h-[4px] bg-[#81D7D4] " />
        </div>
        <div className="bg-[#F8F8F8] w-[160px] h-[58px] rounded-tl-[8px] rounded-tr-[8px] py-[16px]">
          <p className="font-bold mr-[40px] text-[18px] ml-[40px]">프로젝트 B</p>
        </div>
        <div className="bg-[#F8F8F8] w-[160px] h-[58px] rounded-tl-[8px] rounded-tr-[8px] py-[16px]">
          <p className="font-bold mr-[40px] text-[18px] ml-[40px]">프로젝트 C</p>
        </div>
      </div>

      <div
        className="w-[1520px] h-[2757px] bg-[#F8F8F8] ml-[80px] rounded-[16px] relative z-10 p-[60px]
        max-lg:w-[928px] max-lg:h-[4325px] max-lg:p-[36px] max-lg:ml-[24px]"
        style={{ boxShadow: '0px 0px 4px 0px #00000033' }}
      >
        <div className="flex flex-row items-center w-[1500px]">
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center gap-[10px] rounded-[4px] font-semibold text-[18px]">
            진행 기간
          </div>
          <p className="text-black text-[20px] grid place-items-center ml-[28px]">
            2025.04.02 ~ 2025.06.20
          </p>
          <div
            className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] ml-[154px] mr-[8px] font-semibold text-[18px]
          max-lg:ml-[229px]"
          >
            분류
          </div>
          <TailoredDropdown />
          <div className="w-[99px] h-[37px] bg-[#DAF3F3] grid place-items-center rounded-[4px] gap-[10px] ml-[154px] font-semibold text-[18px]">
            기여도
          </div>
          <img src="/icons/CorrectionPercentbar.svg" alt="기여도 퍼센트바" className="ml-[28px]" />
          <p className="text-[20px] ml-[20px]">80%</p>
        </div>
        <div
          className="mt-[80px]
        max-lg:mt-[48px]"
        >
          <div className="text-[22px] font-semibold">AI 첨삭 내용</div>
          <div className="mt-[10px] border-[#E7E7E7] border-[1px] " />
        </div>
        <div
          className="mt-[40px]
        max-lg:mt-[32px]"
        >
          <div className="text-[18px] font-semibold">상세정보</div>
          <div
            className="w-[1400px] h-[548px] rounded-[8px] border border-[#E7E7E7] bg-white mt-[12px] px-[40px] py-[28px] flex
          max-lg:w-[856px] max-lg:h-[937px] max-lg:flex-col"
          >
            <div
              className="w-[620px] h-[476px] text-[18px] mt-[8px]
            max-lg:text-[16px] max-lg:w-[784px]"
            >
              <p>[연간 활동 기획 및 운영 총괄]</p>
              <p>- 동아리 연간 활동 계획 및 예산안 수립</p>
              <p>- 월 1회 정기모임 및 분기 1회 특별 행사 기획∙운영</p>
              <p>- 전산장부 시스템 도입 및 동아리 전체 예산 집행, 회계 처리 총괄</p>
              <p>- 타 부서(홍보국, 대외협력국) 협업 및 연간/상반기 운영 현황 보고</p>

              <p className="mt-[48px]" />
              <p>[참여 경험 고도화 및 문제 해결]</p>
              <p>- 참여자 피드백 기반 프로그램 개선 (활동지 난이도 분리, 익명 피드백 도입 등)</p>
              <p>- 사전 설문 기반 참여자 성향 분석 및 맞춤형 조 편성 시스템 설계</p>
              <p className="mt-[48px]" />
              <p>
                어려움과 극복 과정: 회원 간 친분 형성 후 공식 활동 참여율이 저하되는 문제가
                발생했습니다. 이를 해결하기 위해 대외협력국과 협력하여 기업 연계 프로그램을 유치,
                동아리에서만 가능한 '이력서 작성' 프로그램을 기획했습니다. 실제 기업의 피드백 기회를
                제공한 결과, 해당 모임 참여율이 이전 대비 170% 증가했고 72건의 긍정 피드백을
                확보했습니다.
                {/* TODO: 글 위에 마크 올리기 */}
                {toggleROn && <ReductionMark />}
              </p>
            </div>
            {/* Divider line */}
            <div className="border-l-[2px] border-[#BBBBBB] h-[492px] ml-[40px] mr-[40px] block max-lg:hidden" />
            <div className="w-[808px] border border-[#BBBBBB] hidden max-lg:block max-lg:mt-[32px] max-lg:mb-[36px]" />

            <div className="w-[620px] h-[476px] mt-[8px]">
              <div
                className="w-[620px] h-[84px] bg-[#F8F8F8] border border-[#898989] rounded-[6px] px-[20px] py-[16px]
              max-lg:w-[784px] max-lg:h-[80px]"
              >
                총평
              </div>

              {/* TODO: 토글 둘 중 한개만 켤 수 있도록 */}
              <div className="flex mt-[48px] items-center w-[620px]">
                <ReductionToggle onRToggle={setRToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#EF7C7C] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[189px] h-[34px] bg-[#D846460D] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">축소하거나 제외하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>

              <div className="flex mt-[48px] items-center w-[620px]">
                <ConcretizationToggle onCToggle={setCToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#97D099] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[260px] h-[34px] bg-[#97D0991A] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">내용을 더 구체화하여 강조하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px] w-[620px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="mt-[40px]
        max-lg:mt-[32px]"
        >
          <div className="text-[18px] font-semibold">담당 업무</div>
          <div
            className="w-[1400px] h-[548px] rounded-[8px] border border-[#E7E7E7] bg-white mt-[12px] px-[40px] py-[28px] flex
          max-lg:w-[856px] max-lg:h-[937px] max-lg:flex-col"
          >
            <div
              className="w-[620px] h-[476px] text-[18px] mt-[8px]
            max-lg:text-[16px] max-lg:w-[784px]"
            >
              <p>[연간 활동 기획 및 운영 총괄]</p>
              <p>- 동아리 연간 활동 계획 및 예산안 수립</p>
              <p>- 월 1회 정기모임 및 분기 1회 특별 행사 기획∙운영</p>
              <p>- 전산장부 시스템 도입 및 동아리 전체 예산 집행, 회계 처리 총괄</p>
              <p>- 타 부서(홍보국, 대외협력국) 협업 및 연간/상반기 운영 현황 보고</p>

              <p className="mt-[48px]" />
              <p>[참여 경험 고도화 및 문제 해결]</p>
              <p>- 참여자 피드백 기반 프로그램 개선 (활동지 난이도 분리, 익명 피드백 도입 등)</p>
              <p>- 사전 설문 기반 참여자 성향 분석 및 맞춤형 조 편성 시스템 설계</p>
              <p className="mt-[48px]" />
              <p>
                어려움과 극복 과정: 회원 간 친분 형성 후 공식 활동 참여율이 저하되는 문제가
                발생했습니다. 이를 해결하기 위해 대외협력국과 협력하여 기업 연계 프로그램을 유치,
                동아리에서만 가능한 '이력서 작성' 프로그램을 기획했습니다. 실제 기업의 피드백 기회를
                제공한 결과, 해당 모임 참여율이 이전 대비 170% 증가했고 72건의 긍정 피드백을
                확보했습니다.
                {/* TODO: 글 위에 마크 올리기 */}
                {toggleCOn && <ConcretizationMark />}
              </p>
            </div>
            {/* Divider line */}
            <div className="border-l-[2px] border-[#BBBBBB] h-[492px] ml-[40px] mr-[40px] block max-lg:hidden" />
            <div className="w-[808px] border border-[#BBBBBB] hidden max-lg:block max-lg:mt-[32px] max-lg:mb-[36px]" />

            <div className="w-[620px] h-[476px] mt-[8px]">
              <div
                className="w-[620px] h-[84px] bg-[#F8F8F8] border border-[#898989] rounded-[6px] px-[20px] py-[16px]
              max-lg:w-[784px] max-lg:h-[80px]"
              >
                총평
              </div>

              {/* TODO: 토글 둘 중 한개만 켤 수 있도록 */}
              <div className="flex mt-[48px] items-center w-[620px]">
                <ReductionToggle onRToggle={setRToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#EF7C7C] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[189px] h-[34px] bg-[#D846460D] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">축소하거나 제외하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>

              <div className="flex mt-[48px] items-center w-[620px]">
                <ConcretizationToggle onCToggle={setCToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#97D099] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[260px] h-[34px] bg-[#97D0991A] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">내용을 더 구체화하여 강조하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px] w-[620px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="mt-[40px]
        max-lg:mt-[32px]"
        >
          <div className="text-[18px] font-semibold">주요 성과</div>
          <div
            className="w-[1400px] h-[548px] rounded-[8px] border border-[#E7E7E7] bg-white mt-[12px] px-[40px] py-[28px] flex
          max-lg:w-[856px] max-lg:h-[937px] max-lg:flex-col"
          >
            <div
              className="w-[620px] h-[476px] text-[18px] mt-[8px]
            max-lg:text-[16px] max-lg:w-[784px]"
            >
              <p>[연간 활동 기획 및 운영 총괄]</p>
              <p>- 동아리 연간 활동 계획 및 예산안 수립</p>
              <p>- 월 1회 정기모임 및 분기 1회 특별 행사 기획∙운영</p>
              <p>- 전산장부 시스템 도입 및 동아리 전체 예산 집행, 회계 처리 총괄</p>
              <p>- 타 부서(홍보국, 대외협력국) 협업 및 연간/상반기 운영 현황 보고</p>

              <p className="mt-[48px]" />
              <p>[참여 경험 고도화 및 문제 해결]</p>
              <p>- 참여자 피드백 기반 프로그램 개선 (활동지 난이도 분리, 익명 피드백 도입 등)</p>
              <p>- 사전 설문 기반 참여자 성향 분석 및 맞춤형 조 편성 시스템 설계</p>
              <p className="mt-[48px]" />
              <p>
                어려움과 극복 과정: 회원 간 친분 형성 후 공식 활동 참여율이 저하되는 문제가
                발생했습니다. 이를 해결하기 위해 대외협력국과 협력하여 기업 연계 프로그램을 유치,
                동아리에서만 가능한 '이력서 작성' 프로그램을 기획했습니다. 실제 기업의 피드백 기회를
                제공한 결과, 해당 모임 참여율이 이전 대비 170% 증가했고 72건의 긍정 피드백을
                확보했습니다.
                {/* TODO: 글 위에 마크 올리기 */}
              </p>
            </div>
            {/* Divider line */}
            <div className="border-l-[2px] border-[#BBBBBB] h-[492px] ml-[40px] mr-[40px] block max-lg:hidden" />
            <div className="w-[808px] border border-[#BBBBBB] hidden max-lg:block max-lg:mt-[32px] max-lg:mb-[36px]" />

            <div className="w-[620px] h-[476px] mt-[8px]">
              <div
                className="w-[620px] h-[84px] bg-[#F8F8F8] border border-[#898989] rounded-[6px] px-[20px] py-[16px]
              max-lg:w-[784px] max-lg:h-[80px]"
              >
                총평
              </div>

              {/* TODO: 토글 둘 중 한개만 켤 수 있도록 */}
              <div className="flex mt-[48px] items-center w-[620px]">
                <ReductionToggle onRToggle={setRToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#EF7C7C] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[189px] h-[34px] bg-[#D846460D] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">축소하거나 제외하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>

              <div className="flex mt-[48px] items-center w-[620px]">
                <ConcretizationToggle onCToggle={setCToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#97D099] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[260px] h-[34px] bg-[#97D0991A] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">내용을 더 구체화하여 강조하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px] w-[620px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="mt-[40px]
        max-lg:mt-[32px]"
        >
          <div className="text-[18px] font-semibold">배운 점</div>
          <div
            className="w-[1400px] h-[548px] rounded-[8px] border border-[#E7E7E7] bg-white mt-[12px] px-[40px] py-[28px] flex
          max-lg:w-[856px] max-lg:h-[937px] max-lg:flex-col"
          >
            <div
              className="w-[620px] h-[476px] text-[18px] mt-[8px]
            max-lg:text-[16px] max-lg:w-[784px]"
            >
              <p>[연간 활동 기획 및 운영 총괄]</p>
              <p>- 동아리 연간 활동 계획 및 예산안 수립</p>
              <p>- 월 1회 정기모임 및 분기 1회 특별 행사 기획∙운영</p>
              <p>- 전산장부 시스템 도입 및 동아리 전체 예산 집행, 회계 처리 총괄</p>
              <p>- 타 부서(홍보국, 대외협력국) 협업 및 연간/상반기 운영 현황 보고</p>

              <p className="mt-[48px]" />
              <p>[참여 경험 고도화 및 문제 해결]</p>
              <p>- 참여자 피드백 기반 프로그램 개선 (활동지 난이도 분리, 익명 피드백 도입 등)</p>
              <p>- 사전 설문 기반 참여자 성향 분석 및 맞춤형 조 편성 시스템 설계</p>
              <p className="mt-[48px]" />
              <p>
                어려움과 극복 과정: 회원 간 친분 형성 후 공식 활동 참여율이 저하되는 문제가
                발생했습니다. 이를 해결하기 위해 대외협력국과 협력하여 기업 연계 프로그램을 유치,
                동아리에서만 가능한 '이력서 작성' 프로그램을 기획했습니다. 실제 기업의 피드백 기회를
                제공한 결과, 해당 모임 참여율이 이전 대비 170% 증가했고 72건의 긍정 피드백을
                확보했습니다.
                {/* TODO: 글 위에 마크 올리기 */}
              </p>
            </div>
            {/* Divider line */}
            <div className="border-l-[2px] border-[#BBBBBB] h-[492px] ml-[40px] mr-[40px] block max-lg:hidden" />
            <div className="w-[808px] border border-[#BBBBBB] hidden max-lg:block max-lg:mt-[32px] max-lg:mb-[36px]" />

            <div className="w-[620px] h-[476px] mt-[8px]">
              <div
                className="w-[620px] h-[84px] bg-[#F8F8F8] border border-[#898989] rounded-[6px] px-[20px] py-[16px]
              max-lg:w-[784px] max-lg:h-[80px]"
              >
                총평
              </div>

              {/* TODO: 토글 둘 중 한개만 켤 수 있도록 */}
              <div className="flex mt-[48px] items-center w-[620px]">
                <ReductionToggle onRToggle={setRToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#EF7C7C] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[189px] h-[34px] bg-[#D846460D] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">축소하거나 제외하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>

              <div className="flex mt-[48px] items-center w-[620px]">
                <ConcretizationToggle onCToggle={setCToggleOn} />
                <div className="flex ml-[16px]">
                  <div className="bg-[#97D099] w-[4px] h-[34px] rounded-l-[4px]"></div>
                  <div className="w-[260px] h-[34px] bg-[#97D0991A] px-[12px] py-[4px] rounded-r-[4px]">
                    <p className="text-[18px]">내용을 더 구체화하여 강조하세요.</p>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] text-[18px] w-[620px]">
                <p>1. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
                <p>2. 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용 첨삭내용</p>
              </div>
            </div>
          </div>
        </div>{' '}
      </div>
    </div>
  );
}
