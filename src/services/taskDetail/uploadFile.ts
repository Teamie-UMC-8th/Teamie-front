import axiosInstance from '@/lib/axiosInstance';
import { UploadFileResponse, DeleteFileResponse } from '@/types/api/fileUpload';
import {
  getMockUploadFileResponse,
  getMockDeleteFileResponse,
} from '@/constants/fileUploadMockData';

// 파일 업로드 함수
export const uploadTaskFile = async (taskId: number, file: File): Promise<UploadFileResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post(`/api/v1/tasks/${taskId}/task-files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('파일 업로드 실패:', error);

    // API 에러 응답 처리
    if (error.response?.status === 404) {
      throw new Error('업무를 찾을 수 없습니다.');
    }

    if (error.response?.status === 400) {
      throw new Error('파일을 선택해주세요.');
    }

    if (error.response?.status === 413) {
      throw new Error('파일 크기가 너무 큽니다.');
    }

    throw new Error('파일 업로드 중 오류가 발생했습니다.');
  }
};

// 파일 삭제 함수
export const deleteTaskFile = async (fileId: number): Promise<DeleteFileResponse> => {
  try {
    const response = await axiosInstance.delete(`/api/v1/files/${fileId}`);
    return response.data;
  } catch (error: any) {
    console.error('파일 삭제 실패:', error);

    // 개발 모드에서만 모의 데이터 사용
    if (process.env.NODE_ENV === 'development' && error.response?.status === 404) {
      console.warn('API가 준비되지 않아 모의 데이터를 사용합니다.');
      return getMockDeleteFileResponse(fileId);
    }

    // 실제 API 에러 응답 처리
    if (error.response?.status === 404) {
      throw new Error('삭제할 파일을 찾을 수 없습니다.');
    }

    throw new Error('파일 삭제 중 오류가 발생했습니다.');
  }
};
