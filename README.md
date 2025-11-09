# 🎓 SchoolNet Frontend

> 청소년을 위한 안전하고 깨끗한 학교 커뮤니티 플랫폼

[![React](https://img.shields.io/badge/React-18.0-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📖 프로젝트 소개

SchoolNet은 청소년들이 욕설과 부적절한 콘텐츠 없이 **안전하게 소통**할 수 있는 학교 커뮤니티 플랫폼입니다. AI 기반 실시간 필터링과 선배 검토 시스템을 통해 건강한 커뮤니티 문화를 만들어갑니다.

### ✨ 핵심 가치

- 🛡️ **안전 최우선**: AI 기반 실시간 콘텐츠 필터링
- 💬 **학교 커뮤니티**: 후배의 질문, 선배의 답변
- ⭐ **긍정 문화**: 좋은 답변에 대한 보상 시스템
- 🎯 **다양한 게시판**: 잡담, 모임, 족보, 질문

## 🚀 주요 기능

### 1. 청소년 안전 시스템

#### 🤖 실시간 콘텐츠 필터링
- **40+ 욕설/비속어 자동 감지** - 한국어 특화
- **변형 패턴 인식** - 띄어쓰기, 자음만 표기 등
- **문맥 분석** - 괴롭힘, 협박 표현 탐지
- **독성 점수** - 0-100 점수로 위험도 측정
- **500ms 디바운스** - 실시간 검사 최적화

#### 🚨 신고 시스템
- 8가지 신고 사유 (욕설, 괴롭힘, 스팸, 성적 내용 등)
- 상세 설명 추가 가능
- 허위 신고 방지 시스템

#### 🛡️ AI 악플 탐지 대시보드 (선배 전용)
- 의심스러운 댓글 자동 수집
- 위험도 레벨 표시 (높음/중간/낮음)
- 승인/경고/차단 액션
- 실시간 통계 대시보드

### 2. 긍정 보상 시스템

선배들의 좋은 답변을 장려하는 다양한 리액션:

| 리액션 | 설명 | 포인트 |
|--------|------|--------|
| 💡 도움됐어요 | 정말 유익한 정보 | 10pt |
| 💖 친절해요 | 따뜻한 답변 | 5pt |
| ✨ 명쾌해요 | 이해하기 쉬운 설명 | 8pt |
| 🎨 창의적이에요 | 새로운 관점 | 7pt |
| 😄 재미있어요 | 웃으면서 배움 | 5pt |
| 📚 자세해요 | 상세한 설명 | 8pt |

### 3. 4가지 게시판

1. **💭 잡담게시판** - 자유로운 대화
2. **🤝 모임게시판** - 스터디/동아리 모집
3. **📝 족보게시판** - 시험 자료 공유
4. **💬 질문게시판** - 학업 질문 & 답변

### 4. 역할 기반 시스템

- **후배**: 질문 작성, 게시글 작성, 리액션
- **선배**: 답변 전용, 악플 관리, 멘토링

## 🛠️ 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **React Query (TanStack Query)** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **React Router** - 라우팅
- **Axios** - HTTP 클라이언트
- **TypeScript** - 타입 안정성

### UI/UX
- **CSS Modules** - 스타일링
- **Reddit Orange 테마** - 브랜드 컬러
- **반응형 디자인** - 모바일/데스크톱 최적화

### 안전 기능
- **클라이언트 측 필터링** - 실시간 욕설 감지
- **백엔드 API 연동** - AI 악플 탐지
- **낙관적 업데이트** - 빠른 UX

## 📦 설치 및 실행

### 사전 요구사항
- Node.js 18.0 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/ssum21/SchoolNet-frontend.git
cd SchoolNet-frontend

# 의존성 설치
npm install
```

### 환경 변수 설정

`.env` 파일 생성:

```env
VITE_API_BASE_URL=http://your-backend-api-url:8080
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 📂 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Navbar.jsx      # 네비게이션 바
│   ├── ReportButton.jsx # 신고 버튼
│   └── PositiveReactions.jsx # 긍정 리액션
├── pages/              # 페이지 컴포넌트
│   ├── Home.jsx        # 홈페이지
│   ├── QuestionWrite.jsx # 질문 작성
│   └── BadCommentsDashboard.jsx # 악플 대시보드
├── lib/                # 핵심 로직
│   ├── api/           # API 클라이언트
│   │   ├── client.ts  # Axios 인스턴스
│   │   ├── endpoints/ # API 엔드포인트
│   │   └── types.ts   # TypeScript 타입
│   ├── hooks/         # React Query 훅
│   │   ├── useAuth.ts
│   │   ├── usePosts.ts
│   │   └── useComments.ts
│   ├── store/         # Zustand 스토어
│   │   └── auth.ts
│   └── utils/         # 유틸리티
│       └── contentFilter.ts # 콘텐츠 필터링
└── styles/            # CSS 파일
```

## 🔑 주요 기능 사용법

### 실시간 필터링 테스트

게시글 작성 페이지(`/questions/write`)에서:
1. 부적절한 내용 입력 시 자동으로 경고 표시
2. 독성 점수 60점 이상 시 작성 차단
3. 500ms 디바운스로 실시간 검사

### AI 악플 대시보드 접근

선배 계정으로 로그인 후:
1. 네비게이션 바의 "🛡️ 관리" 클릭
2. `/dashboard/bad-comments` 접속
3. 의심스러운 댓글 검토 및 조치

### 긍정 리액션 사용

답변/댓글에서:
1. 도움이 된 답변에 적절한 리액션 선택
2. 작성자는 자동으로 포인트 획득
3. 리액션 통계 확인 가능

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 API 연동

주요 엔드포인트:
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `GET /api/posts` - 게시글 목록
- `GET /api/comments/bad` - 악플 목록 (선배 전용)
