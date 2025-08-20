// 공용 axios 인스턴스

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // 쿠키 기반 인증을 위해 필수적인 옵션입니다.
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    // 2xx 범위의 상태 코드는 이 함수를 트리거합니다.
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('401 Unauthorized - 인증이 필요합니다.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
