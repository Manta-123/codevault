# VICTORY.md - 성공한 시도들 기록

## 네트워크 에러 해결 성공 (2025-09-20)
**문제**: Junction 앱에서 "Network response was not ok" 에러 발생

**원인 분석**:
1. TypeScript 컴파일 에러: `junction-point.router.ts:30` - "Not all code paths return a value"
2. API 경로 불일치: 클라이언트에서 `/api/junction-point` 호출하지만 서버는 `/api/junction-points`로 라우팅

**해결 방법**:
1. **TypeScript 에러 수정**: POST 라우터 함수에서 모든 코드 경로에 return 추가
   ```typescript
   // 수정 전: 일부 경로에서 return 누락
   // 수정 후: try-catch 구조로 변경하고 모든 경로에 return 추가
   ```

2. **API 경로 일치**: 클라이언트 API 호출 경로 수정
   ```typescript
   // 수정 전: fetch('/api/junction-point')
   // 수정 후: fetch('/api/junction-points')
   ```

3. **포트 충돌 해결**: 기존 실행 중인 프로세스 정리 후 재시작

**결과**: API 호출 성공, 빈 배열 `[]` 응답 확인 완료

**교훈**:
- TypeScript 함수에서 모든 코드 경로가 값을 반환하도록 주의
- API 경로 일치 확인 필수 (서버 라우팅과 클라이언트 호출 경로)
- 포트 충돌 시 기존 프로세스 정리 필요

---

## 파일 작업 성공 방법 (이 방법으로 작성됨!)

### 문제: 파일 편집시 자주 발생하는 에러들
- "File has not been read yet. Read it first before writing to it."
- "File has been unexpectedly modified. Read it again before attempting to write it."
- "String to replace not found in file."

### 성공한 해결 방법

#### 1. 새 파일 생성시
```
Write 도구 직접 사용 (Read 불필요)
```

#### 2. 기존 파일 수정시
```
Read → Edit/MultiEdit 순서 준수
```

#### 3. 빈 파일 처리시
```
파일 삭제 후 Write로 새로 생성
또는 Write로 덮어쓰기
```

#### 4. 파일 상태 확인 필수
```bash
ls -la [파일경로]  # 파일 크기 확인
cat [파일경로]     # 내용 확인
```

### 권장 작업 순서
1. `ls -la`로 파일 존재/크기 확인
2. `cat`으로 내용 확인
3. 새 파일이거나 빈 파일이면 → **Write 사용**
4. 기존 파일이면 → **Read 후 Edit 사용**

---

## matplotlib 한글 폰트 및 npm 권한 문제 해결 성공 (2025-09-23)

### 문제 1: matplotlib 그래프 한글 폰트 표시 오류
**증상**: 그래프 제목에 한글이 빈 사각형으로 표시됨
```
UserWarning: Glyph 51200 (\N{HANGUL SYLLABLE JEO}) missing from font(s) Arial.
```

**원인**: macOS Arial 폰트에서 한글 글리프 누락

**해결 방법**:
1. **한글 폰트 설정 추가**:
   ```python
   plt.rcParams['font.family'] = ['Apple SD Gothic Neo', 'AppleGothic', 'Malgun Gothic', 'DejaVu Sans']
   plt.rcParams['axes.unicode_minus'] = False  # 마이너스 기호 문제 해결
   ```

2. **그래프 제목을 영어로 변경** (완전한 해결):
   - "상위 10개 프로그래밍 언어별 저장소 수" → "Top 10 Programming Languages by Repository Count"
   - "스타 vs 포크 관계" → "Stars vs Forks Relationship"

**결과**: 폰트 경고 없이 깔끔한 시각화 생성 완료

### 문제 2: npm 권한 에러
**증상**:
```
npm error code EACCES
Your cache folder contains root-owned files
sudo chown -R 501:20 "/Users/manta/.npm"
```

**원인**: npm 캐시 디렉토리에 root 소유 파일들이 존재

**해결 방법**:
1. **새로운 캐시 디렉토리 생성**:
   ```bash
   mkdir -p ~/.npm-new
   npm config set cache ~/.npm-new
   ```

2. **확인 및 테스트**:
   ```bash
   npm config get cache  # /Users/manta/.npm-new 확인
   npm install --legacy-peer-deps  # 성공적으로 설치
   ```

**결과**: npm 패키지 설치 및 React 개발 서버 정상 실행

### 교훈
- **matplotlib**: 한글 폰트 문제는 영어 제목 사용이 가장 확실한 해결책
- **npm**: 권한 문제는 새로운 캐시 디렉토리 사용으로 회피 가능
- **캐시 변경**: `npm config set cache [새경로]`로 간단히 해결

