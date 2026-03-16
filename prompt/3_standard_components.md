## 3. 표준 컴포넌트 가이드 (Standard Components)

### 3.1 버튼 (Button)

사용자의 주요 액션을 트리거하는 컴포넌트입니다. 명확한 위계(Hierarchy)를 가지며, 상태에 따른 시각적 피드백을 제공해야 합니다.

#### 3.1.1 Base Style (공통 속성)
>
> **AI Note**: 모든 버튼 컴포넌트는 아래 클래스를 기본으로 포함해야 합니다.

- **Layout**: `inline-flex items-center justify-center gap-2 whitespace-nowrap`
- **Shape**: `rounded-[10px]` (Radius Level 2 표준)
- **Interaction**: `transition-all duration-200 active:scale-[0.98]`
- **Accessibility**: `focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-090 outline-none`
- **Disabled**: `disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100`

#### 3.1.2 Sizes (크기 규격)

- **SM (Small)**: `h-8 (32px)` | `px-3` | `text-xs` | Icon: `w-3.5 h-3.5`
  - *용도: 테이블 내부 액션, 필터, 좁은 영역.*
- **MD (Medium - Default)**: `h-10 (40px)` | `px-4` | `text-sm` | Icon: `w-4.5 h-4.5`
  - *용도: 일반적인 폼 제출, 다이얼로그 액션, 표준 버튼.*
- **LG (Large)**: `h-12 (48px)` | `px-6` | `text-base` | Icon: `w-5 h-5`
  - *용도: 로그인, 주요 CTA, 랜딩 페이지.*
- **Icon Only**: `aspect-square p-0` (예: `h-10 w-10`)
  - *주의: 반드시 `aria-label`을 포함해야 합니다.*

#### 3.1.3 Variants (스타일 변형)

- **Primary (Brand)**: `bg-primary-500 text-white hover:bg-primary-600 shadow-sm`
  - *용도: 페이지 내 가장 중요한 단일 액션 (저장, 완료).*
- **Secondary (Blue)**: `bg-secondary-500 text-white hover:bg-secondary-600 shadow-sm`
  - *용도: Primary와 구분되는 보조적 중요 액션 (링크 이동, 정보 확인).*
- **Solid (Neutral)**: `bg-gray-080 text-white hover:bg-gray-090 shadow-sm`
  - *용도: 일반적인 중요 액션 (확인, 등록).*
- **Outline (Bordered)**: `border border-gray-020 bg-white text-gray-080 hover:bg-gray-005`
  - *용도: 2순위 액션 (취소, 이전, 필터).*
- **Ghost (Text Only)**: `bg-transparent text-gray-070 hover:bg-gray-010 hover:text-gray-090`
  - *용도: 3순위 액션, 아이콘 버튼, 툴바.*
- **Destructive (Danger)**: `bg-red-500 text-white hover:bg-red-600 shadow-sm`
  - *용도: 삭제, 탈퇴, 되돌릴 수 없는 위험한 액션.*

#### 3.1.4 Usage Rules (사용 규칙)

- **Hierarchy**: 한 화면에 `Primary` 버튼은 1~2개로 제한하고, 나머지는 `Outline`이나 `Ghost`를 사용하여 시각적 소음을 줄이십시오.
- **Width**: 기본적으로 콘텐츠 너비(`w-auto`)를 따르되, 모바일 하단 고정 버튼 등 필요 시 `w-full`을 적용합니다.
- **Loading State**: 로딩 중일 때는 `disabled` 상태와 동일한 스타일을 적용하되, 텍스트 대신 또는 텍스트 좌측에 **Spinner**를 표시하고 클릭을 방지해야 합니다.

### 3.2 입력 폼 (Forms)

#### 3.2.1 General Input Styles

- **Label**: `text-sm`, `font-bold`, `text-gray-070`, `mb-2`, `block`.
  - **Required**: 필수 항목은 라벨 우측에 `text-red-500` 색상의 `*` 마크를 표시합니다.
  - **Association**: `label`의 `htmlFor` 속성과 `input`의 `id`가 반드시 일치해야 합니다.
- **Standard Input/Select**: `h-[42px]`, `bg-white`, `border-gray-020`, `rounded-[10px]`, `text-base md:text-sm`, `px-4`, `w-full`, `transition-colors`.
  - **Background**: 모든 입력 폼(Input, Select)은 기본적으로 **흰색 배경(`bg-white`)**을 가져야 합니다. (단, 디자인상 명시적으로 다른 배경색을 지정한 경우는 제외)
  - **Font Size (Mobile Optimization)**: 모바일 환경(iOS)에서 입력 필드 포커스 시 자동 확대(Zoom-in)를 방지하기 위해, 모바일에서는 `text-base` (16px)를 사용하고 데스크탑(`md` 이상)에서 `text-sm` (14px)로 전환하는 반응형 스타일(`text-base md:text-sm`)을 필수적으로 적용해야 합니다.
  - **Placeholder**: `text-gray-040`.
  - **Custom Select**: `appearance-none` 적용 후 우측에 `ChevronDown` 아이콘 배치 (`pr-10`).
- **Pagination Select**:
  - 데이터 테이블 페이지네이션 등에서 사용되는 간소화된 Select 스타일입니다.
  - **Style**: `bg-transparent`, `text-[13px]`, `font-medium`, `text-gray-070`, `border-none`, `focus:ring-0`, `cursor-pointer`.
- **Textarea**:
  - 기본 Input 스타일을 상속하되, `py-3` 패딩을 적용하고 `min-h-[120px]` 높이를 확보합니다.
  - `resize-none`을 적용하여 레이아웃 파손을 방지합니다.
- **Search Input**:
  - 좌측에 검색 아이콘(`Search`, `text-gray-040`)을 포함하며, `pl-10` 패딩으로 텍스트 겹침을 방지합니다.
- **States**:
  - **Focus**: `focus:border-gray-090`, `focus:ring-1`, `focus:ring-gray-090`, `outline-none`.
  - **Error**: `border-red-500`, `focus:border-red-500`, `focus:ring-red-500`.
  - **Disabled**: `bg-gray-005`, `text-gray-050`, `cursor-not-allowed`.

#### 3.2.2 Accessibility (A11y)

- **Font Size & Zoom Prevention**:
  - **Minimum Size**: 본문 텍스트는 가독성을 위해 최소 `14px` 이상을 유지해야 합니다.
  - **Input Zoom**: 모바일 기기(특히 iOS)에서 `font-size`가 `16px` 미만인 입력 필드에 포커스하면 화면이 강제로 확대되는 현상이 발생합니다. 이를 방지하기 위해 입력 필드(`input`, `select`, `textarea`)에는 반드시 `text-base` (16px) 이상을 적용하거나, 반응형 유틸리티(`text-base md:text-sm`)를 사용해야 합니다.
- **Keyboard Support**: 모든 입력 폼(Date, Time, Select 포함)은 키보드(`Tab`, `Space`, `Enter`, `Arrow Keys`)로 접근 및 조작이 가능해야 합니다.
- **Focus Indicator**: 마우스가 아닌 키보드로 포커스 진입 시, 브라우저 기본 스타일을 제거하고 디자인 시스템의 Focus Ring(`focus:ring-gray-090`)을 명확하게 표시해야 합니다.
- **ARIA Attributes**:
  - **Error**: 유효성 검사 실패 시 `aria-invalid="true"`를 설정하고, 에러 메시지 요소의 ID를 `aria-errormessage` 또는 `aria-describedby`로 연결해야 합니다.
  - **Description**: 도움말 텍스트가 있는 경우 `aria-describedby`로 연결합니다.
