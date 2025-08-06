"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { usePostPlan } from "@/hooks/mutations/usePostTeamCalendar";

interface CustomDateCellWrapperProps {
  children: ReactNode;
  value: Date;
  projectId: string | undefined;
  startDate: string;
  endDate: string;
  setCurrentDate: (date: Date) => void;
}

export default function CustomDateCellWrapper({
  children,
  value,
  projectId,
  startDate,
  endDate,
  setCurrentDate,
}: CustomDateCellWrapperProps) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate } = usePostPlan();

  const handleClick = () => {
    if (!projectId) return;

    const formattedDate = new Date(value).toISOString();

    console.log("플러스 버튼 클릭!", { projectId, formattedDate });

    mutate(
      { projectId, date: formattedDate },
      {
        onSuccess: (data) => {
          const planId = data.result.planId;
          console.log("일정 생성 성공!", data);

          setCurrentDate(new Date(value));

          queryClient.invalidateQueries({
            queryKey: ["calendarPlans", projectId, startDate, endDate],
          });
          console.log("일정 목록 refetch 요청!");

          router.push(`/projects/${projectId}/teamcalendar/${planId}/teamtask`);
          console.log("상세 페이지로 이동:", `/projects/${projectId}/teamcalendar/${planId}/teamtask`);
        },
        onError: (error) => {
          console.error("일정 생성 실패", error);
        }
      }
    );
  };

  return (
    <div
      className={`relative w-full h-full transition-all duration-200 rounded-[4px] z-[50] overflow-visible ${
        hovered ? "shadow-[0_0_10px_rgba(0,0,0,0.25)] cursor-pointer" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}

      {/* 플러스 버튼 */}
      <div
        className="absolute top-[8px] right-[8px] z-[60]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered && (
          <button
            className="flex items-center justify-center rounded-[4px] cursor-pointer"
            onClick={handleClick}
          >
            <img
              src="/icons/AddProject.svg"
              alt="일정 추가"
              className="w-[24px] h-[24px]"
            />
          </button>
        )}
      </div>
    </div>
  );
}
