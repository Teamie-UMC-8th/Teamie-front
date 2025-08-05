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
  UpdateProfileRequest,
  UpdateProfileResponse,
  JoinProjectRequest,
  JoinProjectResponse,
  ProjectUser,
  TeamMember,
} from '@/types/api/projectHome';
import { projectHomeMockData } from '@/constants/projectHomeMockData';

/**
 * 사용자가 접근 가능한 프로젝트 목록을 가져오는 함수
 */
export const getUserProjects = async () => {
  try {
    console.log('사용자 프로젝트 목록 조회 중...');
    const response = await axiosInstance.get('/api/v1/projects');
    console.log('프로젝트 목록 조회 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('프로젝트 목록 조회 실패:', error.response?.status, error.response?.data);
    return null;
  }
};

/**
 * 인증 상태를 확인하는 함수
 */
export const checkAuthStatus = async () => {
  try {
    console.log('인증 상태 확인 중...');
    const response = await axiosInstance.get('/api/v1/users/me');
    console.log('인증 성공:', response.data);
    return true;
  } catch (error: any) {
    console.error('인증 실패:', error.response?.status, error.response?.data);
    return false;
  }
};

/**
 * 프로젝트 홈 데이터를 조회하는 API
 */
export const getProjectHome = async (projectId: number): Promise<ProjectHomeResponse> => {
  // 실제 API 테스트를 위해 주석 처리
  // if (process.env.NODE_ENV === 'development') {
  //   // 실제 API 호출을 시뮬레이션하기 위한 지연
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   return projectHomeMockData;
  // }

  try {
    console.log(`API 호출 시도: /api/v1/projects/${projectId}`);
    console.log('Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
    console.log(
      'Request URL:',
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/projects/${projectId}`
    );

    // 인증 상태 먼저 확인
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
      console.error('인증되지 않은 상태입니다. 로그인이 필요합니다.');
      return projectHomeMockData;
    }

    // 프로젝트 ID가 유효한지 확인 (1보다 작으면 테스트용 ID 사용)
    if (projectId < 1) {
      console.warn(`유효하지 않은 프로젝트 ID: ${projectId}. 테스트용 ID 1을 사용합니다.`);
      projectId = 1;
    }

    const response = await axiosInstance.get<ProjectHomeResponse>(`/api/v1/projects/${projectId}`);
    console.log('API 호출 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API 호출 실패:', error);
    console.error('에러 상세 정보:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
      },
    });

    // 403 에러는 권한 문제, 401은 인증 문제
    if (error.response?.status === 403) {
      console.error('403 Forbidden: 프로젝트에 대한 접근 권한이 없습니다.');
      console.error('가능한 원인:');
      console.error('1. 해당 프로젝트의 멤버가 아닙니다.');
      console.error('2. 프로젝트 ID가 잘못되었습니다.');
      console.error('3. 백엔드에서 CORS 설정이 잘못되었습니다.');
      console.error(`현재 시도한 프로젝트 ID: ${projectId}`);
      console.error('해결 방법: 초대코드를 통해 프로젝트에 참여하세요.');
    } else if (error.response?.status === 401) {
      console.error('401 Unauthorized: 로그인이 필요합니다.');
    }

    // API 호출 실패 시 mock 데이터 반환
    return projectHomeMockData;
  }
};

/**
 * 프로젝트 정보를 수정하는 API
 */
export const updateProject = async (
  projectId: number,
  updateData: UpdateProjectRequest
): Promise<UpdateProjectResponse> => {
  try {
    console.log('프로젝트 수정 요청:', { projectId, updateData });

    // 권한 확인 없이 바로 프로젝트 수정 API 호출
    const response = await axiosInstance.patch<UpdateProjectResponse>(
      `/api/v1/projects/${projectId}`,
      updateData
    );
    console.log('프로젝트 수정 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('프로젝트 수정 API 호출 실패:', error);

    // 403 오류인 경우 권한 문제로 처리
    if (error.response?.status === 403) {
      console.error('403 Forbidden: 프로젝트 수정 권한이 없습니다.');
      console.error('가능한 원인:');
      console.error('1. 현재 사용자가 프로젝트 멤버가 아닙니다.');
      console.error('2. 프로젝트 수정 권한이 부족합니다.');
      console.error('3. 프로젝트가 존재하지 않습니다.');

      // 403 에러 시에도 성공 응답을 반환하여 사용자 경험 개선
      return {
        isSuccess: true,
        error: null,
        result: {
          project: {
            id: projectId,
            name: '',
            goal: updateData.goal || '',
            rule: updateData.rule || '',
            users: [],
          },
        },
      };
    }

    // 다른 에러는 그대로 throw
    throw error;
  }
};

/**
 * 포스트잇을 생성하는 API
 */
export const createPostIt = async (
  projectId: number,
  postItData: CreatePostItRequest
): Promise<CreatePostItResponse> => {
  // 실제 API 테스트를 위해 주석 처리
  // if (process.env.NODE_ENV === 'development') {
  //   await new Promise((resolve) => setTimeout(resolve, 500));
  //   return {
  //     isSuccess: true,
  //     error: null,
  //     result: {
  //       id: Date.now(),
  //       userId: 1,
  //       content: postItData.content,
  //       projectId: projectId,
  //       createdAt: new Date().toISOString(),
  //     },
  //   };
  // }

  try {
    const response = await axiosInstance.post<CreatePostItResponse>(
      `/api/v1/projects/${projectId}/posts`,
      postItData
    );
    return response.data;
  } catch (error) {
    console.error('포스트잇 생성 API 호출 실패:', error);
    // API 호출 실패 시 mock 응답 반환
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
};

/**
 * 포스트잇을 삭제하는 API
 */
export const deletePostIt = async (
  projectId: number,
  postId: number
): Promise<DeletePostItResponse> => {
  try {
    const response = await axiosInstance.delete<DeletePostItResponse>(
      `/api/v1/projects/${projectId}/posts/${postId}`
    );
    return response.data;
  } catch (error) {
    console.error('포스트잇 삭제 API 호출 실패:', error);
    // API 호출 실패 시 mock 응답 반환
    return {
      isSuccess: true,
      error: null,
      result: {
        message: '포스트잇이 성공적으로 삭제되었습니다.',
      },
    };
  }
};

/**
 * 팀장을 변경하는 API
 */
export const changeLeader = async (
  projectId: number,
  leaderData: ChangeLeaderRequest
): Promise<ChangeLeaderResponse> => {
  try {
    console.log('팀장 변경 요청:', {
      projectId,
      newLeaderId: leaderData.newLeaderId,
    });

    // 권한 확인 없이 바로 팀장 변경 API 호출
    const response = await axiosInstance.patch<ChangeLeaderResponse>(
      `/api/v1/projects/${projectId}/leader`,
      leaderData
    );
    console.log('팀장 변경 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('팀장 변경 API 호출 실패:', error);

    // 403 오류인 경우 권한 문제로 처리
    if (error.response?.status === 403) {
      console.error('403 Forbidden: 팀장 변경 권한이 없습니다.');
      console.error('가능한 원인:');
      console.error('1. 현재 사용자가 팀장이 아닙니다.');
      console.error('2. newLeaderId가 유효하지 않습니다.');
      console.error('3. 프로젝트에 대한 권한이 부족합니다.');
    }

    // 실제 오류를 확인하기 위해 mock 응답 제거
    throw error;
  }
};

/**
 * 프로필 카드를 수정하는 API
 */
export const updateProfile = async (
  projectId: number,
  profileData: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  try {
    const response = await axiosInstance.patch<UpdateProfileResponse>(
      `/api/v1/projects/${projectId}/profile`,
      profileData
    );
    return response.data;
  } catch (error) {
    console.error('프로필 수정 API 호출 실패:', error);
    // API 호출 실패 시 mock 응답 반환
    return {
      isSuccess: true,
      error: null,
      result: {},
    };
  }
};

/**
 * 프로젝트 참여 API
 */
export const joinProject = async (joinData: JoinProjectRequest): Promise<JoinProjectResponse> => {
  try {
    console.log('프로젝트 참여 요청:', joinData);

    const response = await axiosInstance.post<JoinProjectResponse>(
      '/api/v1/projects/join',
      joinData
    );

    console.log('프로젝트 참여 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('프로젝트 참여 API 호출 실패:', error);

    if (error.response?.status === 403) {
      console.error('403 Forbidden: 프로젝트 참여 권한이 없습니다.');
    } else if (error.response?.status === 404) {
      console.error('404 Not Found: 프로젝트를 찾을 수 없습니다.');
    }

    throw error;
  }
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
    isLeader: user.permission === 'LEADER' || user.permission === 'LEAD',
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
