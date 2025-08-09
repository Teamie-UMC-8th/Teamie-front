// 파일 업로드 API 요청 타입 정의
export interface UploadFileRequest {
  file: File;
}

// 파일 업로드 API 응답 타입 정의 (API 문서에 맞춰 수정)
export interface UploadFileResponse {
  isSuccess: boolean;
  error: null;
  result: {
    id: number;
    fileUrl: string;
  };
}

// 파일 삭제 API 응답 타입 정의
export interface DeleteFileResponse {
  isSuccess: boolean;
  error: null;
  result: {
    message: string; // "업무 파일이 삭제되었습니다."
  };
}
