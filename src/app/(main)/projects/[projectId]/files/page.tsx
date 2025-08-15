import Image from 'next/image';

export default function FilesPage() {
  return (
    <div className="flex flex-col items-center h-screen">
      <div className="mt-[25vh] flex flex-col items-center">
        <Image
          src="/icons/constructionTeamie.svg"
          alt="공사중"
          width={303}
          height={167}
          className="w-[303px] h-[167px]"
        />
        <h1 className="ml-[40px] mt-[50px] text-[22px] font-semibold">준비 중인 페이지입니다.</h1>
      </div>
    </div>
  );
}
