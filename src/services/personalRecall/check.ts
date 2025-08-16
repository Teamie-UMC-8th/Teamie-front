import axiosInstance from '@/lib/axiosInstance'; // 공용 axios 인스턴스
import { PersonalRetroResponse, PersonalRetro } from '@/types/api/personalRecall';
//API 응답과 실제 회고 데이터의 타입을 가져옴
//타입 안정성을 보장하기 위함

//회고 데이터 조회 함수
//매개변수 : projectId(숫자)
//반환값 : PersonalRetro 타입의 데이터
//응답 타입을 PersonalRetroRespons로 지정, 객체는 PersonalRetroResponse 구조를 따름
export const fetchPersonalRetro = async (projectId: number): Promise<PersonalRetro> => {
  const { data } = await axiosInstance.get<PersonalRetroResponse>(
    `/api/v1/projects/${projectId}/personal-recalls`
  );
  return data.result;
};