- **Autocomplete**: 목적에 맞는 `autocomplete` 속성(e.g., `email`, `username`, `new-password`)을 명시하여 브라우저 자동 완성을 지원합니다.

#### 3.2.3 Helper Text & Validation

- **Helper Text**:
  - **Description**: `mt-1.5`, `text-xs`, `text-gray-050`.
  - **Error Message**: `mt-1.5`, `text-xs`, `text-red-500`, `font-medium`.
  - **Character Count**: 입력 필드 우측 하단에 `(current/max)` 형태로 배치합니다. `text-xs`, `text-gray-050`.
- **Validation UI (Password)**:
  - 비밀번호 입력 시 **반드시 실시간 유효성 검사 로직(JS)**을 적용하여 조건을 보여주는 UI를 제공해야 합니다.
  - **Conditions**: 영문 대소문자, 숫자, 특수문자 포함, 8자 이상.
  - **Layout**: 모든 조건 항목은 **한 줄(Single Line)**로 나열되어야 하며, `flex flex-wrap gap-3` 등을 사용하여 공간 효율성을 높입니다.
  - **Icons**:
    - **Default/Invalid**: `Check` (Material Symbol `check`) 아이콘, `text-gray-040`. (원형 배경 없음)
    - **Valid**: `Check` (Material Symbol `check`) 아이콘, `text-green-500`. (원형 배경 없음)
  - **UI**: 입력 필드 하단에 조건 목록을 표시하고, 충족 시 아이콘과 텍스트 색상(`text-green-500`)을 변경하여 피드백을 줍니다.

#### 3.2.4 Specialized Inputs

- **ID Duplicate Check**: 입력 필드 우측에 '중복확인' 버튼(`Outline` 스타일, `h-[42px]`)을 배치합니다. (`flex gap-2`)
  - **Feedback**: 중복 확인 결과에 따라 입력 필드의 상태와 Helper Text를 변경합니다.
    - **Success**: Helper Text `text-green-500` (예: "사용 가능한 아이디입니다."). 입력 필드는 기본 상태 유지.
    - **Failure**: Helper Text `text-red-500` (예: "이미 사용 중인 아이디입니다."). **입력 필드는 반드시 `Error` 상태(`border-red-500`, `focus:ring-red-500`)를 적용해야 합니다.**
- **Email Input**: 이메일 형식을 검증하며, 필요 시 도메인 선택 드롭다운을 함께 제공할 수 있습니다.
  - **Structure**: `[ID Input] @ [Domain Select]` 형태.
  - **Layout**: `flex` 컨테이너 내부에 배치하되, 각 입력 요소(`input`, `select`)는 반드시 `div` 래퍼로 감싸서 `flex` 속성(`flex-1`)을 적용해야 합니다. 이는 `input`이나 `select`가 `flex` 아이템으로 직접 배치될 때 발생할 수 있는 너비 계산 오류를 방지하기 위함입니다.
- **Phone Number**: 숫자만 입력 가능하며, 3개의 입력 필드로 분리하여 제공하는 것을 권장합니다.
  - **Structure**: `[입력] - [입력] - [입력]` 형태. (첫 번째 필드도 Select가 아닌 Input 사용 가능)
  - **Layout**: 이메일 입력과 마찬가지로 각 `input` 요소를 `div` 래퍼로 감싸서 `flex-1`을 적용하여 균등한 너비를 보장해야 합니다.
  - **Auto-focus**: 각 필드에 설정된 최대 길이(3자리 또는 4자리)를 충족하면 자동으로 다음 필드로 포커스가 이동해야 합니다.

#### 3.2.5 Custom Date Input

날짜 입력을 위해 커스텀 달력(DatePicker) 컴포넌트를 필수적으로 사용합니다.

> **Implementation Logic (구현 로직)**
>
> **CRITICAL**: 본 컴포넌트의 팝오버(달력)는 **3.12 버블 및 드롭다운**의 **Implementation Logic** (Portal, Auto-Flip, Click Outside) 및 **Container Style** 규칙을 **반드시 준수**해야 합니다. 아래 내용은 DatePicker 특화 로직이며, 기본 동작은 3.12 섹션을 따릅니다.
>
> - **State Management**: `view` ('day' | 'year'), `displayDate` (Date Object), `selectedDate` (String) 상태를 관리합니다.
> - **Event Listeners**:
>   - `resize` (window): 브라우저 크기 변경 시 Flip 여부를 재계산합니다.
>   - `click` (document): 팝오버 외부 클릭 시 닫습니다.
>   - **Scroll Listener (Conditional)**: DOM Hierarchy 모드에서는 스크롤 이벤트를 사용하지 않으나, **Portal 모드(Fallback)**에서는 `scroll` 이벤트를 등록하여 위치를 갱신해야 합니다.
> - **Positioning Algorithm (Absolute-based Decision)**:
>   - 팝오버가 열리는 순간(`onOpen`), 트리거의 **화면 상 절대 위치(`getBoundingClientRect`)**를 계산하여 팝오버의 표시 방향(위/아래)을 결정합니다.
>   - **Flip**: 화면 하단 공간이 부족한 경우(`triggerBottom + popoverHeight > viewportHeight`), 팝오버를 트리거의 위쪽(`bottom: 100%`)으로 배치합니다. 기본은 아래쪽(`top: 100%`)입니다.
>   - **Shift**: 좌우 공간 부족 시 `left/right` 스타일을 조정하여 화면 내로 보정합니다.
> - **Calendar Logic (달력 생성 알고리즘)**:
>   - **Date Calculation**: `new Date(year, month, 1)`을 사용하여 해당 월의 1일 요일(`getDay()`)과 마지막 날짜(`getDate()`)를 계산합니다.
>   - **Padding Days**: 1일이 일요일(0)이 아닌 경우, 이전 달의 마지막 날짜들을 계산하여 앞쪽 빈 칸을 채웁니다. (달력은 항상 일요일부터 시작)
>   - **Leap Year**: 2월의 마지막 날짜 계산 시 윤년(`(year % 4 === 0 && year % 100 !== 0) || year % 400 === 0`)을 반드시 고려해야 합니다.
>   - **Formatting**: 날짜 선택 시 `YYYY-MM-DD` 형식의 문자열로 변환하여 `onChange` 이벤트를 발생시킵니다.

- **동작**: 입력 필드 클릭 시 팝오버로 나타나며, 월 이동(Chevron) 및 연도 선택 모드(Grid)를 제공합니다.
- **Focus Management**: 입력 필드는 키보드 포커스 시 `focus:border-gray-090 focus:ring-1 focus:ring-gray-090` 스타일을 적용하여 표준 입력 필드와 동일한 시각적 피드백을 제공해야 합니다.
- **Keyboard Interaction**: 트리거 요소는 반드시 `<input>` 태그(또는 그에 준하는 편집 가능 요소)여야 하며, 포커스 시 즉시 키보드 입력이 가능해야 합니다.
- **Overflow Handling (Layering Strategy)**:
  - **Hybrid Strategy**:
    - **Default (DOM Hierarchy)**: 기본적으로 **입력 필드 컨테이너의 직계 자식**으로 렌더링하여 스크롤 시 떨림(Jitter) 없이 부모를 따라가도록 합니다.
    - **Fallback (Portal)**: 부모 컨테이너의 `overflow` 속성으로 인해 팝오버가 잘리는 경우(Clipping), **Body Level Rendering (Portal)**으로 전환하여 시각적 무결성을 보장해야 합니다.
  - **Event Handling (Conditional)**:
    - **DOM Hierarchy 모드**: 스크롤 이벤트 리스너를 등록하지 않습니다. (CSS 흐름 따름)
    - **Portal 모드**: `scroll` (window/container) 및 `resize` 이벤트를 등록하여 `updatePosition`을 실시간으로 호출해야 합니다.
  - **Smart Positioning (Flip & Collision)**:
    - 두 모드 모두 `getBoundingClientRect()`를 사용하여 화면 절대 좌표를 기준으로 **Flip(상하 반전)** 및 **Shift(좌우 보정)**를 수행해야 합니다.
