# Style Prompt Update Log

## 2026-01-05 00:20:00 (KST)

- **Component Update (Data Table)**:
  - **Updated**: `prompt/3_standard_components.md` Section 3.4.3 (Selection & Actions) - Enforced Dropdown Rules.
    - **Governance**: Explicitly mandated that the Row Action Menu must follow the **3.12 Bubble & Dropdown** rules (Portal, Auto-Flip, Click Outside).

## 2026-01-05 00:15:00 (KST)

- **Component Update (Date & Time Input)**:
  - **Updated**: `prompt/3_standard_components.md` Section 3.2.5 (Custom Date Input) & 3.2.6 (Custom Time Input) - Enforced Dropdown Rules.
    - **Governance**: Explicitly mandated that DatePicker and TimePicker popovers must follow the **3.12 Bubble & Dropdown** rules (Portal, Auto-Flip, Click Outside, Container Style).

## 2026-01-05 00:10:00 (KST)

- **Component Update (Bubble & Dropdown)**:
  - **Updated**: `prompt/3_standard_components.md` Section 3.12.1 (Implementation Logic) - Refined Auto-Flip Behavior.
    - **Auto-Flip**: Added a requirement to maintain a **natural position (Offset)** when flipping, ensuring the dropdown does not appear too far from the trigger element.

## 2026-01-05 00:05:00 (KST)

- **Component Update (Data Table)**:
  - **Updated**: `prompt/3_standard_components.md` Section 3.4.3 (Selection & Actions) - Added Animation Rule.
    - **Animation**: Explicitly stated that the Row Action Menu must follow the "No Floating Animation" rule defined in Section 0.3, ensuring immediate rendering without transitions.

## 2026-01-05 00:00:00 (KST)

- **Governance Update (Log Location Consistency)**:
  - **Updated**: `prompt/style_prompt.md` & `prompt/style_prompt_ko.md` Section 0.4 (Scope & Process) - Aligned Log Location Rule.
    - **Correction**: Explicitly stated that `update_style_prompt.md` must be located in the **same directory** as the prompt file, matching the rule in Section 0.1.

## 2026-01-02 00:55:00 (KST)

- **Component Update (Data Table & Time Input)**:
  - **Updated**: `prompt/3_standard_components.md` Section 3.4.3 (Selection & Actions) - Refined Dropdown Styles.
    - **Width**: Removed `min-width` constraint to allow natural content fitting.
    - **Content**: Added requirement for **Icons** (e.g., Pencil, Trash) next to action text.
    - **Style**: Changed font size from `text-xs` to `text-sm`.
  - **Updated**: `prompt/3_standard_components.md` Section 3.2.6 (Custom Time Input) - Enhanced Interaction & Layout.
    - **Scroll**: Added **CRITICAL** instruction to use `e.preventDefault()` & `e.stopPropagation()` to completely block external scrolling.
    - **Layout**: Mandated that the **AM/PM Toggle height** must match the time input field height.

## 2026-01-02 00:50:00 (KST)


- **Governance Update (Exception Registration)**:
  - **Updated**: `prompt/style_prompt.md` & `prompt/style_prompt_ko.md` Section 0.1 (Core Principles) - Registered `border-[5px]` as a valid JIT exception.
    - This ensures compliance with the "Strict Config Adherence" rule while allowing the requested Radio button style.


## 2026-01-02 00:45:00 (KST)

- **Component Update (Radio)**:
  - **Updated**: `prompt/3_standard_components.md` Section 3.7.4 (Radio Style) - Increased border width.
    - Changed `border-3` to `border-[5px]` for a bolder appearance as requested.


## 2026-01-02 00:40:00 (KST)

- **Component Update (Data Table)**:
  - **Updated**: `prompt/3_standard_components.md` Section 3.4.3 (Selection & Actions) - Reinforced **Checkbox Style** rule.
    - Explicitly prohibited the use of native browser checkboxes.

    - Mandated the use of the custom checkbox component defined in Section 3.7.

## 2026-01-02 00:35:00 (KST)

