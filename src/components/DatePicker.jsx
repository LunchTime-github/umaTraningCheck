// Rule: 3.2.5 Custom Date Input
// Rule: 3.12 Bubble & Dropdown (Portal, Auto-Flip, Click Outside)
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const POP_W = 284;
const POP_H_EST = 340;

// Rule: 3.2.5 — YYYY-MM-DD → YYYY년 M월 D일
function formatDisplay(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${y}년 ${parseInt(m, 10)}월 ${parseInt(d, 10)}일`;
}

// Rule: 3.2.5 — Formatting: YYYY-MM-DD
function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getDaysInMonth(year, month) {
  // Rule: 3.2.5 — Leap Year 자동 처리 (new Date(y, m+1, 0))
  return new Date(year, month + 1, 0).getDate();
}

function getTodayStr() {
  const t = new Date();
  return toDateStr(t.getFullYear(), t.getMonth(), t.getDate());
}

export default function DatePicker({ value, onChange, placeholder = "날짜 선택", disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  // Rule: 3.2.5 — State: view ('day' | 'year'), displayDate, yearPage
  const [view, setView] = useState("day");
  const [displayDate, setDisplayDate] = useState(() => (value ? new Date(value + "T00:00:00") : new Date()));
  const [yearPage, setYearPage] = useState(() => {
    const y = value ? parseInt(value.slice(0, 4), 10) : new Date().getFullYear();
    return Math.floor(y / 12) * 12;
  });
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const triggerRef = useRef(null);
  const popRef = useRef(null);
  const today = getTodayStr();

  // Rule: 3.12.1 — Smart Positioning (Flip & Shift) with getBoundingClientRect
  const calcPos = useCallback(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const flipUp = r.bottom + POP_H_EST > vh && r.top > POP_H_EST;
    let left = r.left;
    if (left + POP_W > window.innerWidth - 8) left = window.innerWidth - POP_W - 8;
    if (left < 8) left = 8;
    setPos({ top: flipUp ? r.top - POP_H_EST - 4 : r.bottom + 4, left });
  }, []);

  const handleOpen = () => {
    if (disabled) return;
    if (value) {
      const d = new Date(value + "T00:00:00");
      setDisplayDate(d);
      setYearPage(Math.floor(d.getFullYear() / 12) * 12);
    } else {
      setDisplayDate(new Date());
      setYearPage(Math.floor(new Date().getFullYear() / 12) * 12);
    }
    setView("day");
    calcPos();
    setIsOpen(true);
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Rule: 3.12.1 — Click Outside, ESC, Scroll/Resize (Portal mode)
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e) => {
      if (
        popRef.current &&
        !popRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      )
        handleClose();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
        triggerRef.current?.focus();
      }
    };
    // Rule: 3.2.5 — Portal 모드: scroll/resize 이벤트 등록
    const onScroll = () => calcPos();
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", calcPos);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", calcPos);
    };
  }, [isOpen, handleClose, calcPos]);

  // Rule: 3.2.5 — Calendar Logic
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month === 0 ? 11 : month - 1);

  // Rule: 3.2.5 — Padding Days (달력은 항상 일요일부터)
  const cells = [];
  for (let i = 0; i < firstDow; i++) {
    cells.push({ day: prevMonthDays - firstDow + 1 + i, type: "pad" });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: "cur" });
  }
  const trailing = cells.length % 7;
  if (trailing > 0) {
    for (let i = 1; i <= 7 - trailing; i++) {
      cells.push({ day: i, type: "pad" });
    }
  }

  // Rule: 3.2.5 — Year Grid (12개, 3x4)
  const yearGrid = Array.from({ length: 12 }, (_, i) => yearPage + i);

  // Rule: 3.12.2 — Container Style (Portal, fixed positioning)
  const popover = isOpen
    ? createPortal(
        <div
          ref={popRef}
          role="dialog"
          aria-modal="true"
          aria-label="날짜 선택"
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            width: POP_W,
            backgroundColor: "#fff",
            border: "1px solid #ececee", // gray-010
            borderRadius: 16, // Level 1
            boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
            padding: "12px",
            zIndex: 9999,
          }}
        >
          {/* ── Day View ── */}
          {view === "day" && (
            <>
              {/* Rule: 3.2.5 — Header: YYYY년 M월, ChevronLeft/Right */}
              <div className="d-flex align-items-center justify-content-between mb-2">
                <button
                  type="button"
                  className="btn btn-outline-neutral btn-sm py-1 px-2"
                  onClick={() => setDisplayDate(new Date(year, month - 1, 1))}
                  aria-label="이전 달"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  className="fw-bold"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    color: "#272929",
                    borderRadius: 6,
                    padding: "2px 10px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setView("year");
                  }}
                >
                  {year}년 {month + 1}월
                </button>
                <button
                  type="button"
                  className="btn btn-outline-neutral btn-sm py-1 px-2"
                  onClick={() => setDisplayDate(new Date(year, month + 1, 1))}
                  aria-label="다음 달"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Rule: 3.2.5 — Weekdays: 일~토, 일=red */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 2 }}>
                {WEEKDAYS.map((w, i) => (
                  <div
                    key={w}
                    style={{
                      textAlign: "center",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      padding: "2px 0",
                      color: i === 0 ? "#ef4444" : "#b0b3b3",
                    }}
                  >
                    {w}
                  </div>
                ))}
              </div>

              {/* Rule: 3.2.5 — Days Grid (7컬럼) */}
              <div role="grid" style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
                {cells.map((cell, idx) => {
                  if (cell.type === "pad") {
                    return <div key={idx} style={{ height: 36 }} />;
                  }
                  const ds = toDateStr(year, month, cell.day);
                  const isSel = ds === value;
                  const isTod = ds === today;
                  return (
                    // Rule: 3.2.5 — Day Item: w-9 h-9 circle, Selected/Today/Default
                    <button
                      key={idx}
                      type="button"
                      role="gridcell"
                      aria-selected={isSel}
                      aria-current={isTod ? "date" : undefined}
                      aria-label={`${year}년 ${month + 1}월 ${cell.day}일`}
                      onClick={() => {
                        onChange(ds);
                        handleClose();
                      }}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "1px auto",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        fontWeight: isSel ? 700 : 400,
                        backgroundColor: isSel ? "#5cc29b" : isTod ? "#ebf9f5" : "transparent",
                        color: isSel ? "#fff" : isTod ? "#4ab08a" : "#3f4141",
                        boxShadow: isSel ? "0 2px 6px rgba(92,194,155,0.35)" : "none",
                        outline: "none",
                        transition: "background-color 0.1s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSel) e.currentTarget.style.backgroundColor = isTod ? "#d6f5ec" : "#f6f6f7";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isSel ? "#5cc29b" : isTod ? "#ebf9f5" : "transparent";
                      }}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Year View ── */}
          {view === "year" && (
            <>
              {/* Rule: 3.2.5 — Year Header: 12년 단위 페이지 이동 */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <button
                  type="button"
                  className="btn btn-outline-neutral btn-sm py-1 px-2"
                  onClick={() => setYearPage((p) => p - 12)}
                  aria-label="이전 연도 그룹"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="fw-bold" style={{ fontSize: "0.9rem", color: "#272929" }}>
                  {yearPage} ~ {yearPage + 11}
                </span>
                <button
                  type="button"
                  className="btn btn-outline-neutral btn-sm py-1 px-2"
                  onClick={() => setYearPage((p) => p + 12)}
                  aria-label="다음 연도 그룹"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Rule: 3.2.5 — Year Grid (12개, 3x4) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                {yearGrid.map((y) => {
                  const isCur = y === year;
                  const isSel = value && parseInt(value.slice(0, 4), 10) === y;
                  return (
                    <button
                      key={y}
                      type="button"
                      // Rule: 3.2.5 — stopPropagation 필수
                      onClick={(e) => {
                        e.stopPropagation();
                        setDisplayDate(new Date(y, month, 1));
                        setView("day");
                      }}
                      style={{
                        padding: "8px 0",
                        borderRadius: 8,
                        border: "none",
                        fontSize: "0.85rem",
                        fontWeight: isCur ? 700 : 400,
                        cursor: "pointer",
                        color: isSel ? "#fff" : isCur ? "#5cc29b" : "#3f4141",
                        backgroundColor: isSel ? "#5cc29b" : isCur ? "#ebf9f5" : "#f6f6f7",
                        outline: "none",
                        transition: "background-color 0.1s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSel) e.currentTarget.style.backgroundColor = "#ececee";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isSel ? "#5cc29b" : isCur ? "#ebf9f5" : "#f6f6f7";
                      }}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>,
        document.body,
      )
    : null;

  return (
    // Rule: 3.2.5 — Trigger: form-control 스타일, 포커스 링
    <div style={{ position: "relative", width: "100%" }}>
      <button
        ref={triggerRef}
        type="button"
        className="form-control form-control-sm d-flex align-items-center gap-1 text-start"
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          color: value ? "#3f4141" : "#b0b3b3",
          userSelect: "none",
        }}
        onClick={handleOpen}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Calendar size={13} style={{ color: "#b0b3b3", flexShrink: 0 }} />
        <span>{value ? formatDisplay(value) : placeholder}</span>
      </button>
      {popover}
    </div>
  );
}
