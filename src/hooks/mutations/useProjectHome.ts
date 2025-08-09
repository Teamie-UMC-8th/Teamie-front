import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import {
  getProjectHome,
  updateProject,
  createPostIt,
  deletePostIt,
  changeLeader,
  updateProfile,
  transformUsersToTeamMembers,
  filterExpiredPostIts,
} from '@/services/ProjectHome/projectHome';
import {
  ProjectHomeResponse,
  UpdateProjectRequest,
  CreatePostItRequest,
  ChangeLeaderRequest,
  UpdateProfileRequest,
  PostItData,
  TeamMember,
} from '@/types/api/projectHome';

import axiosInstance from '@/lib/axiosInstance';

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
 * 프로필 카드를 수정하는 mutation 훅
 * @param projectId - 프로젝트 ID
 * @returns 프로필 카드 수정 mutation 함수와 상태
 */
export const useUpdateProfile = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: UpdateProfileRequest) => updateProfile(projectId, profileData),
    onSuccess: () => {
      // 프로젝트 홈 데이터를 다시 불러와서 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['projectHome', projectId] });
    },
    onError: (error) => {
      console.error('프로필 카드 수정 실패:', error);
    },
  });
};

/**
 * ProjectHomePage에서 사용하는 상태와 핸들러들을 관리하는 커스텀 훅
 * @param projectId - 프로젝트 ID
 * @returns ProjectHomePage에서 필요한 상태와 핸들러들
 */
export const useProjectHomeState = (projectId: number) => {
  const queryClient = useQueryClient();
  const { data: projectHomeData, isLoading, error } = useProjectHome(projectId);
  const updateProjectMutation = useUpdateProject(projectId);
  const createPostItMutation = useCreatePostIt(projectId);
  const deletePostItMutation = useDeletePostIt(projectId);
  const changeLeaderMutation = useChangeLeader(projectId);
  const updateProfileMutation = useUpdateProfile(projectId);

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

      // 기존 팀원이 없을 때만 설정 (로컬 상태 보존)
      if (teamMembers.length === 0) {
        setTeamMembers(members);
        console.log('API에서 가져온 팀원들:', members);
      } else {
        console.log('기존 팀원 유지, API 데이터로 덮어쓰지 않음');
      }
    }
  }, [projectHomeData, teamMembers.length]);

  // 프로젝트 생성 후 생성자의 프로필 카드를 바로 추가
  useEffect(() => {
    const addCreatorProfile = async () => {
      // 프로젝트 홈 데이터가 있고 사용자가 없거나 1명인 경우 (새로 생성된 프로젝트)
      if (projectHomeData?.result?.users && projectHomeData.result.users.length <= 1) {
        try {
          // 현재 사용자 정보 가져오기 (axiosInstance 사용)
          const userResponse = await axiosInstance.get('/api/v1/users/me');
          const userData = userResponse.data;

          if (userData.isSuccess && userData.result) {
            const currentUser = userData.result;

            // 이미 존재하는지 확인
            const existingUser = projectHomeData.result.users.find(
              (user: any) => user.email === currentUser.email
            );

            if (!existingUser) {
              // 생성자의 프로필 카드 추가 (permission을 LEAD로 설정)
              const creatorMember: TeamMember = {
                id: Date.now(), // 임시 ID
                name: currentUser.name || '생성자',
                university: currentUser.school || '',
                email: currentUser.email,
                role: '',
                isLeader: currentUser.permission === 'LEAD' || currentUser.permission === 'LEADER', // permission이 LEAD 또는 LEADER인 경우 팀장
              };

              console.log('생성자 프로필 카드 추가:', creatorMember);
              console.log('사용자 권한:', currentUser.permission);

              setTeamMembers((prev) => {
                // 이미 추가되어 있는지 확인
                const alreadyExists = prev.some((member) => member.email === creatorMember.email);
                if (!alreadyExists) {
                  return [...prev, creatorMember];
                }
                return prev;
              });
            }
          }
        } catch (error) {
          console.error('생성자 프로필 추가 실패:', error);
          // 에러 시에도 기본 생성자 정보 추가 (LEAD 권한으로 설정)
          const defaultCreatorMember: TeamMember = {
            id: Date.now(),
            name: '프로젝트 생성자',
            university: '학교',
            email: 'creator@example.com',
            role: '',
            isLeader: true, // 생성자는 기본적으로 LEAD 권한
          };

          console.log('기본 생성자 프로필 카드 추가:', defaultCreatorMember);

          setTeamMembers((prev) => {
            const alreadyExists = prev.some((member) => member.isLeader);
            if (!alreadyExists) {
              return [...prev, defaultCreatorMember];
            }
            return prev;
          });
        }
      }
    };

    // 프로젝트 홈 데이터가 있고 사용자가 1명 이하인 경우 실행
    if (projectHomeData?.result?.users && projectHomeData.result.users.length <= 1) {
      addCreatorProfile();
    }
  }, [projectHomeData]);

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
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

              // 프로젝트 홈 데이터 갱신은 제거 (로컬 상태 보존)
              console.log('팀장 변경 성공, 로컬 상태만 업데이트');
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
    // API를 통해 프로필 카드 수정
    updateProfileMutation.mutate(
      {
        id: memberId.toString(),
        role: field === 'role' ? value : '',
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            // 성공 시 로컬 상태 업데이트
            setTeamMembers((prev) =>
              prev.map((member) =>
                member.id === memberId ? { ...member, [field]: value } : member
              )
            );
          }
        },
        onError: (error: any) => {
          console.error('프로필 카드 수정 실패:', error);

          // 403 오류인 경우 사용자에게 알림
          if (error.response?.status === 403) {
            alert('프로필 수정 권한이 없습니다. 프로젝트 멤버인지 확인해주세요.');
          } else {
            alert('프로필 수정에 실패했습니다. 다시 시도해주세요.');
          }

          // 에러 시에도 로컬 상태 업데이트 (개발 환경)
          if (process.env.NODE_ENV === 'development') {
            setTeamMembers((prev) =>
              prev.map((member) =>
                member.id === memberId ? { ...member, [field]: value } : member
              )
            );
          }
        },
      }
    );
  };

  /**
   * 프로젝트 참여 핸들러
   */
  const handleJoinProject = () => {
    // 새로운 팀원 추가 (더 나은 기본값 사용)
    const newMember = {
      id: Date.now(),
      name: '이름 ',
      university: '학교',
      email: 'new@example.com',
      role: '',
      isLeader: false,
    };

    console.log('새 팀원 추가:', newMember);
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
    updateProfileMutation,
    updateProjectMutation,
  };
};