- **Calendar UI 상세**:
  - **Design**: `gray-000 배경, rounded-2xl, shadow-card, border-gray-010` 규격을 따릅니다.
  - **Header**: `YYYY년 M월` (Bold, `text-lg`), 좌우 화살표 아이콘 (`ChevronLeft`, `ChevronRight`).
  - **Year Selection**: 헤더의 '년도' 영역 클릭 시 연도 선택 그리드(Year Grid)로 전환되어야 합니다. 12개 연도(3x4 Grid)를 한 페이지에 표시하며, 헤더의 좌우 화살표를 통해 12년 단위로 이동할 수 있어야 합니다. 연도 선택 시 달력이 닫히지 않고 월 선택 화면으로 돌아와야 합니다. (이벤트 전파 방지 `stopPropagation` 필수 적용)
  - **Weekdays**: 일~토 순서. `text-xs`, `font-medium`, `text-gray-050`. 일요일은 `text-red-500`.
  - **Days Grid**: 7컬럼 Grid.
  - **Day Item**:
    - `w-9 h-9` 원형.
    - **Selected**: `bg-primary-500 text-white shadow-md`.
    - **Today**: `text-primary-600 bg-primary-50` (선택되지 않았을 때).
    - **Default**: `text-gray-080 hover:bg-gray-005`.
- **Accessibility**:
  - **Keyboard Navigation**: 달력 내 날짜 이동은 화살표 키(`Up`, `Down`, `Left`, `Right`)로 가능해야 하며, `Enter` 또는 `Space`로 선택합니다.
  - **ARIA Attributes**:
    - 팝오버 컨테이너: `role="dialog"`, `aria-modal="true"`, `aria-label="날짜 선택"`.
    - 날짜 그리드: `role="grid"`.
    - 날짜 셀: `role="gridcell"`, `aria-selected="true/false"`, `aria-label="YYYY년 M월 D일"`.
    - 현재 날짜: `aria-current="date"`.

#### 3.2.6 Custom Time Input

단일 시간 또는 시작/종료 시간 세트 구성을 지원합니다.

> **Implementation Logic (구현 로직)**
>
> **CRITICAL**: 본 컴포넌트의 팝오버(시간 선택기)는 **3.12 버블 및 드롭다운**의 **Implementation Logic** (Portal, Auto-Flip, Click Outside) 및 **Container Style** 규칙을 **반드시 준수**해야 합니다. 아래 내용은 TimePicker 특화 로직이며, 기본 동작은 3.12 섹션을 따릅니다.
>
> - **State Management**: `meridiem` ('AM' | 'PM'), `hour` (String '01'~'12'), `minute` (String '00'~'59') 상태를 분리하여 관리합니다.
> - **Validation**:
>   - **Hour**: 입력값이 1~12 범위를 벗어나면 자동으로 보정합니다. (예: 13 -> 12, 0 -> 12)
>   - **Minute**: 0~59 범위를 벗어나면 보정합니다. (예: 60 -> 00)
>   - **Formatting**: 한 자리 숫자 입력 시 `blur` 이벤트에서 자동으로 `0`을 패딩합니다. (예: 1 -> 01)
> - **Scroll Handler**:
>   - **Event Handling**: 스크롤 이벤트(`wheel`) 발생 시 반드시 `e.preventDefault()`를 호출하여, 값 변경 시 부모 컨테이너나 페이지가 함께 스크롤되는 현상을 방지해야 합니다.
>   - `deltaY`가 음수면 값 증가, 양수면 값 감소.
>   - **Hour**: 12에서 증가 시 1, 1에서 감소 시 12로 순환(Loop)합니다.
>   - **Minute**: 59에서 증가 시 00, 00에서 감소 시 59로 순환합니다. (시간 단위에는 영향을 주지 않음)

- **Range Selection**: 시작 시간과 종료 시간을 함께 선택하는 경우, 두 개의 입력 필드를 나란히 배치하고 중간에 `~` 구분자를 둡니다.
- **Interaction**: 드롭다운 내에서 마우스 휠 스크롤 및 키보드 방향키(`Up`/`Down`)로 시간을 조절할 수 있어야 합니다.
- **디자인**: 좌측에 시계 아이콘(`Clock`)을 배치하며, `h-[42px]`, `rounded-[10px]` 규격을 유지합니다. 시간 범위 선택 시 중간에 `~` 기호를 배치합니다.
- **Placeholder**: 시작 시간은 "시작 시간", 종료 시간은 "종료 시간"으로 한글 플레이스홀더를 적용합니다.
- **Sizing**: 시작 시간(아이콘 포함)과 종료 시간(텍스트만)의 **텍스트 영역 너비**가 시각적으로 동일해 보이도록, 시작 시간 컨테이너를 더 넓게 배분합니다. (예: 아이콘 공간이 24px일 때, 시작 시간 `w-[calc(50%+12px)]`, 종료 시간 `w-[calc(50%-12px)]` 적용)
- **Alignment**: 시작 시간 텍스트는 컨테이너 내에서 **중앙 정렬**(`justify-center`)되어야 합니다.
- **동작**: 클릭 시 시간 선택 팝오버(Time Picker)가 나타나야 하며, 시(HH)와 분(MM)을 각각 조절할 수 있는 스테퍼(Stepper) UI를 제공합니다.
- **Time Picker UI 상세**:
  - **Structure**: `오전/오후 HH : MM` 구조로 배치합니다. (한국어 표기, AM/PM 선택 버튼이 가장 좌측에 위치)
  - **Default Value**: 값이 없는 상태에서 팝오버를 열 경우, 기본값은 `오전 12:00`으로 설정됩니다.
  - **Interaction**:
    - **Keyboard Entry**: 시(HH)와 분(MM)은 반드시 `<input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2">` 요소를 사용하여 모바일 키패드 및 키보드 입력을 완벽히 지원해야 합니다.
    - **Arrow Keys**: 입력 필드 포커스 상태에서 키보드 방향키(`Up`, `Down`) 입력 시 값이 증감되어야 합니다.
    - **Mouse Scroll**: 시(HH) 또는 분(MM) 입력 필드 영역에 마우스 오버(Hover) 시, **휠 스크롤(Wheel Scroll)**을 통해 값을 증감할 수 있어야 합니다. **CRITICAL**: 이때 반드시 `e.preventDefault()`와 `e.stopPropagation()`을 사용하여 부모 요소나 페이지 전체의 스크롤이 같이 동작하는 것을 **완벽하게 차단**해야 합니다.
    - **AM/PM Toggle**: 오전/오후 선택은 드롭다운이 아닌 **토글 버튼(Toggle Button)** 방식을 사용하여 클릭 시 즉시 전환되도록 합니다.
    - **Focus Management**:
      - 시(HH) 입력 후 2자리가 채워지면 자동으로 분(MM) 입력 필드로 포커스가 이동해야 합니다.
      - 시작 시간 팝오버가 열린 상태에서 종료 시간 트리거를 클릭하면, 즉시 시작 시간 팝오버가 닫히고 종료 시간 팝오버가 열려야 합니다. (닫힘 애니메이션 없이 즉각 전환)
    - **Visual Focus**: 모든 입력 필드(트리거 및 팝오버 내부)는 포커스 시 `focus:border-gray-090 focus:ring-1 focus:ring-gray-090` 효과를 적용하여 표준 입력 필드와 동일한 시각적 피드백을 제공해야 합니다.
    - **Tab Navigation**: 시작 시간 입력 후 `Tab` 키 입력 시, 팝오버가 닫히고 즉시 **종료 시간** 입력 필드로 포커스가 이동하며 편집 모드가 활성화되어야 합니다.
  - **Validation**:
    - 입력된 값이 유효 범위를 벗어날 경우 자동으로 보정합니다. (예: 분 입력 시 75 -> 59, 시 입력 시 13 -> 12)
    - 한 자리 숫자 입력 시 `blur` 이벤트 발생 시점에 앞에 `0`을 채워줍니다. (예: 9 -> 09)
  - **Style**: 숫자 입력 필드는 `bg-gray-005` 박스 스타일을 가지며, 포커스 시 `focus:border-gray-090 focus:ring-1 focus:ring-gray-090` 효과를 적용합니다. AM/PM 버튼은 `bg-gray-090` (Dark) 스타일을 적용하며, **높이(Height)는 시간 입력 필드와 동일하게 설정**하여 시각적 균형을 맞춥니다.
