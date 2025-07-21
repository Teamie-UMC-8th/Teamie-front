'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <img
      src="/icons/arrow-left.svg"
      alt="뒤로가기"
      className="ml-[-2.5rem] mr-[1.25rem] cursor-pointer
      max-lg:ml-[-0.75rem]"
      onClick={handleBack}
    />
  );
}
