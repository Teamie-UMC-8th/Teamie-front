import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import {
  getProjectHome,
  updateProject,
  createPostIt,
  deletePostIt,
  changeLeader,
  transformUsersToTeamMembers,
  filterExpiredPostIts,
} from '@/services/ProjectHome/projectHome';
import {
  ProjectHomeResponse,
  UpdateProjectRequest,
  CreatePostItRequest,
  ChangeLeaderRequest,
  PostItData,
  TeamMember,
} from '@/types/api/projectHome';
import { postItMockData } from '@/constants/projectHomeMockData';

/**
 * 프로젝트 홈 데이터를 조회하는 쿼리 훅
 * @param projectId - 프로젝트 ID
 * @returns 프로젝트 홈 데이터와 로딩/에러 상태
 */
export const useProjectHome = (projectId: number) => {
  return useQuery<ProjectHomeResponse>({
    queryKey: ['projectHome', projectId],
    queryFn: () => getProjectHome(projectId),
    enabled: !!projectId,
    // 개발 환경에서 mock 데이터 사용 시 캐시 시간 설정
    staleTime: process.env.NODE_ENV === 'development' ? 5 * 60 * 1000 : 0, // 5분
  });
};

/**
 * 프로젝트 정보를 수정하는 mutation 훅
 * @param projectId - 프로젝트 ID
 * @returns 프로젝트 수정 mutation 함수와 상태
 */
export const useUpdateProject = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: UpdateProjectRequest) => updateProject(projectId, updateData),
    onSuccess: () => {
      // 프로젝트 홈 데이터를 다시 불러와서 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['projectHome', projectId] });
    },
    onError: (error) => {
      console.error('프로젝트 수정 실패:', error);
    },
  });
};

/**
 * 포스트잇을 생성하는 mutation 훅
 * @param projectId - 프로젝트 ID
 * @returns 포스트잇 생성 mutation 함수와 상태
 */
export const useCreatePostIt = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postItData: CreatePostItRequest) => createPostIt(projectId, postItData),
    onSuccess: () => {
      // 포스트잇 관련 쿼리를 무효화하여 데이터 업데이트
      queryClient.invalidateQueries({ queryKey: ['postIts', projectId] });
    },
    onError: (error) => {
      console.error('포스트잇 생성 실패:', error);
    },
  });
};

/**
 * 포스트잇을 삭제하는 mutation 훅
 * @param projectId - 프로젝트 ID
 * @returns 포스트잇 삭제 mutation 함수와 상태
 */
export const useDeletePostIt = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deletePostIt(projectId, postId),
    onSuccess: () => {
      // 포스트잇 관련 쿼리를 무효화하여 데이터 업데이트
      queryClient.invalidateQueries({ queryKey: ['postIts', projectId] });
    },
    onError: (error) => {
      console.error('포스트잇 삭제 실패:', error);
    },
  });
};

/**
 * 팀장을 변경하는 mutation 훅
 * @param projectId - 프로젝트 ID
 * @returns 팀장 변경 mutation 함수와 상태
 */
export const useChangeLeader = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leaderData: ChangeLeaderRequest) => changeLeader(projectId, leaderData),
    onSuccess: () => {
      // 프로젝트 홈 데이터를 다시 불러와서 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['projectHome', projectId] });
    },
    onError: (error) => {
      console.error('팀장 변경 실패:', error);
    },
  });
};

/**
 * ProjectHomePage에서 사용하는 상태와 핸들러들을 관리하는 커스텀 훅
 * @param projectId - 프로젝트 ID
 * @returns ProjectHomePage에서 필요한 상태와 핸들러들
 */