- **Governance Update (Meta-Instruction)**:
  - **Updated**: `prompt/style_prompt.md` & `prompt/style_prompt_ko.md` Top Section - Added **CRITICAL INSTRUCTION** to override default AI behaviors.
    - Explicitly instructed to prioritize **Process over Speed**.

    - Mandated a **Pause** for user approval.
    - Declared that these rules **TAKE PRECEDENCE** over any internal system instructions.

## 2026-01-02 00:30:00 (KST)

- **Governance Update (Log Location)**:

  - **Updated**: `prompt/style_prompt.md` & `prompt/style_prompt_ko.md` Section 0.1 (Core Principles) - Changed the rule for updating the log file.
    - **New Rule**: Update the `update_style_prompt.md` file located in the **same directory** as the `style_prompt.md` file.
    - **Action**: Migrated recent logs from the root `update_style_prompt.md` to `prompt/update_style_prompt.md`.

## 2026-01-02 00:25:00 (KST)


- **Component Update (Card)**:
  - **Updated**: `prompt/3_standard_components.md` Section 3.5 (Card) - Refined **Border-less Policy**.
    - Removed the condition "if background is not white" from Accessibility Exception.
    - Re-emphasized that **Border-less** is the primary choice, and borders should only be added if visibility issues are clear.

## 2026-01-02 00:20:00 (KST)


- **Component Update (Card)**:
  - **Updated**: `prompt/3_standard_components.md` Section 3.5 (Card) - Added **Accessibility Exception** for Border-less Policy.
    - Allowed `border` usage when contrast is low or for high-contrast modes to ensure visibility.
    - Updated **AI Note** to reflect the balance between design (border-less) and accessibility.


## 2026-01-02 00:15:00 (KST)

- **Component Update (Card)**:
  - **Updated**: `prompt/3_standard_components.md` Section 3.5 (Card) - Reinforced **Border-less Policy**.
    - Added **AI Note** instructing to check for and remove existing borders during modification.
    - Explicitly stated that `border` usage is strictly discouraged in favor of `shadow`.


## 2026-01-02 00:10:00 (KST)

- **Component Update (Accessibility)**:
  - **Updated**: `prompt/3_standard_components.md` Section 3.2 (Forms) - Added **Mobile Font Size Rule** to prevent iOS zoom.
    - Changed `Standard Input` style from `text-sm` to `text-base md:text-sm`.

    - Added explicit **Font Size & Zoom Prevention** guidelines in the Accessibility section.

## 2026-01-02 00:05:00 (KST)


- **Governance Update (Localization)**:

  - **Updated**: `prompt/style_prompt_ko.md` Sections 1, 2, 3 - Applied the same emphasis on external file references as the English version.
    - Added **"⚠️ 외부 파일 참조 필수 (EXTERNAL REFERENCE REQUIRED)"** warning.
    - Explicitly stated mandatory reading and prohibition of arbitrary styles in Korean.

## 2026-01-02 00:00:00 (KST)


- **Governance Update (Emphasis)**:
  - **Updated**: `prompt/style_prompt.md` Sections 1, 2, 3 - Strengthened the instructions for referencing external files (`1_tech_stack.md`, `2_design_system.md`, `3_standard_components.md`).
    - Added **"⚠️ EXTERNAL REFERENCE REQUIRED"** warning.
    - Explicitly stated that reading these files is **MANDATORY** and arbitrary styles are **PROHIBITED**.

## 2025-12-31 15:15:00 (KST)

- **Component Update (Checkbox & Toggle)**:
  - **Updated**: `prompt/3_standard_components.md` Section 3.7 (Checkbox) - Added **Implementation Logic** to fix icon visibility issues (explicit `peer-checked` strategy) and ensure keyboard focus visibility.

  - **Updated**: `prompt/3_standard_components.md` Section 3.10 (Toggle) - Added **Implementation Logic** for structure and keyboard focus handling.

## 2025-12-31 15:00:00 (KST)