- **Overflow Handling**: DatePicker와 동일한 **Hybrid Strategy (Hierarchy + Portal)**를 적용합니다. 기본적으로 자식으로 렌더링하되, 잘림 발생 시 Portal로 전환하고 위치 갱신 이벤트를 활성화합니다.
- **Accessibility**:
  - 팝오버 컨테이너는 `role="dialog"`, `aria-modal="true"`, `aria-label="시간 선택"` 속성을 가집니다.
  - 각 입력 필드는 `aria-label="시"`, `aria-label="분"`을 명시하여 스크린 리더가 용도를 식별할 수 있게 합니다.

### 3.3 표준 모달 (Standard Modal)

#### 3.3.1 Implementation Logic (구현 로직)
>
> **AI Note**: 모달은 반드시 Portal을 사용하여 렌더링해야 하며, 스크롤 잠금 및 포커스 트랩을 완벽하게 구현해야 합니다.

- **Portal Rendering**: `createPortal` (React) 또는 `document.body.appendChild` (Vanilla)를 사용하여 `document.body` 레벨에 렌더링해야 합니다.
- **Scroll Lock**:
  - 모달이 열릴 때(`open` state) `document.body.style.overflow = 'hidden'`을 설정하고, 닫힐 때(`cleanup`) 해제합니다. (React: `useEffect`, Vanilla: `Observer` or Event Handler)
- **Focus Trap**:
  - 모달이 열리면 첫 번째 포커스 가능한 요소(또는 닫기 버튼)로 포커스를 이동시킵니다.
  - `Tab` 키 이동 시 모달 내부를 순환해야 하며, 외부로 포커스가 나가지 않도록 합니다.
- **Close Interactions**:
  - `Escape` 키 누름 감지 (`keydown` 이벤트).
  - Overlay(Backdrop) 클릭 감지.

#### 3.3.2 Style & Structure

- **Overlay**: `fixed inset-0 z-[100]`, `bg-black/40`, `backdrop-blur-sm`.
  - **Animation**: `data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`.
- **Container**: `fixed left-1/2 top-1/2 z-[101]`, `w-full`, `-translate-x-1/2 -translate-y-1/2`, `bg-white`, `shadow-lg`, `rounded-2xl`, `border border-gray-020`.
  - **Positioning**: 화면 중앙 정렬을 위해 `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2` 클래스를 사용하며, **애니메이션(`zoom-in` 등)이 `transform` 속성을 덮어쓰지 않도록 주의**해야 합니다. 필요 시 애니메이션을 내부 컨테이너에 적용하거나, `transform`을 포함한 키프레임을 사용하십시오.
  - **Animation**: `duration-200`, `data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95`.
- **Structure**:
  - **Header**: `flex items-center justify-between`, `px-6 py-4`, `border-b border-gray-020`, `bg-gray-005`, `rounded-t-16px`.
    - **Title**: `text-lg`, `font-bold`, `text-gray-090`.
    - **Close Button**: `text-gray-040 hover:text-gray-080`, `transition-colors`. (`X` 아이콘 사용)
  - **Body**: `p-6`, `overflow-y-auto`, `max-h-[calc(100vh-200px)]`. 폼 요소 간 `space-y-6` 적용.
  - **Footer**: `flex justify-end gap-3`, `px-6 pb-6`, `pt-2`. (필요 시 상단 경계선 추가 가능).

#### 3.3.3 Sizes (Max Width)

- **SM (Alert/Confirm)**: `max-w-[400px]`. (단순 메시지나 확인 창은 **3.8 알럿 (Alert Dialog)** 규칙을 우선 적용합니다.)
- **MD (Default)**: `max-w-[540px]`.
- **LG (Form/Grid)**: `max-w-[800px]`.
- **XL (Complex)**: `max-w-[1024px]` 또는 `w-[90vw]`.

#### 3.3.4 Accessibility (A11y)

- **Role & Label**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"` 속성을 필수적으로 포함합니다.
- **Focus Trap**: 모달이 열릴 때 포커스를 내부로 가두어야 합니다.
- **Escape**: `Esc` 키 입력 시 모달이 닫혀야 합니다.
- **Outside Click**: 오버레이 클릭 시 모달이 닫혀야 합니다.

### 3.4 데이터 테이블 (Data Table)

> **Critical Warning**: 데이터 테이블은 업데이트 누락이 빈번한 컴포넌트입니다. 컴포넌트 수정 시 데이터 테이블도 같이 검수하고, 수정된 컴포넌트가 포함되었을 시 반드시 **기존 스타일을 완전히 제거**하고 아래 규칙을 **처음부터 다시 적용**하십시오. 부분 수정은 엄격히 금지됩니다.

#### 3.4.1 Implementation Logic (구현 로직)

- **Selection State**:
  - `selectedIds` (Set 또는 Array) 상태를 관리합니다.
  - **Select All**: 현재 페이지의 모든 ID가 `selectedIds`에 포함되어 있는지 확인하여 체크박스 상태(`checked`, `indeterminate`)를 결정합니다.
- **Pagination Logic**:
  - `currentPage`, `itemsPerPage`, `totalItems` 상태를 기반으로 `totalPages`를 계산합니다.
  - 페이지 변경 시 데이터를 새로 불러오거나(Server-side), 데이터를 슬라이싱(Client-side)합니다.
- **Row Action Menu**:
  - `activeRowId` 상태를 사용하여 한 번에 하나의 메뉴만 열리도록 제어합니다.
  - 메뉴가 열릴 때 `stopPropagation`을 사용하여 행 클릭 이벤트와 충돌하지 않도록 합니다.

#### 3.4.2 Structure & Style

