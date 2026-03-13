import { useState, useEffect } from "react";
import { useStore } from "../hooks/useStore";
import { useToast } from "../context/ToastContext";
import { formatDateTime, formatRacetrackLabel, formatFailureCause, FAILURE_TYPES, CONDITION_TYPES } from "../utils";

export default function Training() {
  const { data: records, load: loadRecords, add: addRecord, remove: deleteRecord } = useStore("records");
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
  const [filterCharId, setFilterCharId] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("trainingFilters") || "{}").charId || "";
    } catch {
      return "";
    }
  });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ racetracksId: "", characterId: "", horseName: "", result: "실패" });
  const [failCauseType, setFailCauseType] = useState("");
  const [failProb, setFailProb] = useState("");
  const [condType, setCondType] = useState("");

  useEffect(() => {
    loadRecords();
    loadRacetracks();
    loadCharacters();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("trainingFilters", JSON.stringify({ rtId: filterRtId, charId: filterCharId }));
    } catch {}
  }, [filterRtId, filterCharId]);

  const filtered = [...records]
    .filter((r) => {
      if (filterRtId && r.racetracksId !== filterRtId) return false;
      if (filterCharId && r.characterId !== filterCharId) return false;
      return true;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const resetForm = () => {
    setForm({ racetracksId: "", characterId: "", horseName: "", result: "실패" });
    setFailCauseType("");
    setFailProb("");
    setCondType("");
  };

  const openModal = () => {
    setForm((prev) => ({
      ...prev,
      racetracksId: filterRtId || "",
      characterId: filterCharId || "",
    }));
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.racetracksId) {
      toast("대상 마장을 선택하세요.", "warning");
      return;
    }
    if (!form.characterId) {
      toast("우마무스메를 선택하세요.", "warning");
      return;
    }
    if (!failCauseType) {
      toast("실패 원인을 선택하세요.", "warning");
      return;
    }

    const failureCause = { type: failCauseType };
    if (failCauseType === "훈련실패") failureCause.trainingFailProb = failProb;
    if (failCauseType === "상태이상") failureCause.conditionType = condType;

    await addRecord({ ...form, failureCause, timestamp: new Date().toISOString() });
    setShowModal(false);
    resetForm();
    toast("훈련 실패 기록이 등록되었습니다.");
  };

  const handleDelete = async (id) => {
    if (!confirm("이 기록을 삭제하시겠습니까?")) return;
    await deleteRecord(id);
    toast("삭제되었습니다.", "info");
  };

  const canAdd = racetracks.length > 0 && characters.length > 0;

  return (
    <>
      <div className="page-header">
        <h6>
          <i className="bi bi-journal-text me-1 text-warning"></i>훈련기록
        </h6>
        <button
          className="btn btn-warning btn-sm text-white"
          onClick={openModal}
          disabled={!canAdd}
          title={!canAdd ? "마장과 우마무스메를 먼저 등록하세요" : ""}
        >
          <i className="bi bi-plus-lg"></i> 등록
        </button>
      </div>

      {!canAdd && (
        <div className="alert alert-info small py-2 mb-2">
          <i className="bi bi-info-circle me-1"></i>
          마장과 육성 우마무스메를 먼저 등록해 주세요.
        </div>
      )}

      <div className="filter-bar">
        <div className="row g-1">
          <div className="col-6">
            <select
              className="form-select form-select-sm"
              value={filterRtId}
              onChange={(e) => setFilterRtId(e.target.value)}
            >
              <option value="">마장 전체</option>
              {racetracks.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {formatRacetrackLabel(rt)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <select
              className="form-select form-select-sm"
              value={filterCharId}
              onChange={(e) => setFilterCharId(e.target.value)}
            >
              <option value="">우마무스메 전체</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-journal"></i>
          <p>기록이 없습니다.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-sm">
            <thead className="table-light">
              <tr>
                <th>등록시간</th>
                <th>대상마장</th>
                <th>우마</th>
                <th>육성마</th>
                <th>실패원인</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const rt = racetracks.find((x) => x.id === r.racetracksId);
                const ch = characters.find((x) => x.id === r.characterId);
                const rtLabel = rt
                  ? `${rt.type === "챔피언스미팅" ? "챔미" : "LoH"} ${rt.racecourse} ${rt.distance}m`
                  : "-";
                return (
                  <tr key={r.id}>
                    <td style={{ fontSize: "0.7rem" }}>{formatDateTime(r.timestamp)}</td>
                    <td>{rtLabel}</td>
                    <td>{ch?.name || "-"}</td>
                    <td>{r.horseName || "-"}</td>
                    <td>
                      <span className="badge bg-secondary badge-sm">{formatFailureCause(r.failureCause)}</span>
                    </td>
                    <td>
                      <button className="btn btn-outline-danger btn-sm py-0 px-1" onClick={() => handleDelete(r.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 등록 모달 */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header py-2">
                <h6 className="modal-title">훈련 실패 등록</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
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
                    onChange={(e) => setForm({ ...form, racetracksId: e.target.value })}
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
                    육성중인 우마무스메 <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={form.characterId}
                    onChange={(e) => setForm({ ...form, characterId: e.target.value })}
                  >
                    <option value="">-- 선택 --</option>
                    {characters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">육성마 이름</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={form.horseName}
                    onChange={(e) => setForm({ ...form, horseName: e.target.value })}
                    placeholder="유저가 지은 말 이름 (선택)"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    실패 원인 <span className="text-danger">*</span>
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
              </div>
              <div className="modal-footer py-2">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  취소
                </button>
                <button type="button" className="btn btn-warning btn-sm text-white" onClick={handleSubmit}>
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
