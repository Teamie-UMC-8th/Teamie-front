export default function Step2() {
  const length = 5;

  return (
    <div className="flex flex-col gap-[16px] items-center">
      <div>
        <strong>
          포트폴리오 생성 시에 참고하면 좋을 회의록이 있다면 최대 8개까지 선택해주세요.
        </strong>
        <br />
        아래 내용들이 포함된 회의록이 있다면, 생성에 큰 도움이 돼요!
        <br />
        <br />
        <ul className="list-disc list-inside">
          <li>프로젝트 시작 배경, 해결하고자 한 문제, 전하고자 한 메세지 또는 컨셉</li>
          <li>역할별 인원 구성, 협업 파트 구성</li>
          <li>시작 전, 목표로 한 수치화된 지표</li>
          <li>실제로 달성한 정량적 성과와 받은 피드백</li>
          <li>어려웠던 점과 극복한 방법</li>
        </ul>
        <br />
        회의록은 필수로 선택하지 않아도 되지만, 양질의 회의록이 많다면 좋은 마스터 포트폴리오를
        생성할 수 있어요. 제가 참고할 회의록을 모두 선택하셨다면, 생성을 시작할게요!
      </div>
      <div className="w-fit flex flex-col justify-center items-center border-[2px] border-[#81D7D4] bg-[#DAF3F3] rounded-[100px] py-[16px] px-[36px]">
        <h3 className="text-[#000000] text-[20px] leading-[28px] font-normal tracking-[0.8px]">
          생성 시 최대 <strong>N Credit</strong>이 사용됩니다
        </h3>
        <p className="text-[#898989] text-[14px] leading-[22px]">
          {length}개의 회의록이 선택되었습니다.
        </p>
      </div>
      {Number(length) === 0 ? ( //0이면 회의록 없음 안내
        <div className="bg-[#F8F8F8] rounded-[8px] shadow-[0_0_4px_rgba(0,0,0,0.20)] px-[16px] py-[24px] text-[#505050] text-center min-w-[660px] mt-8">
          OOO님이 참석한 일정에 작성된 회의록이 없어요.
          <br /> 회의록 없이 마스터 포트폴리오를 생성할게요.
        </div>
      ) : (
        <div className="w-full border-[1.5px] border-[#898989] rounded-[20px] p-[16px] max-h-[512px] overflow-y-auto">
          <div className="grid grid-cols-2 gap-[16px]">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-[8px]">
                <div className="flex flex-col w-full h-full bg-[#f8f8f8] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[8px] p-[16px]">
                  <div className="p-2 rounded-[4px] border-[1px] border-[#E7E7E7] bg-[#FFF] text-[#000000] text-[18px] leading-[26px] font-normal tracking-[0.72px]">
                    3주차 정기 회의
                  </div>

                  <div className="w-full flex gap-[14px] mt-[8px]">
                    <div className="flex-1 text-[#898989] text-[14px] leading-[22px] font-normal tracking-[0.56px]">
                      일자
                    </div>
                    <div className="flex-9 w-fulltext-[#000000] text-[14px] leading-[22px] font-normal tracking-[0.56px]">
                      2025.05.25
                    </div>
                  </div>

                  <div className="w-full flex gap-[8px] mt-[8px]">
                    <div className="flex-1 w-full text-[#898989] text-[14px] leading-[22px] font-normal tracking-[0.56px] whitespace-pre">
                      회의록
                    </div>

                    <div
                      className="flex-9 rounded-[4px] border-[1px]  border-[#E7E7E7] bg-[#FFF] text-[#000000] text-[14px] leading-[22px] font-normal tracking-[0.56px] whitespace-pre-wrap px-[12px] py-[4px] overflow-hidden"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내{' '}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