- **Grouping**: 데이터 테이블과 페이지네이션(Pagination)은 반드시 **동일한 부모 컨테이너(Group)** 내에 배치되어 시각적/구조적으로 하나의 단위로 인식되어야 합니다.
- **Container**: `w-full`, `overflow-hidden`, `rounded-2xl`, `border border-gray-020`.
- **Table Top Header**: 테이블 상단에 위치하며 제목과 액션 버튼을 포함합니다.
  - **Container**: `p-6 pb-3`, `border-b border-gray-010`, `flex justify-between items-center`.
  - **Title**: `text-xl`, `font-bold`, `text-gray-090`.
  - **Actions**: `flex gap-2`.
    - **Button**: `h-[32px]`, `px-3`, `rounded-lg`, `text-[13px]`, `font-bold`, `flex items-center gap-2`.
- **Header (`thead`)**: `bg-gray-005`, `h-[50px]`, `border-b border-gray-020`.
  - **Text**: `text-xs`, `font-bold`, `text-gray-070`, `uppercase`, `tracking-wider`.
  - **Alignment**: 기본적으로 `text-left`를 유지하되, 숫자 데이터는 `text-right`, 액션 컬럼은 `text-center`를 적용합니다.
- **Row (`tr`)**: `border-b border-gray-020 last:border-0`, `hover:bg-gray-005`, `transition-colors`.
- **Cell (`td`)**: `px-6 py-4`, `text-sm`, `whitespace-nowrap`.
  - **Primary Data**: `font-medium text-gray-090`.
  - **Secondary Data**: `text-gray-060`.
- **States**:
  - **Empty**: 데이터가 없을 경우 `h-[300px]` 이상의 영역을 확보하고, 중앙에 아이콘과 안내 문구(`text-gray-050`)를 배치합니다.
  - **Loading**: 스켈레톤 UI(`animate-pulse bg-gray-010`)를 사용하여 데이터 로딩 중임을 시각적으로 전달합니다.

#### 3.4.3 Selection & Actions

- **Selection**:
  - 첫 번째 컬럼에 체크박스를 배치할 경우, `w-[48px]` 고정 너비를 할당하고 중앙 정렬합니다.
  - **Checkbox Style (CRITICAL)**: 브라우저 기본 `<input type="checkbox">`를 그대로 노출하는 것은 **엄격히 금지**됩니다. 반드시 **3.7 체크박스** 섹션에 정의된 커스텀 스타일(숨겨진 Input + 스타일링된 Div + SVG 아이콘)을 적용해야 합니다.
  - 선택된 행은 `bg-gray-005` 배경색을 적용하여 시각적 피드백을 제공합니다. (기존 `bg-primary-50`은 배지 색상과 충돌하여 변경됨)
- **Row Action Menu**: 각 행의 우측 끝에 위치한 '더보기' 버튼(`more-horizontal`) 클릭 시 나타나는 메뉴는 **3.12 버블 및 드롭다운**의 **Implementation Logic** (Portal, Auto-Flip, Click Outside) 및 `Table Manage Bubble` 규칙을 **반드시 준수**해야 합니다.
  - **Alignment**: 드롭다운은 **트리거 버튼의 우측 끝(Right Edge)을 기준**으로 정렬되어야 합니다. (왼쪽 정렬 금지)
  - **Width**: 드롭다운 컨테이너는 **내부 콘텐츠 너비에 맞게(`w-max` 또는 `min-w-fit`)** 설정되어야 하며, `min-width` 제약 없이 콘텐츠 길이에 자연스럽게 맞춰져야 합니다.
  - **Content**: 수정, 복제, 삭제 등의 액션을 포함해야 하며, 각 액션에 어울리는 **아이콘(Icon)**을 텍스트 좌측에 배치하여 직관성을 높여야 합니다. (예: 수정-Pencil, 삭제-Trash)
  - **Style**: `text-sm`, `font-medium`, `text-gray-070` 스타일을 적용합니다.
  - **Animation**: **0.3 스타일 및 기술 표준**의 '즉시 등장(No Floating Animation)' 규칙을 따릅니다. 진입 애니메이션 없이 즉시 렌더링되어야 합니다.

#### 3.4.4 Pagination

테이블 하단에 위치하며, 좌측(Total), 중앙(Controls), 우측(Rows Select)의 3단 구성을 가집니다.

- **Layout**: `grid grid-cols-3 items-center mt-4 px-2`. (모바일: `flex flex-col gap-4`)
- **Left (Total Count)**: `justify-self-start`. "총 **N**개" (`text-xs text-gray-060`, 숫자 강조).
- **Center (Controls)**: `justify-self-center`.
  - **Structure**: `{ << < 1 2 3 4 5 > >> }` 형태. 처음/마지막(`Chevrons`), 이전/다음(`Chevron`) 아이콘 버튼 사용.
  - **UI**: 현재 페이지는 `bg-gray-090 text-white rounded-[10px]`로 강조. 각 버튼은 `w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-gray-010 transition-colors` 스타일을 가집니다.
  - **Gap**: 버튼 간 `gap-1`을 적용합니다.
- **Right (Rows per Page)**: `justify-self-end`.
  - **Component**: **Pagination Select** 규칙(3.2 입력 폼)을 적용합니다.
  - **Style**: `bg-transparent`, `text-[13px]`, `font-medium`, `text-gray-070`, `border-none`, `focus:ring-0`, `cursor-pointer`.

#### 3.4.5 Accessibility (A11y)

- **Caption**: 테이블의 목적을 설명하는 `<caption>` 요소를 반드시 포함해야 합니다. (디자인상 보이지 않아야 한다면 `sr-only` 클래스 사용)
- **Scope**: 헤더 셀(`th`)에는 `scope="col"`을, 행의 대표 셀(`th` 또는 첫 번째 `td`)에는 `scope="row"`를 명시하여 데이터 관계를 명확히 합니다.
- **Keyboard Navigation**: 테이블 내에 인터랙티브 요소(버튼, 링크)가 있는 경우, 키보드 탭 순서가 논리적이어야 합니다.
- **Row Action Menu A11y**:
  - **Trigger**: `aria-haspopup="menu"`, `aria-expanded="false/true"` 속성을 적용합니다.
  - **Menu**: `role="menu"`, `aria-orientation="vertical"`, `tabindex="-1"` 속성을 적용합니다.
  - **Item**: 각 메뉴 항목에 `role="menuitem"`을 적용합니다.
  - **Interaction**: `Enter`/`Space`로 열기, `Arrow Keys`로 이동, `Esc`로 닫기 및 트리거 포커스 복귀를 지원해야 합니다.

### 3.5 카드 (Card)

#### 3.5.1 Container Style
>
> **AI Note**: 카드는 **Border-less** 디자인을 최우선으로 고려합니다. 단, 시인성 확보가 필수적인 경우에 한해 예외적으로 Border를 허용합니다.

- **Container**: `bg-white`, `rounded-2xl` (16px - **Radius Level 1**), `overflow-hidden`.
  - **Style (Border-less Policy)**: 테두리(`border`) 사용을 지양하고, `shadow-sm` (기본) 또는 `shadow-md` (강조)를 통해 깊이감을 표현하는 것을 **최우선 원칙**으로 합니다.
  - **Accessibility Exception**: 단, 그림자만으로 카드 영역을 구분하기 어려워 **시인성(Visibility) 문제가 명확한 경우**(예: 고대비 모드 등), 웹 접근성 향상을 위해 `border border-gray-020`을 추가할 수 있습니다.
  - **Modification Check**: 기존 코드 수정 시 `border` 제거를 우선적으로 검토하되, 제거 시 시인성에 문제가 생기는지 확인하십시오.

