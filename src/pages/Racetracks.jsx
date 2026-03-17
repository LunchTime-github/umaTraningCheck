// Rule: 3.2.5 Custom Date Input
// Rule: 3.0 커스텀 Alert
import { useState, useEffect } from "react";
import { useStore } from "../hooks/useStore";
import { useToast } from "../context/ToastContext";
import { getDistanceCategory } from "../utils";
import { confirmDelete } from "../utils/swal";
import DatePicker from "../components/DatePicker";
import {
  Flag,
  ExternalLink,
  Plus,
  Trash2,
  Calendar,
  Tag,
  Layers,
  Ruler,
  RotateCw,
  CloudSun,
  Droplets,
  Sun,
  PlusCircle,
  User,
  Calculator,
  Copy,
} from "lucide-react";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 30;

const RACECOURSE_NAMES = [
  "삿포로",
  "하코다테",
  "니가타",
  "후쿠시마",
  "나카야마",
  "도쿄",
  "츄쿄",
  "교토",
  "한신",
  "코쿠라",
  "오이",
  "가와사키",
  "후나바시",
  "모리오카",
  "롱샹",
  "산타 아니타 팍",
  "델 마",
];

// Rule: 거리 입력 범위 (number input)
const DISTANCE_MIN = 800;
const DISTANCE_MAX = 4000;

const WEATHER_OPTIONS = ["맑음", "흐림", "비오는 날", "눈오는 날"];
const CONDITION_OPTIONS = ["양호", "다습", "포화", "불량"];
const RUN_STYLES = ["도주", "선행", "선입", "추입"];
const SEASON_OPTIONS = ["봄", "여름", "가을", "겨울"];

// ── 뱃지 색상 매핑 ──
const DIST_BADGE = {
  단거리: "badge-dist-short",
  마일: "badge-dist-mile",
  중거리: "badge-dist-middle",
  장거리: "badge-dist-long",
};
const DIR_BADGE = { 시계: "badge-dir-cw", 반시계: "badge-dir-ccw" };
const WEATHER_BADGE = {
  맑음: "badge-weather-sunny",
  흐림: "badge-weather-cloudy",
  "비오는 날": "badge-weather-rainy",
  "눈오는 날": "badge-weather-snowy",
};
const CONDITION_BADGE = {
  양호: "badge-cond-good",
  다습: "badge-cond-damp",
  포화: "badge-cond-sat",
  불량: "badge-cond-bad",
};
const TIME_BADGE = { 낮: "badge-time-day", 밤: "badge-time-night" };
const SURFACE_BADGE = { 잔디: "badge-surf-turf", 더트: "badge-surf-dirt" };
function distBadgeClass(dist) {
  return DIST_BADGE[getDistanceCategory(dist)] || "bg-secondary";
}

