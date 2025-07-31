export interface CreateProjectRequest {
  name: string;
}

export interface CreateProjectReponse {
  isSuccess: boolean;
  error: string;
  result: {
    result: {
      id: string;
      name: string;
      inviteCode: string;
      expiresAt: string;
    };
  };
}

export interface GetJoinProjectRequest {
  inviteCode: string;
}

export interface GetJoinProjectResponse {
  isSuccess: boolean;
  error: {
    errorCode: string;
    reason: string;
    data: any;
  };
  result: {
    project: {
      id: string;
      name: string;
    };
    users: Array<{
      id: number;
      name: string;
      email: string;
      school: string;
      imageUrl: any;
      tasks: Array<{
        taskName: string;
      }>;
      permission: string;
      role: string;
    }>;
    posts: Array<{
      author: string;
      content: string;
    }>;
  };
}

export interface PostJoinProjectRequest {
  inviteCode: string;
}

export interface PostJoinProjectResponse {
  isSuccess: boolean;
  error: string | null;
  result: {
    message: string;
    projectId: string;
    projectName: string;
  };
}