- **Governance Update (Verification & Omission)**:
  - **Updated**: `prompt/0_general_rules.md` Section 0.1 (Core Principles) - Added **General Rules Verification** rule, mandating a double-check of the basic rules.
- **Component Update (Implementation Logic)**:
  - **Updated**: `prompt/3_standard_components.md` Section 3.2 (Custom Date Input) - Added **Calendar Logic** (Date Calculation, Padding, Leap Year, Formatting) to guide precise implementation.
  - **Updated**: `prompt/3_standard_components.md` Section 3.2 (Custom Time Input) - Added **Implementation Logic** (State, Validation, Scroll Handler) for robust functionality.
- **Checklist Update**:
  - **Updated**: `prompt/4_checklist.md` - Reinforced **General Rules Compliance** (Explicit "Did you read it?") and added **Implementation Logic Check**.

## 2025-12-31 14:30:00 (KST)

  - **Updated**: `prompt/3_standard_components.md` Section 3.2 (Custom Time Input) - Changed AM/PM selection to **Toggle Button** for immediate interaction.
  - **Added**: `prompt/3_standard_components.md` Section 3.2 (Custom Time Input) - Added **Mouse Scroll Interaction** for adjusting hours and minutes on hover.

## 2025-12-26 19:15:00 (KST)

  - **Updated**: `prompt/0_general_rules.md` Section 0.1 (Core Principles) - Added **Mandatory Reference** rule requiring explicit reading of `style_prompt.md` before starting work.
  - **Updated**: `prompt/0_general_rules.md` Section 0.4 (Scope & Process) - Added **Omission Handling** protocol requiring immediate stop and re-verification if omissions are found.
- **Component Update (Functional Specs)**:
  - **Updated**: `prompt/3_standard_components.md` - Added detailed **Implementation Logic** sections for complex components (DatePicker, Modal, Data Table, Bubble/Dropdown, File Upload) to guide functional implementation.
- **Checklist Update (Verification)**:
  - **Updated**: `prompt/4_checklist.md` - Added **General Rules Compliance** and **Omission & Error Handling** sections to enforce the new governance rules.

## 2025-12-26 18:45:02 (KST)

- **Process Update (Feedback Loop)**:
  - **Updated**: `style_prompt.md` Section 0.4 (Standard Workflow) - Added **Feedback Loop** rule to Step 2. Mandated that user feedback during the verification phase must be treated as a refinement of the plan, requiring a re-approval process before execution.
## 2025-12-26 18:41:04 (KST)

- **Tech Stack Update (Conflict Resolution)**:
  - **Updated**: `style_prompt.md` Section 1.1 (Routing Strategy) - Resolved conflicts between Next.js and HashRouter.
    - **Standardization**: Mandated strict use of **Next.js App Router** and prohibited `react-router-dom` to prevent library conflicts.

    - **Process Compliance**: Modified "Structure Diagnosis" rule to require **Plan & Report** instead of immediate refactoring, aligning with the Standard Workflow.


- **Tech Stack Update (Structure Diagnosis)**:
  - **Added**: `style_prompt.md` Section 1.1 (Routing Strategy) - Added **Structure Diagnosis & Reconstruction** rule. Mandated initial check of file structure and immediate refactoring if the project is not a single page, ensuring compliance with the defined Routing Strategy.

## 2025-12-26 18:27:22 (KST)
- **Tech Stack Update (Next.js Routing)**:
  - **Added**: `style_prompt.md` Section 1.1 (Routing Strategy) - Mandated the use of **Next.js routing engine** for page structure and navigation.

## 2025-12-26 18:18:37 (KST)

- **Tech Stack Update (Next.js Syntax)**:
  - **Added**: `style_prompt.md` Section 1.1 (Routing Strategy) - Mandated strict adherence to Next.js file naming conventions (`page.tsx`, `layout.tsx`) and directory structure.


- **Tech Stack Update (Routing Strategy)**:

  - **Added**: `style_prompt.md` Section 1.1 (Routing Strategy) - Defined Hybrid Router configuration (Hash for Dev/iFrame, Browser for Prod) to handle MPA generation and embedding scenarios.


