'use client';

interface TeamMemberCardProps {
  name: string;
  university: string;
  email: string;
  role: string;
  isLeader?: boolean;
  currentUserEmail?: string;
  onClick?: () => void;
}

export default function TeamMemberCard({
  name,
  university,
  email,
  role,
  isLeader = false,
  currentUserEmail,
  onClick,
}: TeamMemberCardProps) {
  // 본인의 프로필 카드인지 확인
  const isCurrentUser = currentUserEmail === email;

  const handleCardClick = () => {
    // 본인의 프로필 카드인 경우 클릭 이벤트를 무시
    if (isCurrentUser) {
      return;
    }
    // 다른 팀원의 카드인 경우에만 팀장 변경 모달 표시
    onClick?.();
  };

  return (
    <div
      className={`w-[315px] h-[368px] rounded-[12px] bg-white mt-[24px] flex-col py-[36px] px-[40px]
      max-lg:ml-[142px] max-lg:w-[580px] max-lg:h-[241px] ${
        !isCurrentUser ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
      }`}
      style={{ boxShadow: '0px 0px 10px 0px #00000033' }}
      onClick={handleCardClick}
    >
      <div className="max-lg:flex">
        <div>
          <img
            src="/icons/myprofile.svg"
            alt="Profile"
            className="w-[125px] h-[125px] ml-[55px]
      max-lg:ml-[20px]"
          />

          <div
            className="flex items-center ml-[73px]
      max-lg:ml-[38px]"
          >
            {isLeader && <img src="/icons/Leader-Icon.svg" alt="리더 아이콘" />}
            <div className="font-semibold text-[22px] ml-[8px]">{name}</div>
          </div>
        </div>
        <div
          className="w-[235px] h-[248px] flex-col mt-[18px]
        max-lg:mt-0 max-lg:ml-[80px]"
        >
          <div className="flex items-center py-[6px]">
            <img src="/icons/UnivName.svg" alt="University" className="mr-[0.75rem]" />
            <div className="text-black text-[18px]">{university}</div>
          </div>
          <div className="flex items-center py-[6px]">
            <img src="/icons/email.svg" alt="email" className="mr-[0.75rem]" />
            <div className="text-black text-[18px]">{email}</div>
          </div>
          <div className="flex items-center py-[6px]">
            <img src="/icons/PlanIcon.svg" alt="기획" className="mr-[0.75rem]" />
            <div className="text-black text-[18px]">{role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
