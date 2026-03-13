import { useState, useEffect } from "react";
import { useStore } from "../hooks/useStore";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../utils";

export default function Characters() {
  const { data, load, add, remove } = useStore("characters");
  const toast = useToast();

  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    load();
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      const result = await window.electronAPI.data.getCharactersCatalog();
      if (result?.characters) {
        setCatalog(result.characters);
        setLastUpdated(result.updatedAt);
      }
    } catch {
      setCatalog([]);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await window.electronAPI.data.refreshCharacters();
      if (result?.characters) {
        setCatalog(result.characters);
        setLastUpdated(result.updatedAt);
        toast(`캐릭터 목록이 업데이트되었습니다. (${result.characters.length}명)`);
      }
    } catch {
      toast("업데이트 실패: 인터넷 연결을 확인해주세요.", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAdd = async () => {
    if (!selectedId) {
      toast("추가할 우마무스메를 선택하세요.", "warning");
      return;
    }
    const char = catalog.find((c) => String(c.id) === String(selectedId));
    if (!char) return;
    if (data.some((d) => d.catalogId === String(char.id))) {
      toast("이미 등록된 우마무스메입니다.", "warning");
      return;
    }
    await add({ catalogId: String(char.id), name: char.name, releaseDate: char.releaseDate, urlKey: char.urlKey });
    setShowModal(false);
    setSelectedId("");
    toast(`${char.name} 등록 완료!`);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`'${name}'을(를) 삭제하시겠습니까?`)) return;
    await remove(id);
    toast("삭제되었습니다.", "info");
  };

  const handleOpenLink = async (urlKey) => {
    await window.electronAPI.shell.openExternal(`https://gametora.com/ko/umamusume/characters/${urlKey}`);
  };

  const filtered = [...data]
    .filter((c) => c.name.includes(filterText))
    .sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));

  // 카탈로그에서 아직 추가 안된 것만
  const availableToAdd = catalog.filter((c) => !data.some((d) => d.catalogId === String(c.id)));

  return (
    <>
      <div className="page-header">
        <h6>
          <i className="bi bi-person-fill me-1 text-success"></i>육성 우마무스메
        </h6>
        <button className="btn btn-success btn-sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg"></i> 등록
        </button>
      </div>

      <div className="filter-bar mb-2 d-flex gap-2 align-items-center">
        <input
          type="text"
          className="form-control form-control-sm flex-grow-1"
          placeholder="이름 검색..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="캐릭터 목록 최신화"
        >
          <i className={`bi ${isRefreshing ? "bi-arrow-repeat spin" : "bi-cloud-download"}`}></i>
        </button>
      </div>

      {lastUpdated && (
        <p className="text-muted small mb-2" style={{ fontSize: "0.7rem" }}>
          <i className="bi bi-clock me-1"></i>캐릭터 DB: {new Date(lastUpdated).toLocaleDateString("ko-KR")} 기준 (
          {catalog.length}명)
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-person-circle"></i>
          <p>
            {data.length > 0
              ? "검색 결과가 없습니다."
              : "등록된 우마무스메가 없습니다.\n우측 상단 버튼으로 추가하세요."}
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-sm">
            <thead className="table-light">
              <tr>
                <th>이름</th>
                <th>출시일</th>
                <th>링크</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="fw-semibold">{c.name}</td>
                  <td>{formatDate(c.releaseDate)}</td>
                  <td>
                    {c.urlKey && (
                      <button
                        className="btn btn-outline-secondary btn-sm py-0 px-1"
                        onClick={() => handleOpenLink(c.urlKey)}
                        title="gametora 페이지 열기"
                      >
                        <i className="bi bi-box-arrow-up-right"></i>
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm py-0 px-1"
                      onClick={() => handleDelete(c.id, c.name)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 등록 모달 */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header py-2">
                <h6 className="modal-title">육성 우마무스메 등록</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedId("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <label className="form-label fw-semibold small">우마무스메 선택</label>
                <select
                  className="form-select form-select-sm"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                >
                  <option value="">-- 선택 --</option>
                  {availableToAdd.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({formatDate(c.releaseDate)})
                    </option>
                  ))}
                </select>
                {availableToAdd.length === 0 && (
                  <p className="text-muted small mt-2 mb-0">
                    <i className="bi bi-check-all me-1"></i>모든 캐릭터가 이미 등록되어 있습니다.
                  </p>
                )}
              </div>
              <div className="modal-footer py-2">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedId("");
                  }}
                >
                  취소
                </button>
                <button type="button" className="btn btn-success btn-sm" onClick={handleAdd}>
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
