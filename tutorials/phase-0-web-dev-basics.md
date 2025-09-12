# 🎯 Phase 0: 웹 개발 기초 준비 (코드 스니펫 관리자 프로젝트)

웹 개발 훈련 계획서를 분석한 결과, Phase 0 단계에서는 본격적인 개발에 앞서 **기초 개념 이해와 개발 환경 구축**이 핵심입니다.

## 🛠️ 1. 개발 환경 설정

### 필수 도구 설치
```bash
# Node.js 설치 (LTS 버전 권장)
# https://nodejs.org에서 다운로드

# Git 설치 
# https://git-scm.com에서 다운로드

# VS Code 설치
# https://code.visualstudio.com에서 다운로드

# VS Code 확장 프로그램 설치
- TypeScript
- Prettier - Code formatter  
- ESLint
- REST Client
- Thunder Client
```

### 기본 프로젝트 구조 이해
```
codevault/
├── docs/                 # 📚 프로젝트 문서
├── src/                  # 💻 소스 코드
│   ├── domain/          # 🎯 핵심 비즈니스 로직
│   ├── application/     # 🔄 애플리케이션 서비스
│   ├── infrastructure/  # 🏗️ 외부 연결 (DB, API 등)
│   └── presentation/    # 🎨 사용자 인터페이스
├── tests/               # 🧪 테스트 코드
└── package.json         # 📦 프로젝트 설정
```

## 🧠 2. 핵심 개념 이해 (초보자 관점)

### 코드 스니펫 관리자란?
> **간단히 말해**: 개발자가 자주 쓰는 코드 조각들을 저장하고, 나중에 쉽게 찾아서 재사용할 수 있는 도구

**실생활 비유**: 
- 요리책의 레시피 모음집과 같음
- 자주 쓰는 코드를 "즐겨찾기" 하는 것
- 개인 코드 도서관 만들기

### Domain Driven Design (DDD) 쉽게 이해하기

**전통적 방식**: 데이터베이스 중심 → "어떤 테이블이 필요할까?"
**DDD 방식**: 비즈니스 중심 → "사용자가 실제로 뭘 하려고 하는가?"

#### 우리 프로젝트의 도메인 모델
```typescript
// 🎯 핵심: "스니펫"이라는 개념
class Snippet {
  - 제목: "React 버튼 컴포넌트"
  - 내용: "실제 코드"
  - 언어: "JavaScript"
  - 태그: ["React", "UI", "컴포넌트"]
  - 작성자: "개발자 정보"
}

// 🏷️ 분류를 위한 "카테고리"
class Category {
  - 이름: "프론트엔드"
  - 설명: "UI 관련 코드들"
}

// 🔍 검색을 위한 "태그"
class Tag {
  - 이름: "React"
  - 사용횟수: 15번
}
```

### 기술 스택 왜 이걸 선택했을까?

**백엔드 (서버)**:
- **Node.js + TypeScript**: JavaScript로 서버를 만들 수 있어서 학습 곡선이 완만
- **PostgreSQL**: 안정적이고 많이 사용되는 데이터베이스
- **Express.js**: Node.js에서 가장 인기 있는 웹 프레임워크

**프론트엔드 (화면)**:
- **React**: 현재 가장 인기 있는 UI 라이브러리
- **TypeScript**: 실수를 미리 잡아주는 타입 시스템
- **Tailwind CSS**: 빠른 스타일링이 가능한 CSS 프레임워크

## 🎯 3. Phase 0 실습 준비 단계

### Step 1: 개념 정리 (1-2일)
```markdown
✅ 해야 할 것들:
□ 웹 개발 전체 흐름 이해
  - 프론트엔드 ↔ 백엔드 ↔ 데이터베이스 관계
  - API가 뭔지, REST가 뭔지 개념 파악
  
□ 우리가 만들 앱 기능 정리
  - 스니펫 저장하기
  - 스니펫 검색하기  
  - 카테고리별로 정리하기
  - 태그로 분류하기

□ 기술 스택 각각이 하는 일 이해
  - React: 사용자가 보는 화면 만들기
  - Node.js: 서버에서 데이터 처리하기
  - PostgreSQL: 데이터 저장하기
```

### Step 2: 개발 환경 구축 (1일)
```bash
# 프로젝트 시작하기
mkdir codevault
cd codevault

# Git 저장소 초기화
git init
git remote add origin [your-repo-url]

# 기본 폴더 구조 만들기
mkdir -p src/{domain,application,infrastructure,presentation}
mkdir -p docs/{architecture,development,testing,deployment}
mkdir tests

# package.json 생성
npm init -y
```

### Step 3: 첫 번째 실습 목표 설정
```markdown
🎯 Phase 0 목표: "Hello CodeVault" 화면 띄우기

최소 목표:
□ 간단한 React 앱 실행하기
□ 기본 HTML 구조 이해하기
□ CSS로 간단한 스타일 적용해보기
□ JavaScript로 버튼 클릭 이벤트 처리하기

확장 목표:
□ TypeScript 기본 문법 익히기  
□ 컴포넌트 개념 이해하기
□ 상태(State) 개념 이해하기
```

### Step 4: 학습 자료 준비
```markdown
📚 추천 순서:
1. HTML/CSS/JavaScript 기초 (1주)
   - MDN Web Docs 기초 튜토리얼
   - 간단한 정적 웹페이지 만들어보기

2. React 기초 (1주)
   - React 공식 튜토리얼
   - Create React App으로 첫 앱 만들기

3. TypeScript 기초 (3-4일)  
   - TypeScript Handbook 기초 부분
   - JavaScript 코드를 TypeScript로 변환해보기

4. Node.js 기초 (3-4일)
   - Node.js 공식 가이드
   - Express.js 기본 서버 만들어보기
```

## 💡 Phase 0 핵심 포인트

### 🎯 **초보자가 집중해야 할 3가지**
1. **개념 이해가 우선**: 코딩하기 전에 "왜 이렇게 하는지" 이해하기
2. **작은 것부터 시작**: 복잡한 기능 말고 "Hello World"부터
3. **실습 중심 학습**: 이론 30% + 실습 70% 비율 유지

### 🚀 **Phase 0 완료 기준**
```markdown
✅ 체크리스트:
□ 개발 도구가 모두 정상 작동함
□ 간단한 웹페이지를 브라우저에서 볼 수 있음  
□ Git으로 코드를 저장하고 관리할 수 있음
□ 코드 스니펫 관리자가 뭔지 설명할 수 있음
□ 다음 단계(Phase 1)에서 뭘 할지 알고 있음
```

### 🎓 **학습 꿀팁**
- **에러를 두려워하지 말기**: 에러는 학습의 기회
- **구글링 스킬 기르기**: "React에서 버튼 만들기" 같은 구체적 검색
- **커뮤니티 활용**: Stack Overflow, 개발자 커뮤니티 적극 활용
- **매일 조금씩**: 하루 1-2시간씩 꾸준히 하는 것이 몰아서 하는 것보다 효과적

Phase 0는 **기초 체력 기르기** 단계입니다. 서두르지 말고 탄탄한 기반을 만드는 데 집중하세요!