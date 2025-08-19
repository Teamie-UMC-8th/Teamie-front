'use client';

import Link from 'next/link';

export default function AddCorrectionButton() {
  return (
    <Link
      href="/myPage/addCorrection"
      onClick={() => {
        try {
          sessionStorage.setItem('correctionIntro:last', 'true');
        } catch {}
      }}
    >
      <img
        src="/icons/AddProject.svg"
        alt="프로젝트 추가"
        className="w-[38px] h-[38px] cursor-pointer translate-y-[10px]"
      />
    </Link>
  );
}
