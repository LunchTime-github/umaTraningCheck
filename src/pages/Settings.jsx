import { useState, useRef } from "react";
import { useStore } from "../hooks/useStore";
import { Settings, Download, Upload, CheckCircle } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function SettingsPage() {
  const { data: records, load: loadRecords, setData: setRecords } = useStore("records");
  const { data: racetracks, load: loadRacetracks, setData: setRacetracks } = useStore("racetracks");
  const { data: characters, load: loadCharacters, setData: setCharacters } = useStore("characters");
  const toast = useToast();
  const [loaded, setLoaded] = useState(false);
  const [hasExported, setHasExported] = useState(false);
  const fileInputRef = useRef(null);

  const ensureLoaded = async () => {
    if (!loaded) {
      await Promise.all([loadRecords(), loadRacetracks(), loadCharacters()]);
      setLoaded(true);
    }
  };

  const handleExport = async () => {
    await ensureLoaded();
    const content = JSON.stringify({ records, racetracks, characters }, null, 2);
    const defaultFilename = `우마플래너_백업_${new Date().toISOString().slice(0, 10)}.json`;
    const filters = [{ name: "JSON", extensions: ["json"] }];

    const result = await window.electronAPI.files.saveAs({ content, defaultFilename, filters });
    if (result?.success) {
      toast("백업 파일이 저장되었습니다.", "success");
      setHasExported(true);
    } else if (result && !result.success && !result.canceled) {
      toast("저장에 실패했습니다.", "error");
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 입력 초기화
    e.target.value = "";

    if (!file.name.endsWith(".json")) {
      toast("JSON 파일만 가져올 수 있습니다.", "warning");
      return;
    }

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data || typeof data !== "object") {
        toast("올바른 백업 파일이 아닙니다.", "warning");
        return;
      }

      // 필수 키 존재 여부 확인
      const hasRecords = Array.isArray(data.records);
      const hasRacetracks = Array.isArray(data.racetracks);
      const hasCharacters = Array.isArray(data.characters);

      if (!hasRecords && !hasRacetracks && !hasCharacters) {
        toast("복원할 데이터가 없습니다.", "warning");
        return;
      }

      // store에 덮어쓰기
      if (hasRecords) {
        await window.electronAPI.store.set("records", data.records);
        setRecords(data.records);
      }
      if (hasRacetracks) {
        await window.electronAPI.store.set("racetracks", data.racetracks);
        setRacetracks(data.racetracks);
      }
      if (hasCharacters) {
        await window.electronAPI.store.set("characters", data.characters);
        setCharacters(data.characters);
      }

      const parts = [];
      if (hasRecords) parts.push(`훈련기록 ${data.records.length}건`);
      if (hasRacetracks) parts.push(`마장 ${data.racetracks.length}건`);
      if (hasCharacters) parts.push(`캐릭터 ${data.characters.length}건`);
      toast(`데이터를 복원했습니다: ${parts.join(", ")}`, "success");
    } catch {
      toast("파일을 읽을 수 없습니다.", "error");
    }
  };

  return (
    <>
      <div className="page-header">
        <h6>
          <Settings size={15} className="me-1 text-secondary" />
          설정
        </h6>
      </div>

      {/* 데이터 내보내기 */}
      <div className="card mb-2">
        <div className="card-body p-3">
          <h6 className="fw-bold small mb-3 d-flex align-items-center gap-1">
            <Download size={14} />
            데이터 내보내기
          </h6>
          <div className="border rounded p-2 d-flex justify-content-between align-items-center">
            <div>
              <div className="small fw-semibold">전체 데이터 백업</div>
              <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                모든 데이터를 JSON 파일로 저장합니다.
              </div>
            </div>
            <button className="btn btn-outline-primary btn-sm flex-shrink-0 ms-2" onClick={handleExport}>
              저장
            </button>
          </div>
        </div>
      </div>

      {/* 데이터 가져오기 */}
      <div className="card mb-2">
        <div className="card-body p-3">
          <h6 className="fw-bold small mb-3 d-flex align-items-center gap-1">
            <Upload size={14} />
            데이터 가져오기
          </h6>
          <div className="border rounded p-2 d-flex justify-content-between align-items-center">
            <div>
              <div className="small fw-semibold">백업 파일 복원</div>
              <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                {hasExported
                  ? "내보낸 JSON 파일을 선택하여 데이터를 복원합니다."
                  : "데이터를 먼저 내보내야 가져오기를 사용할 수 있습니다."}
              </div>
            </div>
            <button
              className="btn btn-outline-secondary btn-sm flex-shrink-0 ms-2"
              onClick={handleImport}
              disabled={!hasExported}
            >
              가져오기
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleFileSelected}
            />
          </div>
        </div>
      </div>

      {/* 앱 정보 */}
      <div className="card mb-2">
        <div className="card-body p-3">
          <h6 className="fw-bold small mb-2 d-flex align-items-center gap-1">
            <CheckCircle size={14} />
            앱 정보
          </h6>
          <div className="text-muted small">
            <div>우마 플래너 v2.1</div>
          </div>
        </div>
      </div>
    </>
  );
}
