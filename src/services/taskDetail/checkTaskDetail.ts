import axiosInstance from '@/lib/axiosInstance';
import {
  TaskDetailResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  DeleteTaskResponse,
  FileItem,
} from '@/types/api/taskDetail';

// 업무 상세 조회 함수
export const checkTaskDetail = async (taskId: number): Promise<TaskDetailResponse> => {
  try {
    console.log('🔍 업무 상세 조회 시작:', { taskId });
    console.log('📡 API 호출 시도:', `/api/v1/tasks/${taskId}`);

    const response = await axiosInstance.get(`/api/v1/tasks/${taskId}`);

    console.log('✅ 업무 상세 조회 성공:', response.data);
    console.log('📊 응답 데이터 구조:', {
      isSuccess: response.data.isSuccess,
      hasError: !!response.data.error,
      hasResult: !!response.data.result,
      resultKeys: response.data.result ? Object.keys(response.data.result) : null,
    });

    if (response.data.result) {
      console.log('📋 업무 상세 정보:', {
        name: response.data.result.name,
        deadline: response.data.result.deadline,
        status: response.data.result.status,
        memo: response.data.result.memo,
        stepId: response.data.result.stepId,
        managersCount: response.data.result.managers?.length || 0,
        managers: response.data.result.managers, // 담당자 배열 추가
        filesCount: response.data.result.files?.length || 0,
        files: response.data.result.files, // 파일 배열 추가
      });

      // 파일 정보 상세 로깅
      if (response.data.result.files && response.data.result.files.length > 0) {
        console.log('📁 API 응답 - 파일 상세 정보:', response.data.result.files);
        console.log(
          '📁 파일 구조 확인:',
          response.data.result.files.map((file: FileItem) => ({
            id: file.id,
            fileUrl: file.fileUrl,
            hasId: 'id' in file,
            keys: Object.keys(file),
          }))
        );
      } else {
        console.log('📁 API 응답 - 파일 없음');
      }

      // 담당자 정보 상세 로깅
      if (response.data.result.managers && response.data.result.managers.length > 0) {
        console.log(
          '👥 API 응답 - 담당자 상세 정보:',
          response.data.result.managers.map((manager: { userId: number; userName: string }) => ({
            userId: manager.userId,
            userName: manager.userName,
          }))
        );
      } else {
        console.log('👥 API 응답 - 담당자 없음');
      }
    }

    return response.data;
  } catch (error: unknown) {
    console.error('❌ 업무 상세 조회 실패:', error);

    // 실제 API 에러 응답 처리
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response &&
      error.response.status === 404
    ) {
      const errorData = (error.response as { data?: { error?: { reason?: string } } }).data;
      if (errorData?.error?.reason) {
        console.error('🔍 404 에러 상세:', errorData.error.reason);
        throw new Error(errorData.error.reason);
      }
      console.error('🔍 404 에러: 업무를 찾을 수 없습니다.');
      throw new Error('업무를 찾을 수 없습니다.');
    }

    console.error('🔍 기타 에러:', error);
    throw new Error('업무를 불러오는 중 오류가 발생했습니다.');
  }
};

// 업무 수정 함수
export const updateTaskDetail = async (
  taskId: number,
  data: UpdateTaskRequest
): Promise<UpdateTaskResponse> => {
  try {
    console.log('🔧 업무 수정 시작:', { taskId, data });
    const response = await axiosInstance.patch(`/api/v1/tasks/${taskId}`, data);
    console.log('✅ 업무 수정 성공:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('❌ 업무 수정 실패:', error);

    // 400 오류에 대한 자세한 정보 로깅
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response &&
      error.response.status === 400
    ) {
      const errorData = (
        error.response as { data?: { error?: { reason?: string }; message?: string } }
      ).data;
      console.error('🔍 400 Bad Request 상세 정보:', {
        status: error.response.status,
        data: errorData,
        requestData: data,
      });

      // API에서 반환한 구체적인 에러 메시지가 있다면 사용
      if (errorData?.error?.reason) {
        throw new Error(errorData.error.reason);
      } else if (errorData?.message) {
        throw new Error(errorData.message);
      }
    }

    throw new Error('업무 수정 중 오류가 발생했습니다.');
  }
};

// 업무 삭제 함수
export const deleteTaskDetail = async (taskId: number): Promise<DeleteTaskResponse> => {
  try {
    console.log('🔍 업무 삭제 시작:', { taskId });
    console.log('📡 API 호출 시도:', `/api/v1/tasks/${taskId}`);

    const response = await axiosInstance.delete(`/api/v1/tasks/${taskId}`);

    console.log('✅ 업무 삭제 성공:', response.data);
    console.log('📊 응답 데이터 구조:', {
      isSuccess: response.data.isSuccess,
      hasError: !!response.data.error,
      hasResult: !!response.data.result,
      resultKeys: response.data.result ? Object.keys(response.data.result) : null,
    });
    return response.data;
  } catch (error: unknown) {
    console.error('❌ 업무 삭제 실패:', error);

    // API 에러 응답 처리
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response
    ) {
      const status = error.response.status;

      if (status === 404) {
        throw new Error('삭제할 업무를 찾을 수 없습니다.');
      }

      if (status === 403) {
        throw new Error('업무 삭제 권한이 없습니다.');
      }

      if (status === 400) {
        throw new Error('업무 삭제 요청이 잘못되었습니다.');
      }

      // API에서 반환한 구체적인 에러 메시지가 있다면 사용
      const errorData = (
        error.response as { data?: { error?: { reason?: string }; message?: string } }
      ).data;
      if (errorData?.error?.reason) {
        throw new Error(errorData.error.reason);
      } else if (errorData?.message) {
        throw new Error(errorData.message);
      }
    }

    throw new Error('업무 삭제 중 오류가 발생했습니다.');
  }
};
