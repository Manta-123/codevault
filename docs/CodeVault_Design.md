# CodeVault 프로젝트 설계

## 프로젝트 개요
- **프로젝트명**: CodeVault
- **목적**: 코드 스니펫 관리 시스템 개발
- **접근 방식**: Domain-Driven Design (DDD) 기반
- **학습 목표**: 전문적인 웹 개발 역량 습득

## 아키텍처 설계
### 계층형 아키텍처
- **Presentation Layer**: FastAPI 엔드포인트 (HTTP 요청/응답 처리)
- **Application Layer**: Use cases (비즈니스 로직 오케스트레이션)
- **Domain Layer**: Entities, Value Objects, Repository 인터페이스 (순수 비즈니스 로직)
- **Infrastructure Layer**: 데이터베이스, 외부 API 구현

### 도메인 모델
- **Snippet Aggregate**: 코드 스니펫의 핵심 엔티티
- **Tag Value Object**: 스니펫 카테고리화
- **Language Value Object**: 프로그래밍 언어
- **Collection Entity**: 스니펫 그룹

## 기술 스택
- **백엔드**: Python 3.11+, FastAPI
- **데이터베이스**: PostgreSQL + SQLAlchemy 2.0
- **테스트**: Pytest
- **배포**: Docker, Docker Compose
- **프론트엔드**: React 18 + TypeScript (추후 구현)

## 개발 단계
1. **Phase 0**: 프로젝트 설정 및 설계
2. **Phase 1**: 코어 도메인 모델링
3. **Phase 2**: 애플리케이션 계층 및 유스케이스
4. **Phase 3**: 인프라 및 영속성
5. **Phase 4**: 프레젠테이션 계층 (API)
6. **Phase 5**: 테스트
7. **Phase 6**: 배포

## 코드 스니펫 저장소
- **저장 위치**: PostgreSQL 데이터베이스
- **접근 방식**: Repository 패턴을 통한 데이터 액세스
- **ORM**: SQLAlchemy 사용

## 주요 원칙
- **DDD 준수**: 모든 결정이 도메인 모델에 기반
- **Clean Architecture**: 계층 간 의존성 분리
- **Type Hints**: 모든 함수에 타입 힌트 필수
- **PEP 8**: Python 코딩 표준 준수

## 파일 구조 (예상)
```
src/
├── domain/
│   ├── entities/
│   ├── value_objects/
│   ├── services/
│   └── repositories/
├── application/
│   ├── services/
│   ├── dto/
│   └── commands/
├── infrastructure/
│   ├── repositories/
│   ├── database/
│   └── external/
└── presentation/
    ├── api/
    ├── middleware/
    └── schemas/
```

*이 설계는 Project Charter와 Training Plan을 기반으로 요약한 내용입니다. 실제 구현 시 세부 사항이 조정될 수 있습니다.*