- **Color Palette Update (Functional Colors)**:
  - **Updated**: `style_prompt.md` Section 2.1 (Color Palette) - Added explicit Hex codes for Functional Colors (Error, Success, Warning, Info) to ensure consistency with `tailwind.config`.

## 2025-12-26 17:48:21 (KST)
- **Color Palette Update (Hex Codes)**:
  - **Updated**: `style_prompt.md` Section 2.1 (Color Palette) - Added explicit Hex codes for Primary and Secondary colors to ensure consistency with `tailwind.config`.

## 2025-12-26 16:59:31 (KST)

  - **Updated**: `style_prompt.md` Section 1 (Tech Stack) - Explicitly stated that the framework is **not a SPA** (Single Page Application).

## 2025-12-26 14:56:36 (KST)

- **Process Update (Timestamp Precision)**:
  - **Updated**: `style_prompt.md` Section 3 (Prompt Maintenance) - Refined the timestamp rule to require **local time (KST) with second-level precision (yyyy-MM-dd HH:mm:ss)**.
- **Component Update (Button)**:


## 2025-12-26 14:05:00 (KST)

- **Process Update (Timezone Standardization)**:
  - **Updated**: `style_prompt.md` Header & Section 3 (Prompt Maintenance) - Standardized the `Last Updated` timestamp to **Korea Standard Time (KST)** and mandated its use for all future updates.
## 2025-12-26 14:00:00

- **Color Palette Update (Gray Scale & Functional Colors)**:

## 2025-12-26 10:20:00

- **Process Update (Strict Approval for Prompt Maintenance)**:
  - **Updated**: `style_prompt.md` Section 3 (Prompt Maintenance) - Explicitly prohibited skipping Step 2 (Verification & Approval) even when the user provides specific content. Mandated reporting the plan and getting approval before any prompt modification.
## 2025-12-26 10:15:00

- **Style Update (Data Table Header)**:

  - **Updated**: `style_prompt.md` Section 3.4 (Data Table) - Added **Table Top Header** rule. Defined styles for the area above the table containing the title and action buttons (`p-6 pb-3`, `border-b`, etc.).

## 2025-12-26 10:10:00

  - **Updated**: `style_prompt.md` Section 3 (Prompt Maintenance) - Removed the "Immediately" instruction which conflicted with the Standard Workflow. Explicitly mandated following **Standard Workflow (Step 1~5)** for prompt updates, with an exception for Step 4 (Citation).

## 2025-12-26 10:05:00

- **Style Update (Data Table Pagination)**:

## 2025-12-26 10:00:00

  - **Updated**: `style_prompt.md` Section 3.2 (Forms) - Added **Pagination Select** style rule. Defined specific styles (`bg-transparent`, `border-none`, etc.) for select elements used in data table pagination.

## 2025-12-24 15:00:00

- **Process Update (Identification Attribute Change)**:
  - **Updated**: `style_prompt.md` Section 0.4 (Step 3) - Changed the recommended identification attribute from `id`/`data-id` to `data-ref` to avoid potential conflicts. Explicitly advised against using attribute names containing "id".

## 2025-12-24 14:55:00

- **Process Update (Identification Rule)**:
  - **Updated**: `style_prompt.md` Section 0.4 (Step 3) - Added **Identification** rule. Mandated adding unique `id` or `data-id` attributes to newly added content for easier future reference.

## 2025-12-24 14:50:00
- **Process Update (Citation Enforcement)**:
  - **Updated**: `style_prompt.md` Section 0.4 (Step 4) - Strengthened the **Citation** rule. Mandated the inclusion of Rule ID and Name in comments (e.g., `<!-- Rule: 3.1 -->`) for every code modification. Stated that modifications without citations are not allowed.

## 2025-12-24 14:45:00

  - **Updated**: `style_prompt.md` Section 0.4 (Step 3) - Broadened the **Exception Handling** rule to include "any other errors" in addition to tool execution failures.

