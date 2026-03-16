# 우마무스메 육성 기록 앱 - 개발 TODO List

> Electron 기반 데스크탑 앱 / 최대 너비 450px / 로컬 데이터 저장

---

## Phase 1. 프로젝트 초기 세팅

- [ ] **1-1.** Node.js / npm 환경 확인 및 Electron 프로젝트 초기화
  - `npm init` → `package.json` 구성
  - Electron 설치 (`electron`, `electron-builder`)
- [ ] **1-2.** 프로젝트 폴더 구조 설계
  ```
  /
  ├── main.js             # Electron 메인 프로세스
  ├── preload.js          # preload 스크립트 (IPC 브릿지)
  ├── index.html          # 렌더러 진입점
  ├── /renderer           # 렌더러 프로세스 소스
  │   ├── /pages          # 페이지별 컴포넌트
  │   ├── /components     # 공통 컴포넌트
  │   └── app.js          # SPA 라우터
  ├── /data               # 로컬 JSON 데이터 저장 폴더
  │   ├── records.json    # 훈련 실패 기록
  │   ├── racetracks.json # 마장 기록
  │   └── characters.json # 육성 우마무스메 기록
  └── /assets             # 정적 리소스
  ```
- [ ] **1-3.** Bootstrap 5 통합 (CDN 또는 로컬 번들)
- [ ] **1-4.** `main.js` 기본 창 설정
  - `width: 450`, `maxWidth: 450`, `resizable: false` (세로는 자유)
  - `webPreferences`: contextIsolation, preload 설정
- [ ] **1-5.** 로컬 데이터 저장 유틸 모듈 작성
  - `data/store.js`: JSON 파일 read/write 헬퍼 (fs 모듈 기반)
  - IPC 채널 정의: `store:get`, `store:set`, `store:update`, `store:delete`
- [ ] **1-6.** SPA 라우팅 구현 (Hash 기반)
  - 탭 네비게이션: 훈련기록 / 통계 / 마장 / 육성 우마무스메

---

## Phase 2. 공통 컴포넌트

- [ ] **2-1.** 상단 탭 네비게이션 바 컴포넌트
- [ ] **2-2.** 공통 모달 컴포넌트 (Bootstrap Modal 래핑)
- [ ] **2-3.** 공통 테이블 컴포넌트 (Bootstrap Table + 필터 영역)
- [ ] **2-4.** 날짜 포맷 유틸 함수 (`YYYY-MM-DD`, 표시용 포맷 등)
- [ ] **2-5.** Toast / Alert 알림 컴포넌트

---

## Phase 3. 마장 데이터 (Page: 마장)

> 다른 기능의 select 옵션 소스가 되므로 선행 개발

- [ ] **3-1.** gametora 경기장 데이터 수집 및 정리
  - 대상: `https://gametora.com/ko/umamusume/racetracks`
  - 정리 항목: 경기장명 / 마장(잔디·더트) / 거리 / 방향(시계·반시계)
  - `racetracks_static.json`으로 앱 내 번들링
- [ ] **3-2.** 마장 등록 모달 UI 구현
  - [ ] 종류: 챔피언스미팅 / 리그오브히어로즈 (checkbox 단일선택)
  - [ ] 기간: 시작일 ~ 종료일 (date input)
  - [ ] 경기장 select → 선택 시 마장·거리·방향 자동 입력
  - [ ] 마장: 잔디 / 더트 (자동 입력, 수동 변경 가능)
  - [ ] 거리: number input + 거리 구분 자동 표시 (단거리/마일/중거리/장거리)
  - [ ] 방향: 시계 / 반시계 (자동 입력, 수동 변경 가능)
  - [ ] 저장 / 취소 버튼
- [ ] **3-3.** 마장 데이터 테이블 구현
  - 컬럼: 종류 / 경기장 / 기간 / 마장 / 거리 / 방향 / 액션(삭제)
  - 행 클릭 시 수정 모달 열기
- [ ] **3-4.** 마장 IPC 핸들러 연결 (CRUD)

---

## Phase 4. 육성 우마무스메 (Page: 육성 우마무스메)

- [ ] **4-1.** gametora 우마무스메 데이터 수집 및 정리
  - 대상: `https://gametora.com/ko/umamusume/characters`
  - 정리 항목: 이름 / 출시일 / 캐릭터ID (URL 경로용)
  - `characters_static.json`으로 앱 내 번들링
