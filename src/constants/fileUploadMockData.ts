import { UploadFileResponse, DeleteFileResponse } from '@/types/api/fileUpload';

// 파일 업로드 모의 응답 데이터
export const getMockUploadFileResponse = (taskId: number, file: File): UploadFileResponse => ({
  isSuccess: true,
  error: null,
  result: {
    id: Math.floor(Math.random() * 1000) + 1, // 랜덤 ID 생성
    fileUrl: `https://s3.amazonaws.com/bucket/${file.name}`,
  },
});

// 파일 삭제 모의 응답 데이터
export const getMockDeleteFileResponse = (taskFileId: number): DeleteFileResponse => ({
  message: '업무 파일이 삭제되었습니다.',
});

// 파일 목록 모의 데이터
export const getMockFileList = () => [
  {
    id: 1,
    fileName: 'document.pdf',
    fileUrl: 'https://s3.amazonaws.com/bucket/document.pdf',
    fileSize: 1024 * 1024, // 1MB
    uploadedAt: '2024-07-31T17:30:00Z',
  },
  {
    id: 2,
    fileName: 'image.jpg',
    fileUrl: 'https://s3.amazonaws.com/bucket/image.jpg',
    fileSize: 512 * 1024, // 512KB
    uploadedAt: '2024-07-31T16:45:00Z',
  },
  {
    id: 3,
    fileName: 'data.txt',
    fileUrl: 'https://s3.amazonaws.com/bucket/data.txt',
    fileSize: 256 * 1024, // 256KB
    uploadedAt: '2024-07-31T15:20:00Z',
  },
];