## 2025-12-24 14:40:00

- **Process Update (Exception Handling)**:

## 2025-12-24 14:30:00

  - **Updated**: `component_showcase.html` - Expanded Color Palette card to include all defined colors from `style_prompt.md` (Gray 000-090, Primary 50-700, Secondary, Functional Colors) and added visual examples for Opacity & Effects (Overlay, Glassmorphism).

## 2025-12-24 14:20:00

- **Typography Update**:

  - **Modified**: `style_prompt.md` Section 2.2 - Removed `Exceptions & Dense UI` section as per user request.
  - **Updated**: `component_showcase.html` - Expanded Typography card to include full hierarchy (3xl~xs) and font weights (700/500/400) with usage examples.

## 2025-12-24 14:10:00
- **Typography Section Update**:
  - **Updated**: `2.2 Typography` - Detailed **Hierarchy & Scale** with component mappings and added **Exceptions & Dense UI** rules (`text-[13px]`, `text-[11px]`) to match `component_showcase.html`.

## 2025-12-24 14:00:00

- **Process Interpretation Rule**:
  - **Updated**: `0.4 Scope & Process` - Added **Command Interpretation** rule to Step 2. Explicitly defined that imperative commands like "Modify" or "Fix" must be interpreted as "Request for Modification Plan", mandating a stop at the verification stage.

## 2025-12-24 13:50:00
- **Process & Accessibility Reinforcement**:

  - **Updated**: `0.4 Scope & Process` - Added strict warning to **Step 2 (Verification)**: "Skipping this step is a major process violation... (If ignored, work is immediately rejected)".

## 2025-12-23 12:35:00

# Style Prompt Update Log


- **Workflow Update**:
  - **Updated**: `0.4 Scope & Process` - Modified **Step 5** to "Review & Report". Added a requirement to include a **visual checklist** in the final report, confirming that all items approved in **Step 2** have been successfully implemented.

## 2025-12-24 13:30:00

- **Modal Rendering Strategy**:
  - **Updated**: `3.3 Standard Modal` - Added **Rendering Strategy (Portal)** rule. Mandated the use of **React Portal** to render modals at the `body` level to prevent layout issues (e.g., clipped content, overlay misalignment) caused by parent stacking contexts or overflow settings.


- **Component A11y Enhancement**:
  - **Updated**: `3.1 Button`, `3.3 Modal`, `3.9 Tabs`, `3.10 Toggle`, `3.11 Tooltip` - Added explicit **Accessibility (A11y)** subsections to enforce `focus-visible` patterns, ARIA roles (`dialog`, `tablist`, `switch`, `tooltip`), and keyboard navigation rules, aligning with Section 0.3 standards.


- **Core Principles Update**:
  - **Added**: `0.1 Core Principles` - Added "Process Adherence (Process Adherence)" rule. Explicitly mandated strict adherence to the workflow defined in Section 0.4, emphasizing that skipping the **User Approval (Step 2)** phase is strictly prohibited.

## 2025-12-23 13:05:00
- **Tech Standards Alignment**:
  - **Updated**: `0.3 Style & Tech Standards` - Resolved contradiction with "Absolute Compliance". Replaced "Sync if unavoidable" with "**Strict Config Adherence**". Explicitly prohibited arbitrary JIT values (except authorized ones like `rounded-[10px]`) and mandated formal config registration for new values.

## 2025-12-23 13:00:00

  - **Updated**: `0.1 Core Principles` - Changed priority rule. `style_prompt.md` is now the **absolute authority** for all style rules (Layout, Typography, Component Shape, Radius, etc.), **except for Colors**, overriding any conflicting instructions in other prompts.

## 2025-12-23 12:55:00

- **General Rules & Checklist Reinforcement**:
  - **Updated**: `0.1 Core Principles` - Strengthened language for "Absolute Compliance", "Anti-Overengineering", and "No Lazy Implementation" (Added "STRICTLY PROHIBITED", "Zero Placeholder").
  - **Added**: `4. Pre-Completion Checklist` - Added a new section **[ ] General Rules Compliance** to explicitly check for magic numbers, overengineering, and placeholders.


