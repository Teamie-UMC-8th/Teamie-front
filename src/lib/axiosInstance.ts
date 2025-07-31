// 공용 axios 인스턴스

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // 쿠키 기반 인증을 위해 필수적인 옵션입니다.
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor - 401 에러(인증 실패) 시 로그인 페이지로 리다이렉트
axiosInstance.interceptors.response.use(
  (response) => {
    // 2xx 범위의 상태 코드는 이 함수를 트리거합니다.
    return response;
  },
  (error) => {
    // 2xx 외의 상태 코드는 이 함수를 트리거합니다.
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      // 현재 요청이 로그인 페이지로 향하는 것을 방지하여 무한 리다이렉트를 막습니다.
      if (window.location.pathname !== '/login') {
        console.error('401 Unauthorized. 로그인 페이지로 이동합니다.');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