- [ ] **4-2.** 육성 우마무스메 등록 모달 UI 구현
  - [ ] 우마무스메 이름 (characters_static에서 select 또는 검색)
  - [ ] 출시일 (자동 입력 또는 수동 입력)
  - [ ] 저장 / 취소 버튼
- [ ] **4-3.** 육성 우마무스메 테이블 구현
  - 컬럼: 이름 / 출시일 / 링크(외부 브라우저 오픈) / 액션(삭제)
  - 필터: 이름(텍스트 검색) / 출시일(정렬)
  - 링크 클릭: `shell.openExternal()` → gametora 캐릭터 페이지
- [ ] **4-4.** 우마무스메 IPC 핸들러 연결 (CRUD)

---

## Phase 5. 훈련기록 (Page: 훈련기록)

- [ ] **5-1.** 훈련 실패 등록 모달 UI 구현
  - **필터용 (select)**
    - [ ] 대상 마장: Phase 3에서 등록된 마장 목록 → `종류 / 경기장 / 기간 시작일` 포맷
    - [ ] 육성중인 우마무스메: Phase 4에서 등록된 목록
    - 이전 선택값 기억 (마지막 선택값 로컬 저장)
  - **상세 기록**
    - [ ] 육성마 이름 (text input)
    - [ ] 육성 실패 원인 (radio 또는 select로 유형 선택):
      - 훈련실패 → 실패 확률 % 입력 (number input, 0~100)
      - 거리 인자 미획득 (boolean toggle)
      - 육성결과 스킬 미획득 (boolean toggle)
      - 육성결과 스탯 미달 (boolean toggle)
      - 상태이상 → 종류 선택: 땡땡이 기질 / 밤생 상태 / 살찜 주의
      - 시나리오 조건 미달 (boolean toggle)
    - [ ] 등록 시간: 자동 기록 (현재 timestamp)
  - [ ] 저장 / 취소 버튼
- [ ] **5-2.** 훈련기록 테이블 구현
  - 컬럼: 등록시간 / 대상마장 / 육성우마무스메 / 육성마 / 실패원인 / 액션(삭제)
  - 필터: 대상마장 select / 육성우마무스메 select
  - 페이지네이션 또는 스크롤 처리 (데이터 많을 경우)
- [ ] **5-3.** 훈련기록 IPC 핸들러 연결 (CRUD)

---

## Phase 6. 통계 (Page: 통계)

- [ ] **6-1.** 필터 UI 구현
  - 대상마장 select (전체 포함)
  - 육성 우마무스메 select (전체 포함)
- [ ] **6-2.** 실패 원인별 집계 로직 구현
  - 필터 조건에 맞는 records 집계
  - 원인 유형별 카운트: 훈련실패 / 거리인자 / 스킬미획득 / 스탯미달 / 상태이상 / 시나리오조건
- [ ] **6-3.** 차트 대시보드 UI 구현
  - Chart.js (또는 경량 라이브러리) 사용
  - [ ] 실패 원인 분포 도넛/파이 차트
  - [ ] 훈련실패 확률 분포 히스토그램 (훈련실패 건에 한해)
  - [ ] 상태이상 종류별 바 차트
  - [ ] 우마무스메별 실패 횟수 바 차트
- [ ] **6-4.** 필터 변경 시 차트 실시간 업데이트

---

## Phase 7. 마무리 및 배포

- [ ] **7-1.** 전체 UX 검토 및 스타일 다듬기
  - 450px 너비 최적화 확인
  - Bootstrap 반응형 레이아웃 점검
- [ ] **7-2.** 엣지케이스 처리
  - 데이터 없을 때 빈 상태 UI (empty state)
  - 마장/우마무스메 데이터 없을 때 훈련기록 등록 안내
- [ ] **7-3.** 데이터 백업/내보내기 기능 (선택사항)
  - JSON export 버튼
- [ ] **7-4.** `electron-builder` 빌드 설정
  - Windows `.exe` / macOS `.dmg` 패키징 설정
- [ ] **7-5.** 빌드 테스트 및 최종 검수

---

## 개발 순서 요약

```
Phase 1 (세팅)
  → Phase 2 (공통 컴포넌트)
    → Phase 3 (마장)
      → Phase 4 (육성 우마무스메)
        → Phase 5 (훈련기록)       ← Phase 3, 4 데이터 의존
          → Phase 6 (통계)         ← Phase 5 데이터 의존
            → Phase 7 (마무리)
```

> **의존관계 주의**: 마장·우마무스메 데이터가 훈련기록의 select 소스로 사용되므로,  
> Phase 3 → 4 → 5 순서를 반드시 준수할 것.
