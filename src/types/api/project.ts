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

export interface JoinProjectResponse {
  isSuccess: boolean;
  error: any;
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