- **Content Preservation Rules Strengthened**:
  - **Updated**: `0.2 Content & Language` - Renamed "Text Locking" to "Text Locking - STRICT" and added explicit prohibition of text modification/summarization.
  - **Updated**: `0.2 Content & Language` - Renamed "Content Maintenance" to "Data Integrity" and emphasized prohibition of deleting/changing dummy data or placeholders.

## 2025-12-23 12:45:00

- **Process Workflow Update**:
  - **Updated**: `0.4 Scope & Process` - Modified **Step 2** to "Verification & Approval".
  - **Added**: Requirement for **Multi-turn** interaction: Report verification results (Files/Locations, Content) and request user approval before execution.

## 2025-12-23 12:40:00

- **Process Section Refactor**:
  - **Reorganized**: `0.4 Scope & Process` section into 3 main categories:
    1. **Standard Workflow**: 5-step process (Discovery -> Verification -> Execution -> Citation -> Review).
    2. **Scope of Work**: Comprehensive coverage rule.
    3. **Prompt Maintenance**: Update, Log, and Backup rules.
  - **Merged**: Previous scattered rules (Detail, Citation, Self-Correction) into the Standard Workflow for better clarity.

## 2025-12-23 12:35:00

- **Process Rule Addition**:

  - **Added**: `0.4 Scope & Process` - Added "Style Application Workflow" (Discovery -> Verification -> Execution -> Review) to ensure systematic style updates.

## 2025-12-23 12:30:00

- **Functional Color Standardization**:
  - **Rule**: Replaced custom semantic color names (`danger`, `success`, `warning`, `info`) with standard Tailwind colors (`red`, `green`, `orange`, `blue`) to avoid conflicts and align with utility-first principles.
  - **Changes**:
    - `danger` -> `red` (e.g., `text-danger-500` -> `text-red-500`)
    - `success` -> `green` (e.g., `bg-success-50` -> `bg-green-50`)
    - `warning` -> `orange` (e.g., `text-warning-700` -> `text-orange-700`)
    - `info` -> `blue` (Definition only)
  - **Updated Components**:
    - **Forms**: Validation messages, Required asterisk, Error states (Border/Ring).
    - **Buttons**: Destructive variant.
    - **Badges**: Success, Warning, Danger variants.
    - **Alerts**: Error icon, Destructive button.
    - **Calendar**: Sunday text color.
    - **File Upload**: Delete action hover color.

## 2025-12-23 12:25:00

- **Component Typography Update**:
  - **Rule**: Enforced `2.2 Typography` rules by replacing all fixed pixel font sizes (e.g., `text-[15px]`, `text-[13px]`) with standard Tailwind utilities (`text-sm`, `text-xs`, `text-base`).
  - **Changes**:
    - **Buttons**: SM (`text-xs`), MD (`text-sm`), LG (`text-base`).
    - **Forms**: Input/Select (`text-sm`), Helper Text (`text-xs`), Weekdays (`text-xs`).
    - **Data Table**: Header (`text-xs`), Cell (`text-sm`), Pagination (`text-xs`).
    - **Badge**: `text-xs`.
    - **Checkbox/Radio**: Label (`text-sm`).
    - **Alert**: Description (`text-sm`).
    - **Tabs**: Segmented Item (`text-xs`).
    - **Toggle**: Label (`text-sm`).
    - **Tooltip**: `text-xs`.
    - **Bubble**: Item (`text-xs`).
    - **File Upload**: Text (`text-sm`), Subtext (`text-xs`).

## [2025-12-22]