#### 3.5.2 Structure (Strict)

- **Header**: `p-6 pb-3`, `flex justify-between items-center`. (제목과 액션 영역)
  - **Title**: `text-lg`, `font-bold`, `text-gray-090`.
  - **Action**: 우측 상단에 더보기 버튼(`IconButton`) 또는 필터 배치.
- **Body**: `p-6 pt-3`. 콘텐츠의 주 영역입니다. (Header와 Body 사이의 패딩 분리를 엄수하여 수직 리듬 유지)
- **Footer**: `p-6 pt-0`, `border-t border-gray-010` (선택적).

#### 3.5.3 Usage Scope & Radius Rules

- **Dashboard Widgets**: 통계, 차트 등을 담는 컨테이너로 사용하며 `rounded-2xl`을 엄수합니다.
- **List Items (Grid)**: 그리드 리스트의 개별 항목으로 사용 시, `hover:shadow-md`, `hover:-translate-y-1` 등의 인터랙션을 추가하여 클릭 가능성을 암시합니다.
- **Inner Elements**: 카드 내부의 버튼은 **Level 2**(`rounded-[10px]`), 입력 필드는 **Level 2**(`rounded-[10px]`) 라디우스 규칙을 따라 시각적 위계를 유지해야 합니다.

### 3.6 배지 (Badge)

#### 3.6.1 Base Style

- **Layout**: `inline-flex`, `items-center`, `justify-center`, `px-2.5`, `py-1`, `whitespace-nowrap`.
- **Shape**: `rounded-md` (6px - **Radius Level 4**).
- **Typography**: `text-xs`, `font-bold`.
- **Interaction**: `transition-colors`.

#### 3.6.2 Accessibility Check (접근성 체크)
>
> **AI Note**: 배지는 배경색에 따라 가시성이 크게 달라질 수 있으므로, 명도 대비를 반드시 확인해야 합니다.

- **Contrast**: 배지 생성 시, 배지의 배경색과 텍스트 색상 간의 명도 대비뿐만 아니라, **배지가 위치할 주변 배경색과의 대비**도 확인해야 합니다.
- **Visibility**: 배경색이 너무 옅거나 주변 색상과 유사하여 가시성이 떨어지는 경우(Contrast Ratio < 3:1), 반드시 `border border-gray-020` 또는 해당 컬러의 `border-opacity-20`을 추가하여 경계를 명확히 해야 합니다.
- **Hover State**: Hover 시 배경색이 변경될 때도 텍스트와의 명도 대비(4.5:1 이상)가 유지되는지 확인해야 합니다. 테이블 Row Hover 색상(`bg-gray-005`) 위에서도 식별 가능해야 합니다.

#### 3.6.3 Variants (Semantic)

- **Neutral (Default)**: `bg-gray-010 text-gray-060 border border-gray-020`. (기본 상태, 미분류)
- **Primary (Brand)**: `bg-primary-50 text-primary-700 border border-primary-500/20`. (신규, 주요 정보)
- **Success (Positive)**: `bg-green-50 text-green-700 border border-green-200`. (완료, 승인, 정상)
- **Warning (Caution)**: `bg-orange-50 text-orange-700 border border-orange-200`. (대기, 진행 중, 주의)
- **Danger (Negative)**: `bg-red-50 text-red-700 border border-red-200`. (오류, 거절, 삭제)
- **Outline**: `bg-white border border-gray-020 text-gray-060`. (태그, 보조 속성)

#### 3.6.4 Types

- **Standard**: 텍스트만 포함된 기본 형태.
- **Dot Badge**: 텍스트 좌측에 `w-1.5 h-1.5 rounded-full` (Current Color) 점을 포함하여 상태를 강조합니다. (`gap-1.5` 적용)
- **Counter**: 알림 개수 등을 표시할 때 사용하며, `px-1.5`, `h-5`, `min-w-[20px]`, `rounded-full`, `bg-red-500`, `text-white` 스타일을 적용합니다.

### 3.7 체크박스 및 라디오 (Checkbox & Radio)

#### 3.7.1 Implementation Logic (구현 로직)
>
> **AI Note**: 체크박스와 라디오 버튼은 `peer` 클래스를 활용한 CSS 기반 상태 제어를 권장합니다.

- **Structure**: 반드시 `<label>`로 감싸고, 내부에 `<input type="checkbox" class="peer sr-only" />`와 시각적 요소(`div`)를 배치합니다.
- **Icon Visibility Strategy (Critical)**:
  - **Issue**: 체크된 상태에서 아이콘이 보이지 않는 문제는 주로 `peer` 선택자가 아이콘을 올바르게 타겟팅하지 못해서 발생합니다.
  - **Solution**: 아이콘(`svg`) 자체에 `opacity-0` (기본) 및 `peer-checked:opacity-100` (체크됨) 클래스를 직접 적용하지 말고, **체크박스 컨테이너(`div`)**에 `[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100` 와 같이 자식 선택자를 사용하여 제어하거나, 아이콘에 `text-white`가 명시되어 있는지 확인하십시오.
  - **Recommendation**: CSS Opacity 전환 방식을 사용하여 부드러운 인터랙션을 제공하십시오.
- **Keyboard Focus**:
  - 실제 `input` 요소가 `sr-only`로 숨겨져 있어도 포커스는 가능해야 합니다.
  - 시각적 컨테이너(`div`)에 `peer-focus-visible:ring-2 peer-focus-visible:ring-gray-090 peer-focus-visible:ring-offset-1` 클래스를 적용하여 포커스 상태를 명확히 표시합니다.

#### 3.7.2 Common Layout

- **Wrapper**: `inline-flex items-center gap-2.5`, `cursor-pointer`, `select-none`.
- **Label Text**: `text-sm`, `font-medium`, `text-gray-080`.

#### 3.7.3 Checkbox Style

- **Base Style**: `w-5 h-5`, `rounded` (4px - **Radius Level 4**), `border border-gray-020`, `bg-white`, `transition-all`, `flex items-center justify-center`.
- **Checked**: `peer-checked:bg-primary-500`, `peer-checked:border-primary-500`, `peer-checked:text-white`.
- **Icon**: `w-3.5 h-3.5`, `text-white`, `opacity-0`, `peer-checked:opacity-100`, `transition-opacity`. (아이콘 색상 `text-white` 필수)
- **Hover**: `hover:border-primary-500` (Unchecked 상태).

#### 3.7.4 Radio Style

- **Base Style**: `w-5 h-5`, `rounded-full`, `border-[5px] border-gray-020`, `bg-white`, `transition-all`, `flex items-center justify-center`.
- **Checked**: `peer-checked:border-primary-500`.
- **Indicator**: `w-2.5 h-2.5`, `rounded-full`, `bg-primary-500`, `opacity-0`, `peer-checked:opacity-100`, `transition-opacity`.
- **Hover**: `hover:border-primary-500` (Unchecked 상태).

#### 3.7.5 States

- **Focus**: `peer-focus-visible:ring-2 peer-focus-visible:ring-gray-090 peer-focus-visible:ring-offset-1`. (키보드 포커스 시 필수적으로 시각적 표시)
- **Error**: `border-red-500`.
- **Disabled**: `bg-gray-005`, `border-gray-020`, `opacity-50`, `cursor-not-allowed`. (라벨 텍스트: `text-gray-050`)

