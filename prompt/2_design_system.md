## 2. 디자인 시스템 (Design System)

### 2.1 컬러 팔레트 (Color Palette)

Tailwind 설정(`tailwind.config.js`)에 정의된 커스텀 컬러 시스템을 따르며, 각 컬러는 명확한 역할과 위계를 가집니다.

#### 2.1.1 Gray Scale (Neutral & Hierarchy)
> **AI Note**: 배경, 테두리, 텍스트의 위계를 정의하는 중립 컬러 시스템입니다. 텍스트 색상 선택 시 배경색과의 명도 대비(Contrast Ratio)를 항상 고려하십시오.

- **Backgrounds (Surface)**
  - `gray-000 (#FFFFFF)`: **Default Background** (페이지 기본 배경, 카드/모달/드로어 컨테이너 배경).
  - `gray-005 (#F6F6F7)`: **Section Background** (사이드바, 테이블 헤더, 구분된 섹션 배경).
  - `gray-010 (#ECECEE)`: **Interaction Background** (리스트 항목 호버, 버튼 호버, 클릭 피드백).
- **Borders (Structure)**
  - `gray-010 (#ECECEE)`: **Divider** (약한 구분선, 내부 디바이더).
  - `gray-020 (#E4E4E6)`: **Standard Border** (카드 테두리, 입력 필드 테두리, 일반 구분선).
- **Text & Icons (Content)**
  - `gray-040 (#C4C5C5)`: **Disabled/Placeholder** (비활성 텍스트, 입력 필드 플레이스홀더).
  - `gray-050 (#B0B3B3)`: **Caption** (부가 설명, 아주 작은 텍스트).
  - `gray-060 (#8D9292)`: **Sub Text** (메타 데이터, 날짜, 덜 중요한 정보).
  - `gray-070 (#696D6D)`: **Secondary Text** (본문 보조, 설명 텍스트).
  - `gray-080 (#3F4141)`: **Primary Text** (일반 본문, 버튼 텍스트).
  - `gray-090 (#272929)`: **Heading** (페이지 제목, 섹션 제목, 강한 강조).

#### 2.1.2 Theme & Functional Colors
> **AI Note**: 브랜드 아이덴티티와 상태(Status)를 전달하는 컬러입니다. 의미에 맞게 정확히 사용해야 합니다.

- **Primary (Teal/Green)**: 브랜드 메인 아이덴티티 컬러 (`primary-500: #5CC29B` 기준).
  - `primary-50 (#EBF9F5)`: **Background** (선택된 리스트 항목, 배지 배경, 은은한 강조).
  - `primary-100`: **Hover Background** (Ghost 버튼 호버, 연한 배경의 인터랙션).
  - `primary-500 (#5CC29B)`: **Main** (Solid 버튼 배경, 활성 탭, 토글, 체크박스, 포커스 링).
  - `primary-600 (#4AB08A)`: **Hover/Active** (Solid 버튼 호버, 텍스트 링크 호버).
- **Secondary (Blue)**: 보조 액션 및 정보 강조 (`secondary-500: #75A7E7` 기준).
  - `secondary-50`: **Background** (정보성 배지 배경).
  - `secondary-500 (#75A7E7)`: **Main** (링크 텍스트, 보조 버튼, 정보 아이콘).
  - `secondary-600`: **Hover** (링크 호버).
- **Functional Colors (Status & Feedback)**: 상태 전달을 위한 표준 컬러 시스템.
  - **Error (Red)**: `red-500 (#EF4444)` (삭제/오류).
    - `bg-red-50 (#FEF2F2)` + `text-red-600 (#DC2626)`: 에러 알럿/배지 배경 및 텍스트.
    - `red-500`: 삭제 버튼, 에러 아이콘, 유효성 검사 실패 테두리.
    - `red-600`: 삭제 버튼 호버.
  - **Success (Green)**: `green-500 (#22C55E)` (성공/완료).
    - `bg-green-50 (#F0FDF4)` + `text-green-600`: 성공 알럿/배지.
    - `green-500`: 완료 아이콘, 성공 상태 텍스트.
  - **Warning (Orange)**: `orange-500 (#F59E0B)` (주의/대기).
    - `bg-orange-50 (#FFFBEB)` + `text-orange-600`: 경고 알럿/배지.
    - `orange-500`: 주의 아이콘, 대기 상태 텍스트.
  - **Info (Blue)**: `blue-500 (#3B82F6)` (정보/도움말).
    - `bg-blue-50` + `text-blue-600`: 정보 알럿/배지.
    - `blue-500`: 도움말 아이콘, 정보 텍스트.

