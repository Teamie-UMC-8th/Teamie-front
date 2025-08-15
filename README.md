# Teamie Front

<br>
<br>

![logo](https://github.com/user-attachments/assets/2a0af9d6-6cf3-4474-9f69-6c54c81c7c5d)

<br>
<br>

나의 팀워크가 모이는 곳,
<br>
<br>
**Teamie**의 프론트엔드 레포지토리입니다.

<br>

## 목차

- [주요 기능](#-주요-기능)
- [기술 스택 및 선정 이유](#-기술-스택-및-선정-이유)
- [아키텍처 및 폴더 구조](#-아키텍처-및-폴더-구조)
- [협업 규칙](#-협업-규칙)
- [어려움 및 해결 과정](#-어려움-및-해결-과정)
- [AI 활용 방식](#-ai-활용-방식)

<br>

## 주요 기능

- `통합 대시보드`: 프로젝트의 전체 진행 상황과 나의 업무를 한눈에 파악
- `업무 관리`: 칸반 보드 스타일의 UI로 업무 상태를 직관적으로 관리 및 추적
- `팀 캘린더`: 팀과 개인 일정을 공유·관리하여 효율적 시간 관리
- `회고`: 주기적인 팀 회고를 통해 문제 개선 및 성장 도모
- `AI 포트폴리오 및 첨삭`: 프로젝트 활동 기반으로 AI가 자동 분석한 강점·기여도 포트폴리오 생성

<br>

## 🛠 기술 스택 및 선정 이유

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

- `Next.js (App Router)`: SSR/SSG 등 다양한 렌더링 전략 지원, 성능·SEO 우수. Layout, Route Groups 활용으로 페이지 구조 직관적 관리
- `TypeScript`: 정적 타입으로 안정성 확보, 잠재적 버그 사전 방지, 유지보수성 향상
- `Tailwind CSS`: 유틸리티 우선 접근 방식으로 빠르고 일관된 UI 개발, 커스텀 디자인 시스템 구축 용이

### 상태 관리 & 폼

![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=Zustand&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=for-the-badge&logo=react-hook-form&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3178C6?style=for-the-badge&logo=Zod&logoColor=white)

- `TanStack Query`: 서버 상태(API 데이터) 관리 최적화, 캐싱·동기화·비동기 로직 분리
- `Zustand`: 가벼운 전역 상태 관리, 간결한 API와 최소 Boilerplate
- `React Hook Form & Zod`: 비제어 컴포넌트 기반 폼 관리, 스키마 기반 강력한 유효성 검증

### 개발 환경

![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)

- `ESLint & Prettier`: 코드 스타일 표준화, 오류 예방, 가독성 향상

<br>

## 아키텍처 및 폴더 구조

유지보수성과 확장성을 고려한 **기능 단위(Feature-based) 구조** 채택

```
src
├─ app                                     # Next.js App Router 페이지 구성
│  ├─ (auth)                               # 인증 관련 (공통 레이아웃 없음)
│  │  ├─ callback                          # 소셜 로그인 콜백 처리 페이지
│  │  └─ login                             # 로그인 페이지 (소셜 로그인 UI 포함)
│  ├─ (main)                               # 공통 레이아웃 (Navbar + Sidebar 적용)
│  │  ├─ home                              # 홈 화면
│  │  │  ├─ calendar                       # 나의 캘린더 페이지
│  │  │  └─ tasks                          # 나의 업무 페이지
│  │  ├─ myPage                            # 마이페이지
│  │  │  ├─ addCorrection                  # AI 포트폴리오 첨삭 프로세스
│  │  │  │  ├─ analyzeFin                  # 첨삭 분석 완료 화면
│  │  │  │  ├─ analyzing                   # 첨삭 분석 진행 중 화면
│  │  │  │  ├─ correctionIntro             # 첨삭 기능 소개 페이지
│  │  │  │  └─ projectSelect               # 첨삭 대상 프로젝트 선택 페이지
│  │  │  ├─ aiMasterPortfolio              # AI 마스터 포트폴리오 페이지
│  │  │  │  └─ [portfolioId]               # 마스터 포트폴리오 상세 (동적 라우트)
│  │  │  │      └─ create                  # 마스터 포트폴리오 생성 플로우
│  │  │  │          ├─ ai                  # AI 자동 생성 모드
│  │  │  │          └─ manual              # 수동 작성 모드
│  │  │  └─ tailoredPortfolio              # 맞춤형 포트폴리오 페이지
│  │  │      └─ [correctionId]             # 맞춤형 포트폴리오 상세 (동적 라우트)
│  │  ├─ new                               # 새 프로젝트 관련
│  │  └─ projects                          # 프로젝트 목록
│  │      ├─ join                          # 초대 코드로 프로젝트 참여
│  │      │  └─ [inviteCode]               # 참여 페이지 (동적 라우트)
│  │      └─ [projectId]                   # 프로젝트 상세 (동적 라우트)
│  │          ├─ dashboard                 # 프로젝트 대시보드
│  │          ├─ files                     # 프로젝트 자료실
│  │          ├─ retrospect                # 프로젝트 회고 목록
│  │          │  └─ create                 # 회고 작성 페이지
│  │          ├─ tasks                     # 프로젝트 업무 목록
│  │          │  └─ [taskId]               # 업무 상세 (동적 라우트)
│  │          └─ teamCalendar              # 팀 캘린더
│  │              └─ [planId]              # 특정 일정 상세 (동적 라우트)
│  │                  └─ teamTask          # 일정에 속한 팀 업무 목록
│  └─ fonts                                # 폰트 파일 모음
├─ components                              # 전역 공용 UI 컴포넌트
├─ constants                               # 프로젝트 전역 상수
├─ contexts                                # React Context API 상태 관리
├─ features                                # 기능별 모듈화 코드
│  ├─ aiMasterPortfolio                    # AI 마스터 포트폴리오 기능
│  │  ├─ components                        # 해당 기능 전용 컴포넌트
│  │  │  └─ steps                          # 생성 플로우 단계별 컴포넌트
│  │  └─ hooks                             # 해당 기능 전용 커스텀 훅
│  ├─ boards                               # 대시보드 기능
│  │  ├─ components                        # 대시보드 전용 컴포넌트
│  │  └─ hooks                             # 대시보드 전용 커스텀 훅
│  ├─ correction                           # 포트폴리오 첨삭 기능
│  │  └─ components                        # 첨삭 기능 전용 컴포넌트
│  ├─ myPage                               # 마이페이지 기능
│  │  ├─ components                        # 마이페이지 전용 컴포넌트
│  │  └─ hooks                             # 마이페이지 전용 훅
│  ├─ projectHome                          # 프로젝트 홈 기능
│  │  └─ components                        # 프로젝트 홈 전용 컴포넌트
│  ├─ retrospects                          # 회고 기능
│  │  └─ components                        # 회고 전용 컴포넌트
│  ├─ tasks                                # 업무 기능
│  │  ├─ components                        # 업무 전용 컴포넌트
│  │  └─ hooks                             # 업무 전용 훅
│  ├─ teamCalendar                         # 팀 캘린더 기능
│  │  └─ components                        # 팀 캘린더 전용 컴포넌트
│  └─ teamTask                             # 팀 업무 기능
│      └─ components                       # 팀 업무 전용 컴포넌트
├─ hooks                                   # 전역 공용 커스텀 훅
│  ├─ mutations                            # React Query mutation 훅
│  └─ queries                              # React Query query 훅
│      └─ projects                         # 프로젝트 관련 query 훅
├─ lib                                     # 라이브러리 설정/함수
├─ services                                # API 호출 함수 모음
│  ├─ correction                           # 첨삭 관련 API
│  ├─ dashboard                            # 대시보드 API
│  ├─ masterPortfolio                      # 마스터 포트폴리오 API
│  ├─ personalRecall                       # 개인 회고 API
│  ├─ plans                                # 일정 API
│  ├─ ProjectHome                          # 프로젝트 홈 API
│  ├─ projects                             # 프로젝트 API
│  ├─ steps                                # 플로우 단계 API
│  ├─ taskDetail                           # 업무 상세 API
│  ├─ tasks                                # 업무 API
│  ├─ teamCalendar                         # 팀 캘린더 API
│  └─ user                                 # 사용자 API
├─ store                                   # 전역 상태 관리 (Zustand 등)
├─ styles                                  # 전역 스타일, CSS 파일
├─ types                                   # 전역 타입스크립트 타입 정의
│  └─ api                                  # API 타입 정의
└─ utils                                   # 전역 유틸리티 함수
```

<br>

- `app`: App Router 규칙에 맞춰 페이지·레이아웃 구성, Route Groups 활용
- `features`: 기능별 컴포넌트·API·훅을 통합 관리하여 독립성과 응집도 강화
- `components`: 프로젝트 전역 재사용 원자 단위 UI 컴포넌트

<br>

## 협업 규칙

- `Git Flow`: main → develop → feature/기능명 브랜치 전략
- `Commit Convention`: Conventional Commits 규칙 (feat:, fix:, refactor:, chore: 등)
- `Pull Request`: feature → develop로 PR, 최소 1명 이상 승인 후 머지

<br>

## 어려움 및 해결 과정

- `문제`: 팀원 간 진행 상황 파악과 일정 관리의 어려움
- `해결`: 팀 노션에 개인별 세부 일정 페이지 제작 → 주 단위 태스크 상세화, 예상 소요·진척 기록 → 팀 공유로 투명성·생산성 향상
- `문제`: 태스크 간 공유되는 사항 관리가 어려움
- `해결`: 세부 일정 페이지 내에서 팀원 전달이 필요한 사항 꼼꼼히 작성 후 전달

<br>

[✅ 팀 노션 세부 일정 관리 페이지 링크](https://wooden-bonsai-700.notion.site/Detailed-TODO-23c66be5909b80a6b4d2c27a07ecb856?source=copy_link)

[✅ 팀원 전달 내용 예시 링크](https://wooden-bonsai-700.notion.site/24f66be5909b80e08356d5aadccb74d6?pvs=74)

<br>

## AI 활용 방식

Teamie는 개발 생산성을 높이는 도구이자 서비스의 핵심 가치를 제공하는 주체로서 AI를 활용했습니다.

### 1. 개발 과정에서의 AI 활용

- **보일러플레이트 코드 생성**: 컴포넌트, 훅, 타입 정의 등 반복적인 초기 코드를 자동화하여 개발 시간을 단축했습니다.
- **리팩토링 및 디버깅**: 기존 코드의 가독성 및 성능 개선 방안을 제안받고, 해결하기 어려운 버그에 대한 디버깅 방향을 제시받아 문제 해결 시간을 단축했습니다.

### 2. 서비스 핵심 기능으로서의 AI

Teamie는 사용자에게 독창적인 가치를 제공하기 위해 다음과 같은 AI 기반 기능을 구현했습니다.

- **AI 포트폴리오 자동 생성**: 사용자가 프로젝트에서 수행한 업무, 작성한 회고, 남긴 피드백 등 활동 데이터를 기반으로 설득력 있는 포트폴리오를 자동으로 생성해 줍니다.
- **AI 지원 맞춤 포트폴리오 첨삭**: 기업과 직무 등 지원 상황에 맞추어 마스터 포트폴리오를 강화할 수 있도록 AI가 첨삭을 제공하는 기능입니다.
