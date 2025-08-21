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
    } else if (error.response?.data?.error?.errorCode === 'PROJECT4031') {
      console.error('PROJECT4031 - 프로젝트 접근 권한이 없습니다. 홈으로 이동합니다.');
      // 홈으로 리다이렉트
      if (typeof window !== 'undefined') {
        // 임시로 알림창 띄우기
        alert('잘못된 접근입니다.');
        // 강제로 페이지 이동
        window.location.replace('/home/tasks');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
