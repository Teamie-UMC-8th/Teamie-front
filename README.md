# Teamie Front

<br>
<br>

![logo](https://github.com/user-attachments/assets/2a0af9d6-6cf3-4474-9f69-6c54c81c7c5d)

<br>
<br>

나의 팀워크가 모이는 곳,
<br>
<br>
Teamie의 프론트엔드 레포지토리입니다.

<br>

## 사용 기술

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

### 상태 관리 & 폼

![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=Zustand&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=for-the-badge&logo=react-hook-form&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3178C6?style=for-the-badge&logo=Zod&logoColor=white)

### 개발 환경

![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)

<br>

## 프로젝트 구조

```
src
├─ app
│  ├─ (auth)                          # 인증 관련 (공통 레이아웃 X)
│  │  └─ login                        # 로그인 (소셜 로그인)
│  ├─ (main)                          # 공통 레이아웃 (Navbar + Sidebar)
│  │  ├─ home                         # 홈
│  │  │  ├─ calendar                  # 나의 캘린더
│  │  │  └─ tasks                     # 나의 업무
│  │  ├─ mypage                       # 마이페이지
│  │  │  ├─ aimasterportfolio         # AI 마스터 포트폴리오
│  │  │  └─ aiportfolio               # AI 포트폴리오
│  │  ├─ new                          # 프로젝트 추가
│  │  │  ├─ create                    # 프로젝트 생성
│  │  │  └─ join                      # 프로젝트 참여
│  │  └─ projects                     # 나의 프로젝트
│  │      └─ [projectId]              # 프로젝트 상세 (동적 라우트)
│  │          ├─ calendar             # 팀 캘린더
│  │          ├─ dashboard            # 업무 대시보드
│  │          ├─ files                # 자료실
│  │          ├─ retrospect           # 회고
│  │          └─ tasks                # 업무
│  │              └─ [taskId]         # 업무 상세페이지
│  └─ fonts                           # 폰트 파일
├─ components                         # 공용 컴포넌트
├─ constants                          # 상수
├─ features                           # 기능 모듈
│  └─ boards                          # 대시보드 기능
│      ├─ components                  # 대시보드 관련 컴포넌트
│      └─ hooks                       # 대시보드 관련 커스텀 훅
├─ hooks                              # 커스텀 훅
├─ lib                                # 라이브러리 함수
├─ services                           # API 함수
├─ store                              # 전역 상태관리
├─ styles                             # 스타일, 글로벌 CSS
├─ types                              # 타입스크립트 타입
└─ utils                              # 공용 유틸 함수
```

<br>

## 프로젝트 필수 라이브러리(Dependencies)

### 프레임워크 & 기본

| 라이브러리     | 설명                               |
| -------------- | ---------------------------------- |
| **Next.js**    | React 기반 프레임워크 (App Router) |
| **React**      | UI 라이브러리                      |
| **TypeScript** | 정적 타입 지원 언어                |

<br>

### 스타일링

| 라이브러리       | 설명                         |
| ---------------- | ---------------------------- |
| **Tailwind CSS** | 유틸리티 기반 CSS 프레임워크 |
| **PostCSS**      | CSS 변환 툴                  |
| **Autoprefixer** | CSS 자동 벤더 프리픽스       |

<br>

### 상태 관리 & 비동기 처리

| 라이브러리         | 설명                      |
| ------------------ | ------------------------- |
| **Zustand**        | 전역 상태 관리 라이브러리 |
| **Tanstack Query** | 서버 상태 및 API 캐싱     |

<br>

### 폼 & 유효성 검사

| 라이브러리              | 설명                    |
| ----------------------- | ----------------------- |
| **React Hook Form**     | 폼 상태 관리            |
| **Zod**                 | 스키마 기반 유효성 검사 |
| **@hookform/resolvers** | RHF와 Zod 연결 어댑터   |

<br>

### 코드 스타일링

| 라이브러리                 | 설명                        |
| -------------------------- | --------------------------- |
| **ESLint**                 | 코드 린트                   |
| **eslint-config-prettier** | Prettier와 ESLint 충돌 방지 |
| **Prettier**               | 코드 포매터                 |
