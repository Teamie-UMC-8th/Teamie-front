'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Image
      src="/icons/arrow-left.svg"
      alt="뒤로가기"
      width={24}
      height={24}
      className="ml-[-2.5rem] mr-[1.25rem] cursor-pointer
      max-lg:ml-[-0.75rem]"
      onClick={handleBack}
    />
  );
}
