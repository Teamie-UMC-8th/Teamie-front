import axiosInstance from '@/lib/axiosInstance';
import {
  ProjectHomeResponse,
  UpdateProjectRequest,
  UpdateProjectResponse,
  ProjectUser,
  TeamMember,
} from '@/types/api/projectHome';
import { projectHomeMockData } from '@/constants/projectHomeMockData';

/**
 * 프로젝트 홈 데이터를 조회하는 API
 */
export const getProjectHome = async (projectId: number): Promise<ProjectHomeResponse> => {
  // 개발 환경에서는 mock 데이터 사용
  if (process.env.NODE_ENV === 'development') {
    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return projectHomeMockData;
  }

  const response = await axiosInstance.get<ProjectHomeResponse>(`/api/v1/projects/${projectId}`);
  return response.data;
};

/**
 * 프로젝트 정보를 수정하는 API
 */
export const updateProject = async (
  projectId: number,
  updateData: UpdateProjectRequest
): Promise<UpdateProjectResponse> => {
  // 개발 환경에서는 mock 응답 사용
  if (process.env.NODE_ENV === 'development') {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      isSuccess: true,
      error: null,
      result: {
        project: {
          ...projectHomeMockData.result!.project,
          ...updateData,
        },
      },
    };
  }

  const response = await axiosInstance.patch<UpdateProjectResponse>(
    `/api/v1/projects/${projectId}`,
    updateData
  );
  return response.data;
};

/**
 * API 사용자 데이터를 TeamMember 형식으로 변환하는 함수
 */
export const transformUsersToTeamMembers = (users: ProjectUser[]): TeamMember[] => {
  return users.map((user: ProjectUser) => ({
    id: user.id,
    name: user.name,
    university: user.school,
    email: user.email,
    role: user.role,
    isLeader: user.permission === 'LEADER',
  }));
};

/**
 * 만료된 PostIt을 필터링하는 함수
 */
export const filterExpiredPostIts = (postIts: any[]): any[] => {
  const now = Date.now();
  const fortyEightHours = 48 * 60 * 60 * 1000; // 48시간을 밀리초로

  return postIts.filter((postIt) => {
    const timeElapsed = now - postIt.createdAt;
    return timeElapsed < fortyEightHours;
  });
};
