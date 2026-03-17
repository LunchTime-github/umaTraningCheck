import { useState, useEffect, useRef } from "react";
import { useStore } from "../hooks/useStore";
import { useToast } from "../context/ToastContext";
import { formatDateTime, formatRacetrackLabel, formatFailureCause, FAILURE_TYPES, CONDITION_TYPES } from "../utils";
import { confirmDelete } from "../utils/swal";
import { ClipboardList, Plus, Info, AlertTriangle, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 30;

export default function Training() {
  const {
    data: records,
    load: loadRecords,
    add: addRecord,
    update: updateRecord,
    remove: deleteRecord,
  } = useStore("records");
  const { data: racetracks, load: loadRacetracks } = useStore("racetracks");
  const { data: characters, load: loadCharacters } = useStore("characters");
  const toast = useToast();

  const [filterRtId, setFilterRtId] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("trainingFilters") || "{}").rtId || "";
    } catch {
      return "";
    }
  });
  const [filterUmaName, setFilterUmaName] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("trainingFilters") || "{}").umaName || "";
    } catch {
      return "";
    }
  });
  const [filterResult, setFilterResult] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("trainingFilters") || "{}").result || "";
    } catch {
      return "";
    }
  });
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ racetracksId: "", umaName: "", result: "완주" });
  const [rank, setRank] = useState("");
  const [memo, setMemo] = useState("");
  const lastInputRef = useRef({ racetracksId: "", umaName: "" });
  const [failCauseType, setFailCauseType] = useState("");
  const [failProb, setFailProb] = useState("");
  const [condType, setCondType] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadRecords();
    loadRacetracks();
    loadCharacters();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "trainingFilters",
        JSON.stringify({ rtId: filterRtId, umaName: filterUmaName, result: filterResult }),
      );
    } catch {}
  }, [filterRtId, filterUmaName, filterResult]);

  const filtered = [...records]
    .filter((r) => {
      if (filterRtId && r.racetracksId !== filterRtId) return false;
      if (filterUmaName) {
        const name = r.umaName || characters.find((c) => c.id === r.characterId)?.name;
        if (name !== filterUmaName) return false;
      }
      if (filterResult) {
        if (filterResult === "완주" && r.result !== "완주") return false;
        if (filterResult === "미완주" && r.result !== "미완주") return false;
      }
      return true;
    })
    .sort((a, b) => {
      const diff = new Date(b.timestamp) - new Date(a.timestamp);
      return sortAsc ? -diff : diff;
    });

  const pagedFiltered = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetForm = () => {
    setForm({ racetracksId: "", umaName: "", result: "완주" });
    setRank("");
    setMemo("");
    setFailCauseType("");
    setFailProb("");
    setCondType("");
  };

  const openModal = () => {
    setEditingId(null);
    const last = lastInputRef.current;
    // lastInputRef가 비어있으면 가장 최근 기록에서 기본값 추출
    if (!last.racetracksId && records.length > 0) {
      const newest = [...records].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      last.racetracksId = newest.racetracksId || "";
      last.umaName = newest.umaName || "";
    }
    setForm((prev) => ({
      ...prev,
      racetracksId: last.racetracksId || filterRtId || "",
      umaName: last.umaName || "",
    }));
    setShowModal(true);
  };

  const openEditModal = (r) => {
    setEditingId(r.id);
    setForm({
      racetracksId: r.racetracksId,
      umaName: r.umaName || characters.find((c) => c.id === r.characterId)?.name || "",
      result: r.result || "미완주",
    });
    setRank(r.rank || "");
    setMemo(r.memo || "");
    if (r.failureCause) {
      setFailCauseType(r.failureCause.type || "");
      setFailProb(r.failureCause.trainingFailProb?.toString() || "");
      setCondType(r.failureCause.conditionType || "");
    } else {
      setFailCauseType("");
      setFailProb("");
      setCondType("");
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.racetracksId) {
      toast("대상 마장을 선택하세요.", "warning");
      return;
    }
    if (!form.umaName) {
      toast("우마무스메를 선택하세요.", "warning");
      return;
    }
    if (form.result === "미완주" && !failCauseType) {
      toast("미완주 원인을 선택하세요.", "warning");
      return;
    }

    const payload = {
      racetracksId: form.racetracksId,
      umaName: form.umaName,
      result: form.result,
    };

    if (form.result === "완주") {
      payload.rank = rank;
      payload.memo = memo;
      payload.failureCause = null;
    } else {
      const failureCause = { type: failCauseType };
      if (failCauseType === "훈련실패") failureCause.trainingFailProb = failProb;
      if (failCauseType === "상태이상") failureCause.conditionType = condType;
      payload.failureCause = failureCause;
      payload.rank = null;
      payload.memo = null;
    }

    if (editingId) {
      await updateRecord(editingId, payload);
      toast("기록이 수정되었습니다.", "success");
    } else {
      payload.timestamp = new Date().toISOString();
      lastInputRef.current = { racetracksId: form.racetracksId, umaName: form.umaName };
      await addRecord(payload);
      toast("훈련 기록이 등록되었습니다.");
    }
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!(await confirmDelete("이 기록을 삭제하시겠습니까?"))) return;
    await deleteRecord(id);
    toast("삭제되었습니다.", "info");
  };

  const canAdd = racetracks.length > 0;

  const selectedRtForForm = racetracks.find((rt) => rt.id === form.racetracksId);
  const umaListForForm = selectedRtForForm?.umaList?.filter((u) => u.name) || [];

  const handleRacetrackChange = (rtId) => {
    setForm((prev) => ({ ...prev, racetracksId: rtId, umaName: "" }));
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const allUmaNames = [
    ...new Set([
      ...racetracks.flatMap((rt) => (rt.umaList || []).filter((u) => u.name).map((u) => u.name)),
      ...characters.map((c) => c.name),
    ]),
  ].sort();

  return (
    <>
      <div className="page-header">
        <h6>
          <ClipboardList size={15} className="me-1 text-warning" />
          훈련기록
        </h6>
        <button
          className="btn btn-primary btn-sm"
          onClick={openModal}
          disabled={!canAdd}
          title={!canAdd ? "마장을 먼저 등록하세요" : ""}
        >
          <Plus size={14} className="me-1" />
          등록
        </button>
      </div>

      {!canAdd && (
        <div className="alert alert-info small py-2 mb-2 d-flex align-items-center gap-1">
          <Info size={14} />
          마장을 먼저 등록해 주세요.
        </div>
      )}

      <div className="filter-bar">
        <div className="row g-1">
          <div className="col-5">
            <select
              className="form-select form-select-sm"
              value={filterRtId}
              onChange={handleFilterChange(setFilterRtId)}
            >
              <option value="">마장 전체</option>
              {racetracks.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {formatRacetrackLabel(rt)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-4">
            <select
              className="form-select form-select-sm"
              value={filterUmaName}
              onChange={handleFilterChange(setFilterUmaName)}
            >
              <option value="">우마 전체</option>
              {allUmaNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-3">
            <select
              className="form-select form-select-sm"
              value={filterResult}
              onChange={handleFilterChange(setFilterResult)}
            >
              <option value="">결과 전체</option>
              <option value="완주">완주</option>
              <option value="미완주">미완주</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={36} className="mb-2 text-muted" />
          <p>기록이 없습니다.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-sm">
            <thead className="table-light">
              <tr>
                <th
                  style={{ cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }}
                  onClick={() => {
                    setSortAsc((v) => !v);
                    setPage(1);
                  }}
                >
                  등록시간{sortAsc ? <ArrowUp size={11} className="ms-1" /> : <ArrowDown size={11} className="ms-1" />}
                </th>
                <th>대상마장</th>
                <th>우마</th>
                <th>결과</th>
                <th>상세</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pagedFiltered.map((r) => {
                const rt = racetracks.find((x) => x.id === r.racetracksId);
                const charName = r.umaName || characters.find((x) => x.id === r.characterId)?.name || "-";
                const rtLabel = rt
                  ? `${rt.type === "챔피언스미팅" ? "챔미" : "LoH"} ${rt.racecourse} ${rt.distance}m`
                  : "-";
                const result = r.result || "미완주";
                return (
                  <tr key={r.id} style={{ cursor: "pointer" }} onClick={() => openEditModal(r)}>
                    <td style={{ fontSize: "0.7rem" }}>{formatDateTime(r.timestamp)}</td>
                    <td>{rtLabel}</td>
                    <td>{charName}</td>
                    <td>
                      <span className={`badge badge-sm ${result === "완주" ? "bg-success" : "bg-danger"}`}>
                        {result}
                      </span>
                    </td>
                    <td>
                      {result === "완주" ? (
                        r.rank ? (
                          <span className="badge bg-warning text-dark badge-sm">{r.rank}</span>
                        ) : r.memo ? (
                          <span className="text-muted small">{r.memo.slice(0, 20)}</span>
                        ) : (
                          "-"
                        )
                      ) : (
                        <span className="badge bg-secondary badge-sm">{formatFailureCause(r.failureCause)}</span>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button className="btn btn-outline-danger btn-sm py-0 px-1" onClick={() => handleDelete(r.id)}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination total={filtered.length} page={page} pageSize={PAGE_SIZE} onPage={setPage} />
        </div>
      )}

      {/* 등록 모달 */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header py-2">
                <h6 className="modal-title">{editingId ? "훈련 기록 수정" : "훈련 기록 등록"}</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    resetForm();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    대상 마장 <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={form.racetracksId}
                    onChange={(e) => handleRacetrackChange(e.target.value)}
                  >
                    <option value="">-- 선택 --</option>
                    {racetracks.map((rt) => (
                      <option key={rt.id} value={rt.id}>
                        {formatRacetrackLabel(rt)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    출주 희망 우마무스메 <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={form.umaName}
                    onChange={(e) => setForm({ ...form, umaName: e.target.value })}
                    disabled={!form.racetracksId}
                  >
                    <option value="">-- 선택 --</option>
                    {umaListForForm.map((u, i) => (
                      <option key={i} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  {form.racetracksId && umaListForForm.length === 0 && (
                    <div className="text-warning small mt-1 d-flex align-items-center gap-1">
                      <AlertTriangle size={13} />이 마장에 등록된 출주 희망 우마무스메가 없습니다.
                    </div>
                  )}
                  {!form.racetracksId && (
                    <div className="text-muted small mt-1 d-flex align-items-center gap-1">
                      <Info size={13} />
                      마장을 먼저 선택하세요.
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    결과 <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex gap-3">
                    {["완주", "미완주"].map((rv) => (
                      <div key={rv} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id={`result-${rv}`}
                          value={rv}
                          checked={form.result === rv}
                          onChange={() => {
                            setForm({ ...form, result: rv });
                            setFailCauseType("");
                            setRank("");
                            setMemo("");
                          }}
                        />
                        <label className="form-check-label small" htmlFor={`result-${rv}`}>
                          {rv}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {form.result === "완주" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">랭크</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={rank}
                        onChange={(e) => setRank(e.target.value)}
                        placeholder="UC4, B, A3 등 (선택)"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">메모</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={3}
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="메모 (선택)"
                      />
                    </div>
                  </>
                )}
                {form.result === "미완주" && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      미완주 원인 <span className="text-danger">*</span>
                    </label>
                    <div className="border rounded p-2">
                      {FAILURE_TYPES.map((ft) => (
                        <div key={ft.value} className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            id={`ft-${ft.value}`}
                            value={ft.value}
                            checked={failCauseType === ft.value}
                            onChange={() => setFailCauseType(ft.value)}
                          />
                          <label className="form-check-label small" htmlFor={`ft-${ft.value}`}>
                            {ft.label}
                          </label>
                        </div>
                      ))}
                      {failCauseType === "훈련실패" && (
                        <div className="mt-2 ms-3">
                          <label className="form-label small mb-1">실패 확률 (%)</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            min="0"
                            max="100"
                            value={failProb}
                            onChange={(e) => setFailProb(e.target.value)}
                            placeholder="0~100"
                          />
                        </div>
                      )}
                      {failCauseType === "상태이상" && (
                        <div className="mt-2 ms-3">
                          <label className="form-label small mb-1">상태이상 종류</label>
                          <select
                            className="form-select form-select-sm"
                            value={condType}
                            onChange={(e) => setCondType(e.target.value)}
                          >
                            <option value="">선택하세요</option>
                            {CONDITION_TYPES.map((ct) => (
                              <option key={ct} value={ct}>
                                {ct}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer py-2">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    resetForm();
                  }}
                >
                  취소
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit}>
                  {editingId ? "수정" : "저장"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
