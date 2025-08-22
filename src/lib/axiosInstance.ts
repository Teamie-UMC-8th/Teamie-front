// 공용 axios 인스턴스

import axios, { AxiosError } from 'axios';
import { refreshToken } from '../services/auth/refreshToken';
import { queryClient } from './queryClient';
import { ApiErrorResponse } from '@/types/api/error';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // 쿠키 기반 인증을 위해 필수적인 옵션입니다.
  headers: {
    'Content-Type': 'application/json',
  },
});

// 리프레시 토큰 인터셉터 로직
// 재발급 요청이 진행 중인지 여부를 나타내는 플래그
let isRefreshing = false;
// 재발급 중에 실패한 요청들을 저장하는 배열
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    // 2xx 범위의 상태 코드는 이 함수를 트리거합니다.
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // 토큰 재발급 요청 자체에서 에러가 발생한 경우, 재시도 로직을 실행하지 않습니다.
    if (originalRequest?.url === '/auth/refresh') {
      console.error('리프레시 토큰이 만료되었거나 유효하지 않습니다. 로그아웃 처리합니다.');
      return Promise.reject(error);
    }

    // 로그인 페이지나 콜백 페이지에서는 재발급 로직을 실행하지 않습니다.
    if (typeof window !== 'undefined') {
      const { pathname } = window.location;
      if (pathname === '/login' || pathname.includes('/callback')) {
        return Promise.reject(error);
      }
    }

    // 401 에러가 발생했고, 재시도한 요청이 아닐 때만 로직을 실행합니다.
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      // 이미 토큰 재발급이 진행 중이라면, 현재 요청을 큐에 추가합니다.
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      (originalRequest as any)._retry = true;
      isRefreshing = true;

      try {
        // 토큰을 재발급합니다.
        await refreshToken();
        console.log('토큰 재발급 성공. 원래 요청을 재시도합니다.');
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('토큰 재발급 실패:', refreshError);
        processQueue(refreshError as Error);

        // 재발급에 실패하면 캐시를 초기화하고 로그인 페이지로 이동시킵니다.
        queryClient.clear();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else if ((error.response?.data as ApiErrorResponse)?.errorCode === 'PROJECT4031') {
      console.error('PROJECT4031 - 프로젝트 접근 권한이 없습니다. 홈으로 이동합니다.');
      // 홈으로 리다이렉트합니다.
      if (typeof window !== 'undefined') {
        // 임시로 알림창을 띄웁니다.
        alert('잘못된 접근입니다.');
        // 강제로 페이지를 이동시킵니다.
        window.location.replace('/home/tasks');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