export const useProjectHomeState = (projectId: number) => {
  const { data: projectHomeData, isLoading, error } = useProjectHome(projectId);
  const updateProjectMutation = useUpdateProject(projectId);
  const createPostItMutation = useCreatePostIt(projectId);
  const deletePostItMutation = useDeletePostIt(projectId);
  const changeLeaderMutation = useChangeLeader(projectId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTextFieldModalOpen, setIsTextFieldModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isChangeLeaderModalOpen, setIsChangeLeaderModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [textFieldModalType, setTextFieldModalType] = useState<'goal' | 'rules'>('goal');
  const [postIts, setPostIts] = useState<PostItData[]>([]);
  const [teamGoal, setTeamGoal] = useState('');
  const [teamRules, setTeamRules] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // API 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (projectHomeData?.result?.project) {
      const project = projectHomeData.result.project;
      setTeamGoal(project.goal || '');
      setTeamRules(project.rule || '');

      // API 사용자 데이터를 TeamMember 형식으로 변환
      const members = transformUsersToTeamMembers(project.users);
      setTeamMembers(members);
    }
  }, [projectHomeData]);

  // 개발 환경에서 초기 PostIt 데이터 설정
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && postIts.length === 0) {
      setPostIts(postItMockData);
    }
  }, [postIts.length]);

  // 48시간 후 자동 삭제 체크
  useEffect(() => {
    const checkExpiredPostIts = () => {
      setPostIts((prevPostIts) => filterExpiredPostIts(prevPostIts));
    };

    // 초기 체크
    checkExpiredPostIts();

    // 1분마다 체크
    const interval = setInterval(checkExpiredPostIts, 60000);

    return () => clearInterval(interval);
  }, []);

  /**
   * 게시판 클릭 핸들러
   */
  const handleBoardClick = () => {
    setIsModalOpen(true);
  };

  /**
   * 모달 닫기 핸들러
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  /**
   * PostIt 저장 핸들러
   */
  const handleSavePostIt = (content: string) => {
    // API를 통해 포스트잇 생성
    createPostItMutation.mutate(
      { content },
      {
        onSuccess: (data) => {
          if (data.isSuccess && data.result) {
            // 성공 시 로컬 상태에도 추가
            const newPostIt: PostItData = {
              id: data.result.id.toString(),
              content: data.result.content,
              createdAt: new Date(data.result.createdAt).getTime(),
            };
            setPostIts([...postIts, newPostIt]);
          }
        },
        onError: (error) => {
          console.error('포스트잇 생성 실패:', error);
          // 에러 시에도 로컬에 추가 (개발 환경)
          if (process.env.NODE_ENV === 'development') {
            const newPostIt: PostItData = {
              id: Date.now().toString(),
              content: content,
              createdAt: Date.now(),
            };
            setPostIts([...postIts, newPostIt]);
          }
        },
      }
    );
    setIsModalOpen(false);
  };

  /**
   * PostIt 삭제 핸들러
   */
  const handleDeletePostIt = (id: string) => {
    // API를 통해 포스트잇 삭제
    deletePostItMutation.mutate(parseInt(id), {
      onSuccess: (data) => {
        if (data.isSuccess) {
          // 성공 시 로컬 상태에서도 제거
          setPostIts(postIts.filter((postIt) => postIt.id !== id));
        }
      },
      onError: (error) => {
        console.error('포스트잇 삭제 실패:', error);
        // 에러 시에도 로컬에서 제거 (개발 환경)
        if (process.env.NODE_ENV === 'development') {
          setPostIts(postIts.filter((postIt) => postIt.id !== id));
        }
      },
    });
  };

  /**
   * 전체보기 모달 열기 핸들러
   */
  const handleShowFullText = (type: 'goal' | 'rules') => {
    setTextFieldModalType(type);
    setIsTextFieldModalOpen(true);
  };

  /**
   * TextField 모달 닫기 핸들러
   */
  const handleCloseTextFieldModal = () => {
    setIsTextFieldModalOpen(false);
  };

  /**
   * TextField 모달 저장 핸들러
   */
  const handleSaveTextFieldModal = (content: string) => {
    if (textFieldModalType === 'goal') {
      setTeamGoal(content);
      // API 호출하여 팀 목표 업데이트
      updateProjectMutation.mutate({ goal: content });
    } else {
      setTeamRules(content);
      // API 호출하여 팀 규칙 업데이트
      updateProjectMutation.mutate({ rule: content });
    }
    setIsTextFieldModalOpen(false);
  };

  /**
   * 팀원 추가 모달 열기 핸들러
   */
  const handleAddTeamMember = () => {
    setIsAddTeamModalOpen(true);
  };

  /**
   * 팀원 추가 모달 닫기 핸들러
   */
  const handleCloseAddTeamModal = () => {
    setIsAddTeamModalOpen(false);
  };

  /**
   * 팀장 변경 모달 열기 핸들러
   */
  const handleChangeLeader = (memberId: number) => {
    setSelectedMemberId(memberId);
    setIsChangeLeaderModalOpen(true);
  };

  /**
   * 팀장 변경 확인 핸들러
   */
  const handleConfirmChangeLeader = () => {
    if (selectedMemberId) {
      // API를 통해 팀장 변경
      changeLeaderMutation.mutate(
        { newLeaderId: selectedMemberId },
        {
          onSuccess: (data) => {
            if (data.isSuccess && data.result) {
              // 성공 시 로컬 상태 업데이트
              setTeamMembers((prev) =>
                prev.map((member) => ({
                  ...member,
                  isLeader: member.id === selectedMemberId,
                }))
              );
            }
          },
          onError: (error) => {
            console.error('팀장 변경 실패:', error);
            // 에러 시에도 로컬 상태 업데이트 (개발 환경)
            if (process.env.NODE_ENV === 'development') {
              setTeamMembers((prev) =>
                prev.map((member) => ({
                  ...member,
                  isLeader: member.id === selectedMemberId,
                }))
              );
            }
          },
        }
      );
    }
    setIsChangeLeaderModalOpen(false);
    setSelectedMemberId(null);
  };

  /**
   * 팀장 변경 모달 닫기 핸들러
   */
  const handleCloseChangeLeaderModal = () => {
    setIsChangeLeaderModalOpen(false);
    setSelectedMemberId(null);
  };

  /**
   * 팀 멤버 정보 업데이트 핸들러
   */
  const handleUpdateTeamMember = (
    memberId: number,
    field: 'university' | 'role',
    value: string
  ) => {
    setTeamMembers((prev) =>
      prev.map((member) => (member.id === memberId ? { ...member, [field]: value } : member))
    );
  };

  /**
   * 프로젝트 참여 핸들러
   */
  const handleJoinProject = () => {
    // 로그인 사용자 정보 (실제로는 AuthContext에서 가져와야 함)
    const newMember = {
      id: Date.now(),
      name: '이름',
      university: '학교',
      email: 'new@example.com',
      role: '역할',
      isLeader: false,
    };

    setTeamMembers([...teamMembers, newMember]);
  };

  return {
    // 상태
    projectHomeData,
    isLoading,
    error,
    isModalOpen,
    isTextFieldModalOpen,
    isAddTeamModalOpen,
    isChangeLeaderModalOpen,
    selectedMemberId,
    textFieldModalType,
    postIts,
    teamGoal,
    teamRules,
    teamMembers,
    // 핸들러
    handleBoardClick,
    handleCloseModal,
    handleSavePostIt,
    handleDeletePostIt,
    handleShowFullText,
    handleCloseTextFieldModal,
    handleSaveTextFieldModal,
    handleAddTeamMember,
    handleCloseAddTeamModal,
    handleChangeLeader,
    handleConfirmChangeLeader,
    handleCloseChangeLeaderModal,
    handleUpdateTeamMember,
    handleJoinProject,
    // 상태 설정 함수
    setTeamGoal,
    setTeamRules,
    // mutation 상태
    createPostItMutation,
    deletePostItMutation,
    changeLeaderMutation,
  };
};
