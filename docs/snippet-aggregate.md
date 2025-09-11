# Snippet Aggregate Root

## 목표
이 문서는 `Snippet` 애그리거트 루트의 속성과 책임을 정의합니다.

## 핵심 속성
- **id**: `UUID` - 애그리거트의 고유 식별자. 외부에서는 이 ID를 통해서만 Snippet을 참조할 수 있습니다.
- **title**: `String` - 스니펫의 제목 (이름). 사용자가 스니펫을 쉽게 식별하는 데 사용됩니다.
- **description**: `String` - 스니펫에 대한 상세 설명. 스니펫의 사용법이나 맥락 등을 기록합니다.
- **content**: `String` - 실제 코드 조각. 스니펫의 핵심 데이터입니다.
- **language**: `String` - 프로그래밍 언어 (e.g., "Python", "JavaScript"). 구문 강조 및 검색 필터링에 사용될 값 객체(Value Object)입니다.
- **tags**: `List<String>` - 스니펫을 분류하고 검색하기 위한 키워드 목록. Tag 값 객체의 컬렉션이 될 것입니다.