function makeEmptyUma() {
  return {
    name: "",
    link: "",
    runStyle: "도주",
    parents: [
      {
        name: "",
        link: "",
        grandparents: [
          { name: "", link: "" },
          { name: "", link: "" },
        ],
      },
      {
        name: "",
        link: "",
        grandparents: [
          { name: "", link: "" },
          { name: "", link: "" },
        ],
      },
    ],
  };
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getUmaList(rt) {
  const base = rt?.umaList ? deepClone(rt.umaList) : [];
  while (base.length < 3) base.push(makeEmptyUma());
  return base;
}

const EMPTY_FORM = {
  type: "챔피언스미팅",
  season: "봄",
  startDate: "",
  racecourse: "",
  surface: "잔디",
  distance: "",
  direction: "시계",
  weather: "맑음",
  condition: "양호",
  time: "낮",
};

export default function Racetracks() {
  const { data, load, add, remove, update } = useStore("racetracks");
  const { data: records, load: loadRecords } = useStore("records");
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedRt, setSelectedRt] = useState(null);
  const [editUmaIdx, setEditUmaIdx] = useState(null);
  const [umaForm, setUmaForm] = useState(null);
  const [page, setPage] = useState(1);
  const [nameSearch, setNameSearch] = useState("");
  const [showNameDrop, setShowNameDrop] = useState(false);

  useEffect(() => {
    load();
    loadRecords();
  }, []);

  // data 변경 시 selectedRt 동기화
  useEffect(() => {
    if (selectedRt) {
      const updated = data.find((d) => d.id === selectedRt.id);
      if (updated) setSelectedRt(updated);
    }
  }, [data]); // eslint-disable-line

  const handleSurfaceChange = (surface) => {
    setForm((prev) => ({ ...prev, surface, time: "낮" }));
  };

  const handleSave = async () => {
    if (!form.type) {
      toast("종류를 선택하세요.", "warning");
      return;
    }
    if (!form.racecourse) {
      toast("경기장명을 선택하세요.", "warning");
      return;
    }
    const distNum = parseInt(form.distance, 10);
    if (!form.distance || isNaN(distNum) || distNum < DISTANCE_MIN || distNum > DISTANCE_MAX) {
      toast(`거리를 ${DISTANCE_MIN}~${DISTANCE_MAX} 사이로 입력하세요.`, "warning");
      return;
    }
    if (!form.startDate) {
      toast("시작일을 입력하세요.", "warning");
      return;
    }

    await add({
      type: form.type,
      season: form.season,
      startDate: form.startDate,
      racecourse: form.racecourse,
      surface: form.surface,
      distance: parseInt(form.distance),
      direction: form.direction,
      weather: form.weather,
      condition: form.condition,
      time: form.surface === "잔디" ? "낮" : form.time,
      umaList: [makeEmptyUma(), makeEmptyUma(), makeEmptyUma()],
    });
    setShowModal(false);
    setForm(EMPTY_FORM);
    toast("마장이 등록되었습니다.");
  };

  const handleDelete = async (id) => {
    const hasRecords = records.some((r) => r.racetracksId === id);
    if (hasRecords) {
      toast("훈련기록이 존재하는 마장은 삭제할 수 없습니다.", "warning");
      return;
    }
    if (!(await confirmDelete("이 마장을 삭제하시겠습니까?"))) return;
    await remove(id);
    if (selectedRt?.id === id) setSelectedRt(null);
    toast("삭제되었습니다.", "info");
  };

  const handleRowClick = (rt) => {
    setSelectedRt(rt);
  };

  const handleUmaSlotClick = (idx) => {
    const list = getUmaList(selectedRt);
    const uma = deepClone(list[idx]);
    setUmaForm(uma);
    setNameSearch(uma.name || "");
    setShowNameDrop(false);
    setEditUmaIdx(idx);
  };

  const handleUmaSave = async () => {
    if (!umaForm.name.trim()) {
      toast("우마무스메 이름을 입력하세요.", "warning");
      return;
    }
    const list = getUmaList(selectedRt);
    list[editUmaIdx] = umaForm;
    await update(selectedRt.id, { ...selectedRt, umaList: list });
    setEditUmaIdx(null);
    setUmaForm(null);
    toast("저장되었습니다.");
  };

  const handleUmaDelete = async (idx) => {
    if (!(await confirmDelete("이 우마무스메를 삭제하시겠습니까?"))) return;
    const list = getUmaList(selectedRt);
    list[idx] = makeEmptyUma();
    await update(selectedRt.id, { ...selectedRt, umaList: list });
    toast("삭제되었습니다.", "info");
  };

  const updateUmaForm = (path, value) => {
    setUmaForm((prev) => {
      const next = deepClone(prev);
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  };

  // 시작일 내림차순 정렬
  const sortedData = [...data].sort((a, b) => b.startDate.localeCompare(a.startDate));

  // 출주희망 우마무스메 탭 데이터 기반 등록 목록 (이름 검색 + 전체 데이터 복사)
  const registeredUmas = data.flatMap((rt) =>
    (rt.umaList || [])
      .filter((u) => u.name)
      .map((u) => ({ ...u, _rtLabel: `${rt.racecourse} ${rt.distance}m (${rt.startDate})` })),
  );

  // 기존 등록된 우마무스메 이름 → 링크 맵 (이름 선택 시 링크 자동완성)
  const nameToLink = {};
  data.forEach((rt) => {
    (rt.umaList || []).forEach((u) => {
      if (u.name && u.link && !nameToLink[u.name]) nameToLink[u.name] = u.link;
    });
  });

  return (
    <>
      <div className="page-header">
        <h6>
          <Flag size={15} className="me-1 text-primary" />
          마장
        </h6>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-neutral btn-sm"
            onClick={() => window.electronAPI.shell.openExternal("https://gametora.com/ko/umamusume/racetracks")}
          >
            <ExternalLink size={13} className="me-1" />
            경기장 목록
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={14} className="me-1" />
            등록
          </button>
        </div>
      </div>

      {sortedData.length === 0 ? (
        <div className="empty-state">
          <Flag size={36} className="mb-2 text-muted" />
          <p>
            등록된 마장이 없습니다.
            <br />
            우측 상단 버튼으로 추가하세요.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-sm">
            <thead className="table-light">
              <tr>
                <th>종류</th>
                <th>경기장</th>
                <th>계절</th>
                <th>시작일</th>
                <th>마장</th>
                <th>거리</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((rt) => (
                <tr key={rt.id} style={{ cursor: "pointer" }} onClick={() => handleRowClick(rt)}>
                  <td>
                    <span className={`badge badge-sm ${rt.type === "챔피언스미팅" ? "bg-primary" : "bg-success"}`}>
                      {rt.type === "챔피언스미팅" ? "챔미" : "LoH"}
                    </span>
                  </td>
                  <td>{rt.racecourse}</td>
                  <td>{rt.season || "-"}</td>
                  <td className="td-date">{rt.startDate}</td>
                  <td>{rt.surface}</td>
                  <td>
                    {rt.distance}m<br />
                    <span className={`badge badge-sm text-nowrap ${distBadgeClass(rt.distance)}`}>
                      {getDistanceCategory(rt.distance)}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button className="btn btn-outline-danger btn-sm py-0 px-1" onClick={() => handleDelete(rt.id)}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination total={sortedData.length} page={page} pageSize={PAGE_SIZE} onPage={setPage} />
        </div>
      )}

      {/* ── 마장 등록 모달 ── */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header py-2">
                <h6 className="modal-title">마장 등록</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setForm(EMPTY_FORM);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    종류 <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex gap-3">
                    {["챔피언스미팅", "리그오브히어로즈"].map((t) => (
                      <div key={t} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id={`type-${t}`}
                          value={t}
                          checked={form.type === t}
                          onChange={() => setForm({ ...form, type: t })}
                        />
                        <label className="form-check-label small" htmlFor={`type-${t}`}>
                          {t}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    계절 <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex gap-3">
                    {SEASON_OPTIONS.map((s) => (
                      <div key={s} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id={`season-${s}`}
                          value={s}
                          checked={form.season === s}
                          onChange={() => setForm({ ...form, season: s })}
                        />
                        <label className="form-check-label small" htmlFor={`season-${s}`}>
                          {s}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Rule: 3.2.5 — Custom Date Input */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">시작일</label>
                  <DatePicker
                    value={form.startDate}
                    onChange={(v) => setForm({ ...form, startDate: v })}
                    placeholder="날짜 선택"
                  />
                </div>
                {/* 경기장명 */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    경기장명 <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={form.racecourse}
                    onChange={(e) => setForm({ ...form, racecourse: e.target.value })}
                  >
                    <option value="">-- 선택 --</option>
                    {RACECOURSE_NAMES.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* 마장 */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">마장</label>
                  <div className="d-flex gap-3">
                    {["잔디", "더트"].map((s) => (
                      <div key={s} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id={`surface-${s}`}
                          value={s}
                          checked={form.surface === s}
                          onChange={() => handleSurfaceChange(s)}
                        />
                        <label className="form-check-label small" htmlFor={`surface-${s}`}>
                          {s}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 거리 — number input (800~4000) */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    거리 <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex gap-2 align-items-center">
                    <div className="input-group input-group-sm" style={{ maxWidth: 160 }}>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        min={DISTANCE_MIN}
                        max={DISTANCE_MAX}
                        step={100}
                        placeholder="800 ~ 4000"
                        value={form.distance}
                        onChange={(e) => setForm({ ...form, distance: e.target.value })}
                        onBlur={(e) => {
                          const raw = e.target.value.trim();
                          if (!raw) return;
                          // 1~2자리 구역의 숫자면 뒤에 00 추가
                          const num = parseInt(raw, 10);
                          if (!isNaN(num) && raw.length <= 2) {
                            setForm((prev) => ({ ...prev, distance: String(num * 100) }));
                          }
                        }}
                      />
                      <span className="input-group-text">m</span>
                    </div>
                    {(() => {
                      const d = parseInt(form.distance, 10);
                      if (!form.distance || isNaN(d) || d < DISTANCE_MIN || d > DISTANCE_MAX) return null;
                      return <span className={`badge text-nowrap ${distBadgeClass(d)}`}>{getDistanceCategory(d)}</span>;
                    })()}
                  </div>
                </div>
                {/* 방향 */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">방향</label>
                  <div className="d-flex gap-3">
                    {["시계", "반시계"].map((dir) => (
                      <div key={dir} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id={`dir-${dir}`}
                          value={dir}
                          checked={form.direction === dir}
                          onChange={() => setForm({ ...form, direction: dir })}
                        />
                        <label className="form-check-label small" htmlFor={`dir-${dir}`}>
                          {dir}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 날씨 */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">날씨</label>
                  <select
                    className="form-select form-select-sm"
                    value={form.weather}
                    onChange={(e) => setForm({ ...form, weather: e.target.value })}
                  >
                    {WEATHER_OPTIONS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
                {/* 마장 상태 */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">마장 상태</label>
                  <select
                    className="form-select form-select-sm"
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  >
                    {CONDITION_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                {/* 시간 */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    시간
                    {form.surface === "잔디" && (
                      <span className="text-muted ms-1" style={{ fontWeight: "normal" }}>
                        (잔디는 낮 고정)
                      </span>
                    )}
                  </label>
                  <div className="d-flex gap-3">
                    {["낮", "밤"].map((t) => (
                      <div key={t} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id={`time-${t}`}
                          value={t}
                          checked={form.surface === "잔디" ? t === "낮" : form.time === t}
                          disabled={form.surface === "잔디"}
                          onChange={() => setForm({ ...form, time: t })}
                        />
                        <label
                          className={`form-check-label small${form.surface === "잔디" ? " text-muted" : ""}`}
                          htmlFor={`time-${t}`}
                        >
                          {t}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer py-2">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setShowModal(false);
                    setForm(EMPTY_FORM);
                  }}
                >
                  취소
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleSave}>
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 마장 상세 모달 ── */}
      {selectedRt && editUmaIdx === null && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header py-2">
                <h6 className="modal-title">
                  <Flag size={14} className="me-1 text-primary" />
                  {selectedRt.racecourse} {selectedRt.distance}m
                </h6>
                <button type="button" className="btn-close" onClick={() => setSelectedRt(null)}></button>
              </div>
              <div className="modal-body">
                {/* 기본 정보 */}
                <div className="mb-3">
                  <div className="d-flex align-items-center gap-1 text-muted small mb-2 border-bottom pb-1">
                    <Calendar size={12} />
                    <span>
                      {selectedRt.season && `${selectedRt.season} · `}
                      {selectedRt.startDate}
                    </span>
                  </div>
                  <div className="d-flex flex-wrap gap-1">
                    <span
                      className={`badge d-flex align-items-center gap-1 ${selectedRt.type === "챔피언스미팅" ? "bg-primary" : "bg-success"}`}
                    >
                      <Tag size={10} />
                      {selectedRt.type === "챔피언스미팅" ? "챔피언스미팅" : "리그오브히어로즈"}
                    </span>
                    <span
                      className={`badge d-flex align-items-center gap-1 ${SURFACE_BADGE[selectedRt.surface] || "bg-secondary"}`}
                    >
                      <Layers size={10} />
                      {selectedRt.surface}
                    </span>
                    <span className={`badge d-flex align-items-center gap-1 ${distBadgeClass(selectedRt.distance)}`}>
                      <Ruler size={10} />
                      {selectedRt.distance}m · {getDistanceCategory(selectedRt.distance)}
                    </span>
                    <span
                      className={`badge d-flex align-items-center gap-1 ${DIR_BADGE[selectedRt.direction] || "bg-secondary"}`}
                    >
                      <RotateCw size={10} />
                      {selectedRt.direction}
                    </span>
                    <span
                      className={`badge d-flex align-items-center gap-1 ${WEATHER_BADGE[selectedRt.weather] || "bg-secondary"}`}
                    >
                      <CloudSun size={10} />
                      {selectedRt.weather}
                    </span>
                    <span
                      className={`badge d-flex align-items-center gap-1 ${CONDITION_BADGE[selectedRt.condition] || "bg-secondary"}`}
                    >
                      <Droplets size={10} />
                      {selectedRt.condition}
                    </span>
                    {selectedRt.time && (
                      <span
                        className={`badge d-flex align-items-center gap-1 ${TIME_BADGE[selectedRt.time] || "bg-secondary"}`}
                      >
                        <Sun size={10} />
                        {selectedRt.time}
                      </span>
                    )}
                  </div>
                </div>
                {/* 출주 희망 우마무스메 */}
                <div className="fw-semibold small mb-2">출주 희망 우마무스메</div>
                <div className="d-flex flex-column gap-2">
                  {getUmaList(selectedRt).map((uma, idx) => (
                    <div
                      key={idx}
                      className="card card-body py-2 px-3"
                      style={{ cursor: "pointer", borderStyle: uma.name ? "solid" : "dashed" }}
                      onClick={() => handleUmaSlotClick(idx)}
                    >
                      {uma.name ? (
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-semibold small">{uma.name}</div>
                            <div className="text-muted td-sub">
                              <span className="badge bg-secondary badge-sm me-1">{uma.runStyle}</span>
                              부모: {uma.parents.map((p) => p.name || "-").join(" / ")}
                            </div>
                          </div>
                          <div className="d-flex gap-1">
                            {uma.link && (
                              <>
                                <button
                                  className="btn btn-outline-neutral btn-sm py-0 px-1"
                                  title="URL 복사"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(uma.link);
                                  }}
                                >
                                  <Copy size={13} />
                                </button>
                                <button
                                  className="btn btn-outline-neutral btn-sm py-0 px-1"
                                  title="브라우저에서 열기"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.electronAPI.shell.openExternal(uma.link);
                                  }}
                                >
                                  <ExternalLink size={13} />
                                </button>
                              </>
                            )}
                            <button
                              className="btn btn-outline-danger btn-sm py-0 px-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUmaDelete(idx);
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-muted small py-1">
                          <PlusCircle size={14} className="me-1" />
                          우마무스메 {idx + 1} 추가
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer py-2">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedRt(null)}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 우마무스메 편집 모달 ── */}
      {editUmaIdx !== null && umaForm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header py-2">
                <h6 className="modal-title">
                  <User size={14} className="me-1 text-primary" />
                  우마무스메 {editUmaIdx + 1}
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setEditUmaIdx(null);
                    setUmaForm(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {/* 이름 */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-semibold small mb-0">
                      우마무스메 명 <span className="text-danger">*</span>
                    </label>
                    <button
                      className="btn btn-outline-neutral btn-sm"
                      title="게임토라 우마무스메 목록 열기"
                      onClick={() =>
                        window.electronAPI.shell.openExternal("https://gametora.com/ko/umamusume/characters")
                      }
                    >
                      <ExternalLink size={13} className="me-1" />
                      캐릭터 목록
                    </button>
                  </div>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="이름 입력 또는 훈련기록에서 검색"
                      value={nameSearch}
                      onChange={(e) => {
                        const v = e.target.value;
                        setNameSearch(v);
                        updateUmaForm("name", v);
                        setShowNameDrop(true);
                      }}
                      onFocus={() => setShowNameDrop(true)}
                      onBlur={() => setTimeout(() => setShowNameDrop(false), 150)}
                      autoComplete="off"
                    />
                    {showNameDrop &&
                      (() => {
                        const q = nameSearch.trim().toLowerCase();
                        const suggestions = registeredUmas.filter((u) => q === "" || u.name.toLowerCase().includes(q));
                        if (suggestions.length === 0) return null;
                        return (
                          <ul
                            className="list-unstyled mb-0 border rounded bg-white position-absolute w-100 shadow-sm"
                            style={{ top: "100%", zIndex: 9999, maxHeight: "200px", overflowY: "auto" }}
                          >
                            {suggestions.map((uma, i) => (
                              <li
                                key={i}
                                className="px-2 py-1"
                                style={{ cursor: "pointer" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f4ff")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                                onMouseDown={() => {
                                  setNameSearch(uma.name);
                                  // 이름 + 링크 + 각질 + 부모인자 전체 복사
                                  setUmaForm((prev) => ({
                                    ...prev,
                                    name: uma.name,
                                    link: uma.link || prev.link,
                                    runStyle: uma.runStyle || prev.runStyle,
                                    parents: uma.parents ? JSON.parse(JSON.stringify(uma.parents)) : prev.parents,
                                  }));
                                  setShowNameDrop(false);
                                }}
                              >
                                <div className="small fw-semibold">{uma.name}</div>
                                <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                                  {uma._rtLabel}
                                </div>
                              </li>
                            ))}
                          </ul>
                        );
                      })()}
                  </div>
                  {registeredUmas.length > 0 && (
                    <div className="text-muted" style={{ fontSize: "0.7rem", marginTop: "3px" }}>
                      출주희망 우마무스메 {registeredUmas.length}명에서 검색 가능 (선택 시 전체 데이터 복사)
                    </div>
                  )}
                </div>
                {/* 정보 링크 */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-semibold small mb-0">정보 확인 링크</label>
                  </div>
                  <div className="input-group input-group-sm">
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://..."
                      value={umaForm.link}
                      onChange={(e) => updateUmaForm("link", e.target.value)}
                    />
                    {umaForm.link && (
                      <>
                        <button
                          className="btn btn-outline-neutral btn-sm"
                          title="URL 복사"
                          onClick={() => navigator.clipboard.writeText(umaForm.link)}
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          className="btn btn-outline-neutral btn-sm"
                          title="브라우저에서 열기"
                          onClick={() => window.electronAPI.shell.openExternal(umaForm.link)}
                        >
                          <ExternalLink size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {/* 각질 */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">각질</label>
                  <div className="d-flex gap-3 flex-wrap">
                    {RUN_STYLES.map((s) => (
                      <div key={s} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id={`rs-${s}`}
                          value={s}
                          checked={umaForm.runStyle === s}
                          onChange={() => updateUmaForm("runStyle", s)}
                        />
                        <label className="form-check-label small" htmlFor={`rs-${s}`}>
                          {s}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 부모인자 트리 */}
                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <label className="form-label fw-semibold small mb-0">부모인자</label>
                      <button
                        className="btn btn-outline-neutral btn-sm"
                        title="상성 계산기 (gametora)"
                        onClick={() =>
                          window.electronAPI.shell.openExternal("https://gametora.com/ko/umamusume/compatibility")
                        }
                      >
                        <Calculator size={13} className="me-1" />
                        상성
                      </button>
                    </div>
                    {(() => {
                      const allUmas = data.flatMap((rt) => (rt.umaList || []).filter((u) => u.name));
                      if (allUmas.length === 0) return null;
                      return (
                        <select
                          className="form-select form-select-sm"
                          style={{ width: "auto", maxWidth: "160px" }}
                          value=""
                          onChange={(e) => {
                            const idx = Number(e.target.value);
                            if (isNaN(idx)) return;
                            const src = allUmas[idx];
                            if (src) setUmaForm((prev) => ({ ...prev, parents: deepClone(src.parents) }));
                          }}
                        >
                          <option value="">인자 불러오기...</option>
                          {allUmas.map((u, i) => (
                            <option key={i} value={i}>
                              {u.name}
                            </option>
                          ))}
                        </select>
                      );
                    })()}
                  </div>
                  {/* 조부모 4장 */}
                  <div className="d-flex gap-1 justify-content-center mb-2">
                    {[0, 1].flatMap((pi) =>
                      [0, 1].map((gi) => (
                        <FactorCard
                          key={`gp-${pi}-${gi}`}
                          label={`조부모 ${pi + 1}-${gi + 1}`}
                          name={umaForm.parents[pi].grandparents[gi].name}
                          link={umaForm.parents[pi].grandparents[gi].link}
                          onNameChange={(v) => updateUmaForm(`parents.${pi}.grandparents.${gi}.name`, v)}
                          onLinkChange={(v) => updateUmaForm(`parents.${pi}.grandparents.${gi}.link`, v)}
                        />
                      )),
                    )}
                  </div>
                  {/* 부모 2장 */}
                  <div className="d-flex gap-2 justify-content-center mb-2" style={{ paddingInline: "15%" }}>
                    {[0, 1].map((pi) => (
                      <FactorCard
                        key={`p-${pi}`}
                        label={`부모 ${pi + 1}`}
                        name={umaForm.parents[pi].name}
                        link={umaForm.parents[pi].link}
                        onNameChange={(v) => updateUmaForm(`parents.${pi}.name`, v)}
                        onLinkChange={(v) => updateUmaForm(`parents.${pi}.link`, v)}
                      />
                    ))}
                  </div>
                  {/* 메인 */}
                  <div className="d-flex justify-content-center" style={{ paddingInline: "35%" }}>
                    <div className="factor-card">
                      {/* <div className="factor-icon">
                        <i className="bi bi-plus"></i>
                      </div> */}
                      <div className="factor-title">메인 캐릭터</div>
                      <div className="factor-name-display">
                        {umaForm.name || <span className="text-muted">미입력</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer py-2">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEditUmaIdx(null);
                    setUmaForm(null);
                  }}
                >
                  취소
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleUmaSave}>
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FactorCard({ label, name, link, onNameChange, onLinkChange }) {
  return (
    <div className="factor-card">
      {/* <div className="factor-icon">
        <i className="bi bi-plus"></i>
      </div> */}
      <div className="factor-title">{label}</div>
      <input
        type="text"
        className="form-control form-control-sm factor-input"
        placeholder="이름"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <div className="d-flex align-items-center gap-1 mt-1">
        <input
          type="url"
          className="form-control form-control-sm factor-input"
          placeholder="메모"
          value={link}
          onChange={(e) => onLinkChange(e.target.value)}
        />
        {link && (
          <button
            className="factor-link-btn"
            title="브라우저에서 열기"
            onClick={() => window.electronAPI.shell.openExternal(link)}
          >
            <ExternalLink size={11} />
          </button>
        )}
      </div>
    </div>
  );
}
