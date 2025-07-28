export interface CreateProjectRequest {
  name: string;
}

export interface CreateProjectReponse {
  isSuccess: boolean;
  error: string;
  result: {
    id: string;
    name: string;
    inviteCode: string;
  };
}