### 3.8 알럿 (Alert Dialog)

#### 3.8.1 Definition & Structure

- **Definition**: 사용자의 주의가 필요한 중요 메시지나 결정(확인/취소)을 요구하는 **Modal의 특수한 형태**입니다. 일반적인 정보 전달이나 복잡한 폼이 포함된 경우 **3.3 표준 모달**을 사용하십시오.
- **Overlay**: `fixed inset-0 z-[110]`, `bg-black/40`, `backdrop-blur-sm`.
- **Container**: `fixed left-[50%] top-[50%] z-[111]`, `w-[320px]`, `translate-x-[-50%] translate-y-[-50%]`, `bg-white`, `rounded-2xl` (16px - **Radius Level 1**), `shadow-xl`, `p-6`, `text-center`.

#### 3.8.2 Content & Actions

- **Content**:
  - **Icon (Optional)**: 상단 중앙 배치, `w-10 h-10`, `mb-3`, `text-primary-500` (Success) 또는 `text-red-500` (Error).
  - **Title**: `text-lg`, `font-bold`, `text-gray-090`, `mb-2`.
  - **Description**: `text-sm`, `text-gray-060`, `leading-relaxed`, `mb-6`, `break-keep`.
- **Actions**:
  - **Layout**: `flex flex-col gap-2` (모바일 친화적) 또는 `flex justify-center gap-3`.
  - **Buttons**:
    - **Confirm**: `w-full`, `h-[40px]`, `rounded-[10px]` (**Radius Level 2**), `bg-gray-090`, `text-white`, `font-bold`. (Destructive인 경우 `bg-red-500`)
    - **Cancel**: `w-full`, `h-[40px]`, `rounded-[10px]`, `bg-white`, `border border-gray-020`, `text-gray-070`, `font-medium`.

#### 3.8.3 Accessibility (A11y)

- **Focus Trap**: 알럿이 열리면 키보드 포커스는 반드시 알럿 내부로 갇혀야 하며, 닫히기 전까지 외부 요소로 이동할 수 없습니다. 초기 포커스는 **가장 안전한 액션(보통 '취소' 버튼)**에 위치해야 합니다.
- **Persistent Overlay**: 사용자의 명시적인 결정(버튼 클릭)을 강제하기 위해, **배경(Overlay)을 클릭해도 알럿이 닫히지 않아야 합니다.** (`pointer-events-none`이 아닌 클릭 이벤트 무시 처리)
- **Role & Label**: `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby="alert-title"`, `aria-describedby="alert-desc"` 속성을 필수적으로 포함합니다.

### 3.9 탭 (Tabs)

#### 3.9.1 Type A: Underline (Page/Section Tabs)

- **Container**: `flex w-full border-b border-gray-020`.
- **Item**: `flex items-center justify-center`, `px-4`, `pb-3`, `cursor-pointer`, `transition-colors`.
- **State**:
  - **Default**: `text-gray-060`, `font-medium`, `border-b-2 border-transparent`.
  - **Active**: `text-primary-600`, `font-bold`, `border-b-2 border-primary-600`.
  - **Hover**: `text-gray-080`.

#### 3.9.2 Type B: Segmented Control (View Switcher)

- **Container**: `inline-flex`, `p-1`, `bg-gray-010`, `rounded-[10px]` (10px - **Radius Level 2**).
- **Item**: `px-3`, `py-1.5`, `text-xs`, `font-medium`, `rounded-lg` (8px - **Radius Level 3**), `transition-all`.
- **State**:
  - **Active**: `bg-white`, `text-gray-090`, `shadow-sm`.
  - **Default**: `text-gray-060 hover:text-gray-080`.

#### 3.9.3 Accessibility (A11y)

- **Roles**: 컨테이너는 `role="tablist"`, 각 탭은 `role="tab"`, 패널은 `role="tabpanel"`을 가집니다.
- **States**: 활성 탭에는 `aria-selected="true"`, 비활성 탭에는 `aria-selected="false"`를 명시합니다.
- **Keyboard**: `Arrow Keys`로 탭 간 이동이 가능해야 하며, `Enter` 또는 `Space`로 선택합니다.

### 3.10 토글 스위치 (Toggle Switch)

#### 3.10.1 Implementation Logic (구현 로직)

- **Structure**: `<label>` 내부에 `<input type="checkbox" role="switch" class="peer sr-only" />`와 트랙(`div`), 핸들(`span`)을 배치합니다.
- **State Handling**:
  - **Track**: `peer-checked:bg-primary-500` (On), `bg-gray-040` (Off).
  - **Handle**: `peer-checked:translate-x-5` (On), `translate-x-0` (Off).
- **Keyboard Focus**:
  - 숨겨진 `input`에 포커스가 갈 때, 트랙(`div`)에 `peer-focus-visible:ring-2 peer-focus-visible:ring-gray-090 peer-focus-visible:ring-offset-1`을 적용하여 시각적 피드백을 제공해야 합니다.

#### 3.10.2 Style

- **Container**: `w-11 h-6`, `rounded-full`, `transition-colors duration-200`, `cursor-pointer`, `flex items-center`, `px-0.5`.
  - **On**: `bg-primary-500`.
  - **Off**: `bg-gray-040`.
  - **Focus**: `peer-focus-visible:ring-2 peer-focus-visible:ring-gray-090`. (Input 스타일과 동일하게 적용)
  - **Disabled**: `bg-gray-020`, `cursor-not-allowed`.
- **Handle**: `w-5 h-5`, `bg-white`, `rounded-full`, `shadow-sm`, `transform transition-transform duration-200`.
  - **On**: `translate-x-5`.
  - **Off**: `translate-x-0`.
- **Label**: 토글 옆 텍스트는 `text-sm`, `font-medium`, `text-gray-080`을 사용하며, 클릭 시 토글이 작동해야 합니다.

#### 3.10.3 Accessibility (A11y)

- **Role**: `role="switch"` 속성을 사용합니다.
- **State**: 켜짐/꺼짐 상태를 `aria-checked="true/false"`로 명시합니다.

### 3.11 툴팁 (Tooltip)

- **Trigger**: `Hover` 또는 `Focus` 시 0.2초 지연(Delay) 후 등장.
- **Container**: `z-[120]`, `max-w-[240px]`, `bg-gray-090`, `text-white`, `text-xs`, `font-medium`, `px-3`, `py-1.5`, `rounded-md` (6px - **Radius Level 4**), `shadow-lg`, `break-words`.
- **Arrow**: 툴팁 박스 중앙 하단/상단에 `fill-gray-090` 색상의 작은 삼각형 화살표 포함.
- **Animation**: `data-[state=delayed-open]:animate-in data-[state=closed]:animate-out fade-in zoom-in-95`.
- **Accessibility (A11y)**:
  - **Role**: 툴팁 컨테이너에 `role="tooltip"`을 적용합니다.
  - **Association**: 트리거 요소에 `aria-describedby="tooltip-id"`를 연결하여 스크린 리더가 툴팁 내용을 읽을 수 있게 합니다.

### 3.12 버블 및 드롭다운 (Bubble & Dropdown)

#### 3.12.1 Implementation Logic (구현 로직)
>
> **AI Note**: 드롭다운은 위치 계산과 외부 클릭 감지가 핵심입니다.

