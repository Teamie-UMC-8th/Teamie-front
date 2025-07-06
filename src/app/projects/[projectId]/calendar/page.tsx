"use client";
import Image from "next/image";
import { useRef } from "react";

export default function TeamCalendarPage() {
  const dateInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center h-screen py-20 bg-gray-50">
      <form className="w-full bg-white rounded-lg shadow p-12 space-y-8">
        {/* 일정명 입력 */}
        <input
          type="text"
          className="w-full text-2xl font-bold mb-8 border-b-2 border-gray-200 focus:border-blue-500 outline-none bg-transparent placeholder-gray-400"
          placeholder="일정명을 입력해주세요"
        />
        {/* 일자, 시작시간, 장소 한 줄 배치 */}
        <div className="flex gap-40 w-full">
          {/* 일자 */}
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-medium bg-[#DAF3F3] flex justify-center items-center text-center w-[100px] h-10 rounded px-1 py-0.5">일자</span>
            <button
              type="button"
              className="p-1 rounded hover:bg-gray-100"
              onClick={() =>
                dateInputRef.current &&
                dateInputRef.current.showPicker &&
                dateInputRef.current.showPicker()
              }
            >
              <Image src="/icons/dayPicker.svg" alt="일자" width={24} height={24} />
            </button>
            <input
              type="date"
              ref={dateInputRef}
              className="hidden"
            />
          </div>
          {/* 시작시간 */}
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-medium bg-[#DAF3F3] flex justify-center items-center text-center w-[100px] h-10 rounded px-1 py-0.5">시작시간</span>
            <button className="p-1">
              <Image src="/icons/timePicker.svg" alt="일자" width={24} height={24} />
            </button>
          </div>
          {/* 장소 */}
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-medium bg-[#DAF3F3] flex justify-center items-center text-center w-[100px] h-10 rounded px-1 py-0.5">장소</span>
            <input
              type="text"
              className="border border-transparent rounded px-1 py-1 focus:outline-none focus:ring text-sm"
              placeholder="장소 입력"
            />
            <button
              type="button"
              className="ml-1 px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium hover:bg-blue-200 transition"
            >
              리마인드 메세지
            </button>
          </div>
        </div>
        {/* 참석자 */}
        <div className="flex items-center gap-3 w-full">
          <span className="font-medium bg-[#DAF3F3] flex justify-center items-center text-center w-[100px] h-10 rounded">참석자</span>
          <button type="button" className="p-2 rounded hover:bg-gray-100">
            <Image src="/icons/addPerson.svg" alt="참석자" width={24} height={24} />
          </button>
        </div>
        {/* 비고 */}
        <div className="flex items-start gap-3 w-full">
          <span className="font-medium w-[100px] h-10 flex justify-center items-center text-center mt-2 bg-[#DAF3F3] rounded">비고</span>
          <textarea
            className="border border-[#BBBBBB] rounded px-3 py-2 focus:outline-none focus:ring resize-none"
            style={{ width: '500px' }}
            rows={3}
            placeholder="비고를 입력하세요"
          />
        </div>
        {/* 회의록 */}
        <div className="w-full">
          <span className="font-medium w-[100px] h-10 flex justify-center items-center text-center mt-2 block mb-2 bg-[#DAF3F3] rounded">회의록</span>
          <textarea
            className="w-full border border-[#BBBBBB] rounded px-3 py-2 focus:outline-none focus:ring resize-none"
            rows={5}
            placeholder="회의록을 입력하거나 저장하세요"
          />
        </div>

      </form>
    </div>
  );
}
