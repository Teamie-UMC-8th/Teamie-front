'use client';

import Link from 'next/dist/client/link';

export default function AddCorrectionButton() {
  return (
    <Link href="/mypage/correction">
      <img
        src="icons/AddProject.svg"
        alt="프로젝트 추가"
        className="w-[38px] h-[38px] mt-[3px] mr-[10px] cursor-pointer translate-y-[-18px]"
      />
    </Link>
  );
}