- **Positioning**:
  - 트리거 요소의 `getBoundingClientRect()`를 사용하여 위치를 계산합니다.
  - **Portal**: `createPortal` (React) 또는 `document.body.appendChild` (Vanilla)를 사용하여 `document.body`에 렌더링하여 `overflow: hidden` 이슈를 방지합니다.
  - **Auto-Flip**: 화면 하단 공간이 부족하면 상단으로 위치를 변경합니다. 이때, 트리거 요소와 너무 멀어지지 않도록 **자연스러운 위치(Offset)**를 유지해야 하며, 시각적 연결성이 끊어지지 않도록 주의해야 합니다.
- **Click Outside**:
  - `document`에 `mousedown` 또는 `click` 이벤트를 등록하여, 타겟 컨테이너(Target Container) 외부 클릭 시 닫습니다.
- **Focus Management**:
  - 열릴 때 첫 번째 항목으로 포커스 이동.
  - `Esc` 키로 닫을 때 트리거 버튼으로 포커스 복귀.

#### 3.12.2 Container Style

- **Container**: `absolute`, `z-50`, `bg-white`, `shadow-lg`, `border border-gray-010`, `overflow-hidden`.
- **Width**: 내부 콘텐츠의 크기에 맞춰 너비가 자동으로 조절되어야 합니다 (`w-auto`, `min-w-max`). 드롭다운을 포함하여 드롭다운 내에는 고정 너비(`w-[Npx]`)가 없어야 합니다.
- **Radius**: 드롭다운의 크기에 따라 가변적으로 적용합니다. (일반/소형: `rounded-lg` (8px - **Level 3**), 대형/복합: `rounded-2xl` (16px - **Level 1**))
- **Animation**: `animate-in fade-in zoom-in-95 duration-200`.

#### 3.12.3 Variants

- **User Info Bubble**:
  - **Header**: `p-4`, `border-b border-gray-010`. 사용자 아바타와 이름/이메일 표시.
  - **Menu List**: `p-2`. 각 항목은 `flex items-center gap-2`, `pl-3 pr-4 py-2`, `rounded-lg` (8px), `hover:bg-gray-005` 스타일 적용. (아이콘과의 균형을 위해 우측 패딩을 소폭 증가)
  - **Footer**: `p-2`, `border-t border-gray-010`. 로그아웃 등 중요 액션 배치.
- **Table Manage Bubble**:
  - **Trigger**: 테이블 행의 '더보기' 버튼(`more-horizontal`) 클릭 시 등장.
  - **Position**: 버튼 우측 하단 또는 좌측 하단에 배치 (`absolute right-8 top-8` 등).
  - **Overflow Handling**: 테이블의 `overflow: hidden` 속성에 의해 잘리지 않도록, **Portal 전략**을 사용하여 `body` 레벨에 렌더링하고 `fixed` 포지셔닝으로 위치를 잡아야 합니다.
  - **Content**: 수정, 복제, 삭제 등의 액션 버튼 목록.
  - **Item Style**: `w-full`, `text-left`, `text-xs`, `font-medium`, `text-gray-070`.
  - **Interaction**:
    - **Toggle Behavior**: 버블이 열린 상태에서 다른 행의 트리거 버튼을 클릭하면, **반드시 기존 버블을 닫고(Reset) 새로운 버블을 렌더링**해야 합니다. (0.3 플로팅 요소 인터랙션 규칙 준수)
    - **Keyboard Support**:
      - 트리거 버튼은 `Enter` 또는 `Space` 키로 버블을 열 수 있어야 합니다.
      - 버블이 열리면 포커스가 내부의 첫 번째 항목으로 이동해야 합니다.
      - `Tab` 또는 `Arrow Keys`로 항목 간 이동이 가능해야 하며, `Esc` 키 입력 시 버블이 닫히고 포커스가 트리거 버튼으로 복귀해야 합니다.

### 3.13 파일 업로드 (File Upload)

#### 3.13.1 Implementation Logic (구현 로직)

- **Drag & Drop Events**:
  - `dragover`, `dragenter`: `preventDefault` 및 `stopPropagation` 호출, `isDragging` 상태 `true`로 설정.
  - `dragleave`, `drop`: `isDragging` 상태 `false`로 설정.
  - `drop`: `e.dataTransfer.files`를 통해 파일 목록 획득.
- **File Validation**:
  - 파일 크기(`size`) 및 타입(`type`) 검사 후 유효한 파일만 상태에 추가.
- **Hidden Input**:
  - `<input type="file" hidden />` 요소를 렌더링하고, 트리거 버튼 클릭 시 `input` 요소에 대해 **Programmatic Click**(`click()`)을 호출합니다.
  - `onChange` 이벤트에서 `e.target.files` 처리.

#### 3.13.2 Type A: Drag & Drop Zone (확장형)

- **Container**: `w-full`, `min-h-[200px]`, `border-2 border-dashed border-gray-020`, `rounded-2xl` (16px - **Radius Level 1**), `flex flex-col items-center justify-center`, `bg-gray-005`, `transition-colors`.
- **Interaction**:
  - **Default**: `bg-gray-005`, `border-gray-020`.
  - **Drag Over**: `bg-primary-50`, `border-primary-500`.
- **Content**:
  - **Icon**: `UploadCloud` 등 직관적 아이콘 (`w-10 h-10`, `text-gray-040`, `mb-4`).
  - **Text**: "파일을 드래그하여 업로드" (`text-sm`, `font-medium`, `text-gray-070`).
  - **Subtext**: 용량 제한 등 안내 (`text-xs`, `text-gray-050`, `mt-1`).

#### 3.13.3 Type B: Input Style (단축형)

- **Layout**: `flex items-center gap-2`.
- **Display**: `Standard Input` 스타일을 유지하되 `readonly` 속성 적용. 파일명 또는 "N개의 파일 선택됨" 표시.
- **Trigger Button**: `h-[42px]`, `px-4`, `rounded-[10px]` (**Radius Level 2**), `bg-gray-080`, `text-white`, `font-bold`.

#### 3.13.4 Uploaded File List (목록)

- **Item**: `flex items-center justify-between`, `p-3`, `bg-white`, `border border-gray-020`, `rounded-[10px]` (**Radius Level 2**), `mb-2`.
- **Info**: 파일 아이콘 + 파일명(`text-sm font-medium`) + 용량(`text-xs text-gray-050`).
- **Action**: 삭제 버튼(`X` 아이콘), `text-gray-040 hover:text-red-500`.

#### 3.13.5 Accessibility (A11y)

- **Keyboard Support**: 드래그 앤 드롭 영역(`Type A`)이나 트리거 버튼(`Type B`)은 `Enter` 또는 `Space` 키로 파일 선택 창을 열 수 있어야 합니다.
  - **Implementation**: `div`나 `label`을 트리거로 사용할 경우 `tabindex="0"`을 추가하고, `keydown` 이벤트 핸들러를 통해 `Enter`/`Space` 입력을 감지하여 숨겨진 `input`을 클릭(`click()`)해야 합니다.
- **Focus Indicator**: 키보드 포커스 시 `focus:ring-2 focus:ring-gray-090` 등의 명확한 시각적 피드백을 제공해야 합니다.
- **Screen Reader**:
  - **Hidden Input**: 실제 `<input type="file">` 요소는 `sr-only` 클래스로 시각적으로만 숨기고, 스크린 리더가 접근 가능하도록 하거나 `label`과 연결해야 합니다.
  - **Status Update**: 파일이 선택되거나 업로드 완료 시, `aria-live="polite"` 영역을 통해 "파일이 선택되었습니다" 또는 "업로드 완료" 등의 상태 메시지를 전달해야 합니다.
