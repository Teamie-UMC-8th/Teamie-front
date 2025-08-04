import axiosInstance from '@/lib/axiosInstance';
import {
  ProjectHomeResponse,
  UpdateProjectRequest,
  UpdateProjectResponse,
  CreatePostItRequest,
  CreatePostItResponse,
  DeletePostItResponse,
  ChangeLeaderRequest,
  ChangeLeaderResponse,
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
 * 포스트잇을 생성하는 API
 */
export const createPostIt = async (
  projectId: number,
  postItData: CreatePostItRequest
): Promise<CreatePostItResponse> => {
  // 개발 환경에서는 mock 응답 사용
  if (process.env.NODE_ENV === 'development') {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      isSuccess: true,
      error: null,
      result: {
        id: Date.now(),
        userId: 1,
        content: postItData.content,
        projectId: projectId,
        createdAt: new Date().toISOString(),
      },
    };
  }

  const response = await axiosInstance.post<CreatePostItResponse>(
    `/api/v1/projects/${projectId}/posts`,
    postItData
  );
  return response.data;
};

/**
 * 포스트잇을 삭제하는 API
 */
export const deletePostIt = async (
  projectId: number,
  postId: number
): Promise<DeletePostItResponse> => {
  // 개발 환경에서는 mock 응답 사용
  if (process.env.NODE_ENV === 'development') {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      isSuccess: true,
      error: null,
      result: {
        message: '포스트잇이 성공적으로 삭제되었습니다.',
      },
    };
  }

  const response = await axiosInstance.delete<DeletePostItResponse>(
    `/api/v1/projects/${projectId}/posts/${postId}`
  );
  return response.data;
};

/**
 * 팀장을 변경하는 API
 */
export const changeLeader = async (
  projectId: number,
  leaderData: ChangeLeaderRequest
): Promise<ChangeLeaderResponse> => {
  // 개발 환경에서는 mock 응답 사용
  if (process.env.NODE_ENV === 'development') {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      isSuccess: true,
      error: null,
      result: {
        newLeaderId: leaderData.newLeaderId,
        permission: 'LEAD',
      },
    };
  }

  const response = await axiosInstance.patch<ChangeLeaderResponse>(
    `/api/v1/projects/${projectId}/leader`,
    leaderData
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