#### 2.1.3 Opacity & Effects (투명도 및 효과)
- **Overlay**: 모달 및 드로어 뒷배경은 `bg-black/40`을 표준으로 사용합니다.
- **Glassmorphism**: 헤더 및 플로팅 요소는 `bg-white/90` (Light) 또는 `bg-gray-090/90` (Dark)와 `backdrop-blur-md`를 조합하여 사용합니다.

### 2.2 타이포그래피 (Typography)

#### 2.2.1 Font Family & Weight
- **Font Family**:
  - **Primary**: `Pretendard Variable` - 모든 한글 및 기본 텍스트.
- **Font Weight (굵기)**:
  - `font-bold (700)`: 제목(Heading), 버튼 텍스트(Button), 배지(Badge), 활성 탭(Active Tab), 중요 강조.
  - `font-medium (500)`: 폼 라벨(Label), 테이블 헤더(Table Header), 드롭다운 항목(Dropdown Item), 입력 텍스트(Input), 내비게이션.
  - `font-normal (400)`: 일반 본문(Body), 플레이스홀더(Placeholder), 도움말(Helper Text), 긴 설명.

#### 2.2.2 Hierarchy & Scale (Component Mapping)
> **AI Note**: 각 텍스트 요소의 역할에 맞는 크기를 엄격히 준수하십시오. 임의의 크기(`text-[17px]`) 사용은 금지됩니다.

- `text-3xl (30px)`: **Page Title**. (`font-bold`, `tracking-tight`)
- `text-2xl (24px)`: **Section Title**, **Modal Title**. (`font-bold`, `tracking-tight`)
- `text-xl (20px)`: **Card Title**, **Widget Title**. (`font-bold`)
- `text-lg (18px)`: **Subtitle**, **Large Form Group Title**. (`font-bold`)
- `text-base (16px)`: **Body Text**, **Large Button**, **Main Menu**, **Tab (Active)**. (`font-normal` or `font-medium`)
- `text-sm (14px)`: **Standard Input**, **Medium Button**, **Form Label**, **Table Body**, **Dropdown Item**, **Toast Message**. (`font-medium` 권장)
- `text-xs (12px)`: **Small Button**, **Helper Text**, **Tooltip**, **Meta Info**, **File Upload Subtext**.

#### 2.2.3 Web Accessibility (웹 접근성)
- **Relative Units**: 모든 폰트 사이즈는 `rem` 단위를 사용하는 Tailwind 유틸리티(`text-sm`, `text-base` 등)를 사용하여 브라우저 설정에 따라 크기가 조절되도록 합니다. (`text-[15px]` 등 고정 px 사용 금지)
- **Line Height**: 본문 가독성을 위해 `leading-relaxed` (1.625) 또는 `leading-normal` (1.5)을 기본으로 사용합니다.
- **Heading Hierarchy**: 시각적 크기(`text-xl`)와 상관없이, 문서 구조에 맞는 올바른 헤딩 태그(`h1`~`h6`)를 순차적으로 사용합니다.
- **Readability Rules**:
  - **Line Height**: 제목은 `leading-tight`, 본문은 `leading-relaxed`를 지향합니다.
  - **Tracking**: 큰 제목(20px 이상)에는 `tracking-tight`를 적용하여 밀도감을 높입니다.

### 2.3 레이아웃 규격 (Layout Specs)

#### 2.3.1 Layout Types
> **AI Note**: 프로젝트의 성격에 따라 적절한 레이아웃 타입을 선택하여 구현하십시오.

**Type 1: 대시보드 레이아웃 (Dashboard Layout - Default)**
- **구조**: 좌측 고정 사이드바(`Aside`) + 상단 고정 헤더(`Header`) + 메인 콘텐츠(`Main`)의 3단 구조.
- **Aside (Sidebar)**:
  - **Desktop (>= 1024px)**: `w-[220px]` 고정, `h-screen`, `sticky top-0`, `border-r border-gray-020`.
  - **Tablet (768px ~ 1023px)**: `w-[72px]` (Collapsed Mode). 아이콘만 표시되며, Hover 시 툴팁을 제공하거나 클릭 시 확장됩니다.
  - **Mobile (< 768px)**: `hidden` (기본 숨김). 햄버거 메뉴 클릭 시 `fixed inset-y-0 left-0 z-50 w-[280px]` 크기의 **Drawer** 형태로 등장하며, 배경에는 `bg-black/40` 오버레이가 깔려야 합니다.
  - **구성**: 로고(`p-8 pb-4`), 내비게이션(`px-3 space-y-1`), 하단 카피라이트(`mt-auto px-6 py-5`).
