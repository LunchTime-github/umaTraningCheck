import { useState, useEffect } from "react";
import { useStore } from "../hooks/useStore";
import { useToast } from "../context/ToastContext";
import { getDistanceCategory } from "../utils";

// 경기장 목록 (게임 내 고정 데이터)
const RACECOURSES = [
  { id: 1, name: "도쿄", surface: "잔디", distance: 1600, direction: "반시계" },
  { id: 2, name: "도쿄", surface: "잔디", distance: 1800, direction: "반시계" },
  { id: 3, name: "도쿄", surface: "잔디", distance: 2000, direction: "반시계" },
  { id: 4, name: "도쿄", surface: "잔디", distance: 2400, direction: "반시계" },
  { id: 5, name: "도쿄", surface: "더트", distance: 1600, direction: "반시계" },
  { id: 6, name: "나카야마", surface: "잔디", distance: 1200, direction: "시계" },
  { id: 7, name: "나카야마", surface: "잔디", distance: 1600, direction: "시계" },
  { id: 8, name: "나카야마", surface: "잔디", distance: 2000, direction: "시계" },
  { id: 9, name: "나카야마", surface: "잔디", distance: 2500, direction: "시계" },
  { id: 10, name: "나카야마", surface: "더트", distance: 1800, direction: "시계" },
  { id: 11, name: "한신", surface: "잔디", distance: 1400, direction: "시계" },
  { id: 12, name: "한신", surface: "잔디", distance: 1600, direction: "시계" },
  { id: 13, name: "한신", surface: "잔디", distance: 2000, direction: "시계" },
  { id: 14, name: "한신", surface: "잔디", distance: 2200, direction: "시계" },
  { id: 15, name: "한신", surface: "더트", distance: 1400, direction: "시계" },
  { id: 16, name: "교토", surface: "잔디", distance: 1200, direction: "시계" },
  { id: 17, name: "교토", surface: "잔디", distance: 1400, direction: "시계" },
  { id: 18, name: "교토", surface: "잔디", distance: 1600, direction: "시계" },
  { id: 19, name: "교토", surface: "잔디", distance: 2000, direction: "시계" },
  { id: 20, name: "교토", surface: "잔디", distance: 2200, direction: "시계" },
  { id: 21, name: "교토", surface: "잔디", distance: 2400, direction: "시계" },
  { id: 22, name: "교토", surface: "잔디", distance: 3200, direction: "시계" },
  { id: 23, name: "교토", surface: "더트", distance: 1800, direction: "시계" },
  { id: 24, name: "주쿄", surface: "더트", distance: 1800, direction: "반시계" },
  { id: 25, name: "주쿄", surface: "잔디", distance: 1200, direction: "반시계" },
  { id: 26, name: "주쿄", surface: "잔디", distance: 1400, direction: "반시계" },
  { id: 27, name: "주쿄", surface: "잔디", distance: 2000, direction: "반시계" },
  { id: 28, name: "고쿠라", surface: "잔디", distance: 1200, direction: "시계" },
  { id: 29, name: "고쿠라", surface: "잔디", distance: 2000, direction: "시계" },
  { id: 30, name: "니가타", surface: "잔디", distance: 1200, direction: "시계" },
  { id: 31, name: "니가타", surface: "잔디", distance: 1600, direction: "반시계" },
  { id: 32, name: "후쿠시마", surface: "잔디", distance: 1200, direction: "시계" },
  { id: 33, name: "후쿠시마", surface: "잔디", distance: 2000, direction: "시계" },
  { id: 34, name: "삿포로", surface: "잔디", distance: 1200, direction: "시계" },
  { id: 35, name: "삿포로", surface: "잔디", distance: 2000, direction: "시계" },
  { id: 36, name: "삿포로", surface: "더트", distance: 1700, direction: "시계" },
  { id: 37, name: "하코다테", surface: "잔디", distance: 1200, direction: "시계" },
  { id: 38, name: "하코다테", surface: "잔디", distance: 2000, direction: "시계" },
];

const EMPTY_FORM = {
  type: "챔피언스미팅",
  startDate: "",
  endDate: "",
  racecourseId: "",
};

export default function Racetracks() {
  const { data, load, add, remove } = useStore("racetracks");
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    load();
  }, []);

  const selectedCourse = RACECOURSES.find((r) => String(r.id) === String(form.racecourseId));

  const handleSave = async () => {
    if (!form.type) {
      toast("종류를 선택하세요.", "warning");
      return;
    }
    if (!form.racecourseId) {
      toast("경기장을 선택하세요.", "warning");
      return;
    }
    if (!form.startDate || !form.endDate) {
      toast("기간을 입력하세요.", "warning");
      return;
    }

    const course = RACECOURSES.find((r) => String(r.id) === String(form.racecourseId));
    await add({
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      racecourse: course.name,
      surface: course.surface,
      distance: course.distance,
      direction: course.direction,
    });
    setShowModal(false);
    setForm(EMPTY_FORM);
    toast("마장이 등록되었습니다.");
  };

  const handleDelete = async (id) => {
    if (!confirm("이 마장을 삭제하시겠습니까?")) return;
    await remove(id);
    toast("삭제되었습니다.", "info");
  };

  return (
    <>
      <div className="page-header">
        <h6>
          <i className="bi bi-flag-fill me-1 text-primary"></i>마장
        </h6>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg"></i> 등록
        </button>
      </div>

      {data.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-flag"></i>
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
                <th>기간</th>
                <th>마장</th>
                <th>거리</th>
                <th>방향</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((rt) => (
                <tr key={rt.id}>
                  <td>
                    <span className={`badge badge-sm ${rt.type === "챔피언스미팅" ? "bg-primary" : "bg-success"}`}>
                      {rt.type === "챔피언스미팅" ? "챔미" : "LoH"}
                    </span>
                  </td>
                  <td>{rt.racecourse}</td>
                  <td style={{ fontSize: "0.7rem" }}>
                    {rt.startDate}
                    <br />~{rt.endDate}
                  </td>
                  <td>{rt.surface}</td>
                  <td>
                    {rt.distance}m<br />
                    <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                      {getDistanceCategory(rt.distance)}
                    </span>
                  </td>
                  <td>{rt.direction}</td>
                  <td>
                    <button className="btn btn-outline-danger btn-sm py-0 px-1" onClick={() => handleDelete(rt.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold small">시작일</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold small">종료일</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    경기장 <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={form.racecourseId}
                    onChange={(e) => setForm({ ...form, racecourseId: e.target.value })}
                  >
                    <option value="">-- 선택 --</option>
                    {RACECOURSES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} · {r.surface} · {r.distance}m · {r.direction}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedCourse && (
                  <div className="alert alert-light py-2 small">
                    <strong>{selectedCourse.name}</strong>&nbsp;
                    {selectedCourse.surface} · {selectedCourse.distance}m (
                    {getDistanceCategory(selectedCourse.distance)}) · {selectedCourse.direction}
                  </div>
                )}
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
    </>
  );
}
