import axiosInstance from '@/lib/axiosInstance';
import { UploadFileResponse, DeleteFileResponse } from '@/types/api/fileUpload';

// 파일 업로드 함수
export const uploadTaskFile = async (taskId: number, file: File): Promise<UploadFileResponse> => {
  try {
    // file.name이 undefined일 수 있으므로 안전하게 처리
    const fileName = file?.name || 'Unknown File';
    console.log('🔍 파일 업로드 시작:', { taskId, fileName, fileSize: file.size });

    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post(`/api/v1/tasks/${taskId}/task-files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ 파일 업로드 성공:', response.data);
    console.log('📁 업로드된 파일 정보:', {
      id: response.data.result?.id,
      fileUrl: response.data.result?.fileUrl,
      hasId: response.data.result && 'id' in response.data.result,
      resultKeys: response.data.result ? Object.keys(response.data.result) : null,
    });
    return response.data;
  } catch (error: unknown) {
    console.error('❌ 파일 업로드 실패:', error);

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
        throw new Error('업무를 찾을 수 없습니다.');
      }

      if (status === 400) {
        throw new Error('파일을 선택해주세요.');
      }

      if (status === 413) {
        throw new Error('파일 크기가 너무 큽니다.');
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

    throw new Error('파일 업로드 중 오류가 발생했습니다.');
  }
};

// 파일 삭제 함수
export const deleteTaskFile = async (taskFileId: number): Promise<DeleteFileResponse> => {
  try {
    console.log('🔍 파일 삭제 시작:', { taskFileId });

    const response = await axiosInstance.delete(`/api/v1/task-files/${taskFileId}`);

    console.log('✅ 파일 삭제 성공:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('❌ 파일 삭제 실패:', error);

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
        throw new Error('삭제할 파일을 찾을 수 없습니다.');
      }

      if (status === 400) {
        throw new Error('파일 삭제 요청이 잘못되었습니다.');
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

    throw new Error('파일 삭제 중 오류가 발생했습니다.');
  }
};
