import { useState, useEffect } from "react";
import { useStore } from "../hooks/useStore";
import { useToast } from "../context/ToastContext";
import { getDistanceCategory } from "../utils";
import { Users, ExternalLink, User, Calculator, Copy, Search } from "lucide-react";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 30;
const RUN_STYLES = ["도주", "선행", "선입", "추입"];

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
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

export default function WantedUma() {
  const { data, load, update } = useStore("racetracks");
  const toast = useToast();
  const [filterText, setFilterText] = useState("");
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState(null); // { rtId, umaIdx }
  const [umaForm, setUmaForm] = useState(null);

  useEffect(() => {
    load();
  }, []);

  // 전체 마장에서 이름 있는 우마무스메 집계
  const allUmas = data.flatMap((rt) =>
    (rt.umaList || []).map((u, idx) => ({ ...u, _rtId: rt.id, _umaIdx: idx, _rt: rt })).filter((u) => u.name),
  );

  const filtered = allUmas.filter((u) => !filterText || u.name.toLowerCase().includes(filterText.toLowerCase()));

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleRowClick = (item) => {
    setUmaForm(deepClone(item));
    setEditItem({ rtId: item._rtId, umaIdx: item._umaIdx });
  };

  const handleSave = async () => {
    if (!umaForm.name.trim()) {
      toast("우마무스메 이름을 입력하세요.", "warning");
      return;
    }
    const rt = data.find((r) => r.id === editItem.rtId);
    if (!rt) return;
    const umaList = rt.umaList ? deepClone(rt.umaList) : [];
    while (umaList.length <= editItem.umaIdx) umaList.push(makeEmptyUma());
    // _rt, _rtId, _umaIdx 제거 후 저장
    const { _rtId, _umaIdx, _rt, ...cleanUma } = umaForm; // eslint-disable-line
    umaList[editItem.umaIdx] = cleanUma;
    await update(editItem.rtId, { ...rt, umaList });
    setEditItem(null);
    setUmaForm(null);
    toast("저장되었습니다.");
  };

  const handleClose = () => {
    setEditItem(null);
    setUmaForm(null);
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

  return (
    <>
      <div className="page-header">
        <h6>
          <Users size={15} className="me-1 text-success" />
          출주희망 우마무스메
        </h6>
      </div>

      {/* 검색 필터 */}
      <div className="mb-2">
        <div className="input-group input-group-sm">
          <span className="input-group-text">
            <Search size={13} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="이름 검색..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {allUmas.length === 0 ? (
        <div className="empty-state">
          <Users size={36} className="mb-2 text-muted" />
          <p>
            등록된 출주희망 우마무스메가 없습니다.
            <br />
            마장 탭에서 우마무스메를 추가하세요.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-sm">
            <thead className="table-light">
              <tr>
                <th>이름</th>
                <th>각질</th>
                <th>마장</th>
                <th>부모</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((item, i) => (
                <tr key={i} style={{ cursor: "pointer" }} onClick={() => handleRowClick(item)}>
                  <td className="fw-semibold">{item.name}</td>
                  <td>
                    <span className="badge bg-secondary badge-sm">{item.runStyle}</span>
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm me-1 ${item._rt.type === "챔피언스미팅" ? "bg-primary" : "bg-success"}`}
                    >
                      {item._rt.type === "챔피언스미팅" ? "챔미" : "LoH"}
                    </span>
                    {item._rt.racecourse} {item._rt.distance}m
                    <div className="text-muted td-sub">
                      {item._rt.surface} · {getDistanceCategory(item._rt.distance)}
                    </div>
                  </td>
                  <td className="text-muted td-sub">{item.parents.map((p) => p.name || "-").join(" / ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination total={filtered.length} page={page} pageSize={PAGE_SIZE} onPage={setPage} />
        </div>
      )}

      {/* ── 우마무스메 편집 모달 ── */}
      {editItem && umaForm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header py-2">
                <h6 className="modal-title">
                  <User size={14} className="me-1 text-success" />
                  {umaForm.name}
                  {umaForm._rt && (
                    <span className="text-muted fw-normal small ms-1">
                      ({umaForm._rt.racecourse} {umaForm._rt.distance}m)
                    </span>
                  )}
                </h6>
                <button type="button" className="btn-close" onClick={handleClose}></button>
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
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={umaForm.name}
                    onChange={(e) => updateUmaForm("name", e.target.value)}
                  />
                </div>
                {/* 정보 링크 */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small mb-0">정보 확인 링크</label>
                  <div className="input-group input-group-sm mt-1">
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
                          id={`wuma-rs-${s}`}
                          value={s}
                          checked={umaForm.runStyle === s}
                          onChange={() => updateUmaForm("runStyle", s)}
                        />
                        <label className="form-check-label small" htmlFor={`wuma-rs-${s}`}>
                          {s}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 부모인자 트리 */}
                <div className="mb-2">
                  <div className="d-flex align-items-center gap-2 mb-2">
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
                      <div className="factor-title">메인 캐릭터</div>
                      <div className="factor-name-display">
                        {umaForm.name || <span className="text-muted">미입력</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer py-2">
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleClose}>
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

function FactorCard({ label, name, link, onNameChange, onLinkChange }) {
  return (
    <div className="factor-card">
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
