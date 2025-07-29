"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import EditableMarkdown from "./EditableMarkdown";
import { useGetPersonalRetro } from "@/hooks/mutations/useGetPersonalRetro";
import { usePatchPersonalRetro } from "@/hooks/mutations/usePatchPersonalRetro";

export default function PersonalSection() {
  const params = useParams();
  const projectId = Number(params.projectId);

  const { data, isLoading, error } = useGetPersonalRetro(projectId);
  const { mutate } = usePatchPersonalRetro();

  useEffect(() => {
    console.log("params:", params);
    console.log("projectId:", projectId);
  }, [params]);

  const handleSave = (
    field: "collaborationProfile" | "memorableExperience" | "strengthsAndGrowth",
    value: string
  ) => {
    if (!data) return;
    mutate({
      projectId,
      data: {
        ...data,
        [field]: value,
      },
    });
  };

  if (isLoading) {
    return <div className="text-center">불러오는 중...</div>;
  }

  if (axios.isAxiosError(error) && error.response?.status === 404) {
    return (
      <div className="text-center text-gray-500 text-[18px] font-medium">
        개인 회고가 아직 생성되지 않았습니다.
        <br />
        프로젝트가 종료되면 자동으로 생성됩니다.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-[28px]">
      <SectionBox
        title="1. 나의 역할과 일하는 방식"
        bullets={[
          "내가 맡은 공식적 역할 외에, 자연스럽게 맡게 된 행동이나 역할이 있었나요?",
          "내가 주도하거나 적극적으로 기여한 순간은 언제였나요?",
          "협업에서 내가 특히 신경 쓴 점은 무엇인가요? (예: 일정 관리, 팀 분위기 등)",
          "이 프로젝트에서 나와 잘 맞았던 협업 및 소통 방식이나 흐름이 있었나요?",
        ]}
        initialValue={data?.collaborationProfile || ""}
        onSave={(value) => handleSave("collaborationProfile", value)}
      />

      <SectionBox
        title="2. 기억에 남는 경험과 변화"
        bullets={[
          "가장 어려웠던 점은 무엇이었고, 어떻게 극복했나요?",
          "협업 중 기억에 남는 갈등이나 돌발상황이 있었나요? 그 상황에서 나는 어떻게 행동했나요?",
          "내가 감정적으로 크게 동요했거나, 가치관을 자극받았던 순간은 언제였나요?",
          "이번 프로젝트를 통해 강화되었거나 달라진 나의 가치관이나 일하는 태도는 무엇인가요?",
        ]}
        initialValue={data?.memorableExperience || ""}
        onSave={(value) => handleSave("memorableExperience", value)}
      />

      <SectionBox
        title="3. 나의 강점과 성장 포인트"
        bullets={[
          "이 프로젝트를 통해 드러난 나의 강점은 무엇인가요?",
          "이 프로젝트를 통해 드러난 나의 개선이 필요한 부분은 어떤 점인가요?",
          "이 강점 또는 취약점을 인식하게 된 계기가 있었나요?",
          "다음 프로젝트에서 이 점을 어떻게 살리고, 보완하고 싶나요?",
        ]}
        initialValue={data?.strengthsAndGrowth || ""}
        onSave={(value) => handleSave("strengthsAndGrowth", value)}
      />
    </div>
  );
}

interface SectionBoxProps {
  title: string;
  bullets: string[];
  initialValue: string;
  onSave: (value: string) => void;
}

function SectionBox({ title, bullets, initialValue, onSave }: SectionBoxProps) {
  return (
    <div className="w-[1415px] max-lg:w-[862px] bg-[#F8F8F8] shadow-[0_0_4px_rgba(0,0,0,0.2)] rounded-[16px] px-[40px] pt-[32px] pb-[52px] mb-[40px] max-lg:px-[20px] max-lg:pt-[24px] max-lg:pb-[28px]">
      <h2 className="font-[Pretendard] text-[#000000] font-bold text-[20px] leading-[28px] mb-[8px] max-lg:text-[18px] max-lg:leading-[26px]">
        {title}
      </h2>
      <ul className="list-disc list-outside pl-[30px] space-y-[8px] text-[16px] leading-[24px] font-[Pretendard] font-normal text-[#000000] marker:text-[11px] mb-[28px] max-lg:pl-[20px] max-lg:text-[15px] max-lg:marker:text-[10px]">
        {bullets.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <EditableMarkdown initialValue={initialValue} onSave={onSave} />
    </div>
  );
}