- **Main Header**:
  - **Height**: `h-[64px]` 고정.
  - **Style**: `sticky top-0 z-40`, `backdrop-blur-md`, `bg-white/90`.
  - **Items**:
    - **Desktop**: 좌측(Breadcrumb), 중앙(Search), 우측(Profile/Actions).
    - **Mobile/Tablet**: 좌측(Menu Trigger + Logo), 우측(Profile). Search는 아이콘으로 축소되거나 하단으로 이동.
- **Main Content**:
  - **Container**: `max-w-[1440px] mx-auto`.
  - **Padding**: `p-4` (Mobile) -> `p-6` (Tablet) -> `p-8` (Desktop).

**Type 2: 전체 화면 레이아웃 (Full-screen Layout)**
- **용도**: 로그인, 회원가입, 랜딩 페이지, 404 에러 페이지.
- **구조**: 헤더와 사이드바 없이 중앙 정렬된 단일 컨테이너(`flex-center`).

#### 2.3.2 Responsive Strategy
- **Breakpoints**:
  - **Mobile (< 768px)**: 사이드바 숨김(Drawer), 헤더 간소화, 1단 그리드, 패딩 `16px`.
  - **Tablet (768px ~ 1024px)**: 사이드바 아이콘 모드(선택적) 또는 오버레이, 2단 그리드.
  - **Desktop (>= 1024px)**: 사이드바 확장, 다단 그리드, 패딩 `32px`.
- **Grid System**:
  - 기본적으로 `grid-cols-1`에서 시작하여 화면 크기에 따라 `md:grid-cols-2`, `lg:grid-cols-3` 등으로 확장하는 **Mobile-First** 접근을 사용합니다.

#### 2.3.3 Border Radius System
> **AI Note**: UI 요소의 크기와 역할에 따라 4단계의 라디우스 규칙을 엄격히 적용합니다.

- **Level 1: Large Container (`rounded-2xl` / 16px)**
  - **Class**: `rounded-2xl`
  - **Target**: 모달(Modal), 카드(Card), 알럿(Alert), 드로어(Drawer), 대형 섹션.
  - **Concept**: 화면에서 독립적인 영역을 구분하는 가장 큰 단위의 컨테이너로, 부드럽고 안정적인 인상을 줍니다.
- **Level 2: Medium Component (`rounded-[10px]` / 10px)**
  - **Class**: `rounded-[10px]` (JIT)
  - **Target**: 버튼(Button), 입력 필드(Input), 셀렉트(Select), 탭(Tabs), 토스트(Toast).
  - **Concept**: 사용자가 직접 상호작용하는 주요 UI 컴포넌트의 표준 규격입니다.
- **Level 3: Small Component (`rounded-lg` / 8px)**
  - **Class**: `rounded-lg`
  - **Target**: 팝오버(Popover), 내부 그룹핑 요소, 작은 버튼(Small Button).
  - **Concept**: 밀도가 높은 UI나 Level 1 컨테이너 내부의 보조 요소에 적용합니다.
- **Level 4: Micro Element (`rounded-md` / 6px or `rounded` / 4px)**
  - **Class**: `rounded-md` (6px) 또는 `rounded` (4px)
  - **Target**: 배지(Badge - 6px), 체크박스(Checkbox - 4px), 툴팁(Tooltip - 6px).
  - **Concept**: 텍스트와 밀접하게 배치되는 아주 작은 단위의 요소입니다.
- **Nested Radius Rule (중첩 라디우스 규칙)**:
  - 내부 요소의 라디우스는 외부 컨테이너의 라디우스와 시각적 조화를 이루어야 합니다.
  - **공식**: `Outer Radius - Padding ≈ Inner Radius`
  - **예시**: `rounded-2xl` (16px) 카드 내부에 `p-1.5` (6px) 패딩을 두고 내부 요소를 배치할 경우, 내부 요소는 `rounded-[10px]` (10px)를 사용하는 것이 자연스럽습니다.
