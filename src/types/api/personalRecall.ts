export interface PersonalRetro {
  collaborationProfile: string;
  memorableExperience: string;
  strengthsAndGrowth: string;
}

export interface PersonalRetroResponse {
  isSuccess: boolean;
  error: null;
  result: PersonalRetro;
}