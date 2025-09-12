# 🛡️ 초보 개발자를 위한 안전 가이드

## 🚨 Claude Code 안전 장치 활성화됨!

당신의 Claude Code에 **초보자 보호 시스템**이 설정되었습니다. 위험한 명령어를 감지하면 강력한 경고를 표시하고 실행 전 확인을 요청합니다.

## ⚠️ 절대 하면 안 되는 명령어들

### 🔥 치명적 위험 (CRITICAL)
이 명령어들은 **복구 불가능한 데이터 손실**을 일으킬 수 있습니다!

```bash
# 폴더와 모든 내용을 강제 삭제 (Linux/Mac)
rm -rf /path/to/folder

# 디렉토리를 강제로 완전 삭제 (Windows)
rmdir /s /q folder_name

# 파일을 강제로 조용히 삭제 (Windows)
del /f /q filename

# PowerShell로 모든 것을 강제 삭제
Remove-Item -Path "folder" -Recurse -Force

# Git 히스토리 폴더 삭제 → 프로젝트 전체 히스토리 손실!
rm -rf .git

# 디스크 포맷 → 하드드라이브 전체 삭제!
format C:
```

### ⚠️ 위험 (WARNING)
주의해서 사용해야 하는 명령어들:

```bash
# 저장하지 않은 모든 변경사항 영구 손실
git reset --hard HEAD

# 추적되지 않는 모든 파일/폴더 삭제
git clean -fd

# 원격 저장소 히스토리 강제 덮어쓰기
git push --force

# 브랜치 강제 삭제 (병합되지 않은 작업 손실 가능)
git branch -D branch_name

# 테이블의 모든 데이터 삭제
TRUNCATE TABLE table_name

# 데이터베이스 전체 삭제
DROP DATABASE database_name
```

## 🛡️ 안전한 개발을 위한 황금 수칙

### 1. 📥 항상 백업하세요
```bash
# Git으로 코드 백업
git add .
git commit -m "백업: 중요한 작업 전 저장"
git push

# 중요한 파일 복사본 만들기
cp important_file.js important_file.backup.js
```

### 2. 🔍 실행 전 확인하세요
```bash
# 현재 상태 확인
git status
pwd
ls -la

# 삭제하기 전에 목록 먼저 보기
ls folder_to_delete/
git log --oneline  # 삭제할 커밋 확인
```

### 3. 🧪 테스트 환경에서 먼저 시도
```bash
# 별도 브랜치에서 실험
git checkout -b experiment
# 위험한 작업 수행
# 문제없으면 main으로 병합
```

### 4. 🆘 실수했을 때 대처법
```bash
# Git에서 실수한 경우
git reflog  # 최근 작업 히스토리 보기
git reset --hard HEAD@{n}  # n번째 전 상태로 복구

# 파일을 실수로 삭제한 경우
git checkout HEAD -- filename  # Git에서 파일 복구

# 휴지통에서 복구 (Windows)
# 휴지통을 확인하세요 - Shift+Delete가 아니라면 복구 가능!
```

## 💡 초보자를 위한 안전한 명령어들

### 📊 상태 확인 명령어
```bash
# 현재 위치 확인
pwd

# 파일 목록 보기
ls -la        # Linux/Mac
dir           # Windows

# Git 상태 확인
git status
git log --oneline -10

# 디스크 사용량 확인
df -h         # Linux/Mac
dir           # Windows

# 프로세스 확인
ps aux        # Linux/Mac
tasklist      # Windows
```

### 🔧 안전한 파일 작업
```bash
# 파일 복사 (원본 보존)
cp source.js destination.js

# 파일 이동 (이름 변경)
mv oldname.js newname.js

# 빈 파일 생성
touch newfile.js

# 디렉토리 생성
mkdir new_folder

# 파일 내용 보기 (수정 안 함)
cat filename.js
less filename.js
```

### 🌿 안전한 Git 작업
```bash
# 변경사항 확인
git diff
git diff --staged

# 안전한 커밋
git add .
git commit -m "설명적인 메시지"

# 브랜치 작업 (안전함)
git branch new-feature
git checkout new-feature
git checkout -b new-feature  # 위 두 명령을 합친 것

# 안전한 병합
git checkout main
git merge new-feature
```

## 🚨 응급상황 대처법

### 😱 실수로 중요한 파일을 삭제했을 때
1. **당황하지 마세요!**
2. 즉시 작업을 멈추세요
3. Git이 있다면: `git status`로 상태 확인
4. 휴지통 확인 (Windows: Recycle Bin, Mac: Trash)
5. Git 히스토리에서 복구 시도: `git checkout HEAD -- filename`
6. 전문가에게 도움 요청

### 🔥 잘못된 Git 명령을 실행했을 때
```bash
# 최근 Git 작업 히스토리 보기
git reflog

# 특정 시점으로 되돌리기 (조심스럽게!)
git reset --hard HEAD@{2}  # 2단계 전으로

# 브랜치로 백업 만들기
git branch backup-before-fix
```

## 🎯 안전 체크리스트

작업 전 반드시 확인하세요:

```markdown
□ 현재 위치가 올바른 디렉토리인가?
□ 삭제하려는 파일/폴더가 정확한가?
□ 백업이 있는가?
□ 다른 사람과 공유하는 코드인가?
□ 프로덕션 환경인가? (실제 서비스 중인 환경)
□ 복구 방법을 알고 있는가?
```

## 📞 도움이 필요할 때

1. **Claude Code에게 질문하기**: "이 명령어가 안전한가요?"
2. **Stack Overflow 검색**: 구체적인 상황으로 검색
3. **Git 문서**: https://git-scm.com/doc
4. **동료 개발자에게 질문**
5. **회사/팀의 개발 가이드라인 확인**

---

## 💪 기억하세요!

- **실수는 배움의 과정입니다** - 완벽한 개발자는 없어요
- **질문하는 것을 부끄러워하지 마세요** - 모든 전문가도 처음에는 초보였습니다
- **안전이 속도보다 중요합니다** - 천천히 해도 괜찮아요
- **백업은 개발자의 생명보험입니다** - 항상 백업하세요!

이 안전 장치가 여러분의 개발 여정을 보호해드립니다. 안전하고 즐거운 코딩하세요! 🚀