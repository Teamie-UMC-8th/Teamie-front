import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'teamie-s3.s3.ap-northeast-2.amazonaws.com', // S3 이미지
      'img1.kakaocdn.net', // 카카오 이미지
      'localhost', // 로컬 개발 환경
    ],
  },
};

export default nextConfig;
