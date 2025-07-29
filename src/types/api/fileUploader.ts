export interface UploadFileResponse {
  isSuccess: boolean;
  error: null;
  result: {
    id: number;
    fileUrl: string;
  };
}