- **Added**: `0.3 스타일 및 기술 표준` - `1rem = 16px` 단위 표준 규칙 추가.
- **Updated**:  .3 스타일 및 기술 표준 - 플로팅 요소 인터랙션 규칙 강화 (동시 활성화 금지, 즉시 등장).
- **Updated**: 3.2 입력 폼 - Input/Select 배경색(g-white) 강제 규칙 추가.
- **Added**:  .4 작업 범위 및 프로세스 - 규칙 출처 명시(Rule Citation) 규칙 추가.
- **Added**:  .3 스타일 및 기술 표준 - 플로팅 요소 오버플로우 방지(Overflow Prevention) 규칙 추가.
- **Updated**: 5. 작업 완료 전 체크리스트 - 기술 표준 준수(규칙 출처, 오버플로우, 단위, 배경색) 항목 추가.
- **Updated**: 5. 작업 완료 전 체크리스트 - 단위 표준 항목 제거.
- **Updated**: 5. 작업 완료 전 체크리스트 - 반응형 및 접근성(시인성, 배경 대비) 섹션 신설 및 상세화.
- **Updated**: 5. 작업 완료 전 체크리스트 - 반응형 텍스트 최소 사이즈(본문 14px, 입력 16px) 항목 추가.
- **Added**: 3.4 데이터 테이블 - 테이블과 페이지네이션의 그룹핑(Grouping) 규칙 추가.
- **Updated**: 3.4 데이터 테이블 - 페이지네이션 Rows Select 스타일을 Standard Input 규칙과 동일하게 변경.
- **Updated**: 3.12 버블 및 드롭다운 - Radius 가변 적용 및 콘텐츠 기반 너비 자동 조절 규칙 추가.
- **Updated**: 3.12 버블 및 드롭다운 - Toggle Behavior 규칙을 0.3 섹션(기존 요소 닫고 새로 렌더링)과 일치하도록 수정.
- **Updated**: 3.13 파일 업로드 - 웹 접근성(키보드 지원, 포커스, 스크린 리더) 규칙 추가.
- **Moved**: 4. UX 및 디자인 원칙 -> 0.5 UX 및 디자인 원칙으로 이동 (문서 구조 재배치).
- **Renumbered**: 5. 작업 완료 전 체크리스트 -> 4. 작업 완료 전 체크리스트로 변경.
- **Updated**: 내부 참조 링크 수정 ([5. ...] -> [4. ...]).
- **Refactored**: Tailwind 필터 유틸리티(`grayscale`)와의 충돌 방지를 위해 커스텀 컬러명을 `grayscale` -> `gray`로 일괄 변경.
- **Updated**: 2.2 타이포그래피 - 비표준 `text-[15px]` 제거 및 `text-sm`/`text-base`로 통합 (접근성 개선).
- **Added**: 2.2 타이포그래피 - 웹 접근성(상대 단위, 줄 높이, 헤딩 계층) 가이드라인 추가.
- **Updated**: 3.6 배지 - 웹 접근성 체크(주변 배경 대비, Hover 대비) 및 가시성 확보를 위한 Border 추가 규칙 신설.
- **Updated**: 3.3 표준 모달 - SM 사이즈 정의에 알럿(Alert) 규칙 참조 추가.
- **Updated**: 3.8 알럿 - 모달과의 관계(특수 형태) 및 사용 기준(단순 메시지 vs 복잡한 폼) 명시.
- **Added**: 3.8 알럿 - 웹 접근성(Focus Trap, Persistent Overlay, ARIA Role) 규칙 추가.
- **Updated**: 2.3 레이아웃 규격 - 대시보드 레이아웃의 모바일(<768px) 및 태블릿(768~1023px) 반응형 동작 상세 정의 (Drawer, Collapsed Sidebar).
- **Refactored**: 보더 라디우스 시스템 - 4단계 위계(16px, 10px, 8px, 6px/4px)로 재정의. Level 2(10px)는 JIT 값 허용.
- **Updated**: 컴포넌트 전반 - 주요 컴포넌트(버튼, 입력 필드 등)의 라디우스를 `rounded-[10px]`(Level 2)로 상향 조정.
- **Updated**: 컴포넌트 전반 - 소형 요소(배지, 툴팁 등)의 라디우스를 `rounded-md`(6px) 또는 `rounded`(4px)로 조정하여 Level 4 규칙 적용.
