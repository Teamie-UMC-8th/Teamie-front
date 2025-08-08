export interface Correction {
  correctionId: number;
  title: string;
  createdAt: string;
  jobTitle: string;
}

export interface CorrectionListResponse {
  isSuccess: boolean;
  error: null;
  result: {
    data: Correction[];
    pageInfo: {
      nextCursor: any;
      hasNextPage: boolean;
    };
  };
}
