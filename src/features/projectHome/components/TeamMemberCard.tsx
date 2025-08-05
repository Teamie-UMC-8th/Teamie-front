'use client';

interface TeamMemberCardProps {
  name: string;
  university: string;
  email: string;
  role: string;
  isLeader?: boolean;
}

export default function TeamMemberCard({
  name,
  university,
  email,
  role,
  isLeader = false,
}: TeamMemberCardProps) {
  return (
    <div
      className="w-[315px] h-[368px] rounded-[12px] bg-white mt-[24px] flex-col py-[36px] px-[40px]
      max-lg:ml-[142px] max-lg:w-[580px] max-lg:h-[241px]"
      style={{ boxShadow: '0px 0px 10px 0px #00000033' }}
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
