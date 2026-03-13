import { useState, useEffect, useRef } from "react";
import { useStore } from "../hooks/useStore";
import { formatRacetrackLabel, formatFailureCause } from "../utils";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const PALETTE = ["#f72585", "#7209b7", "#3a0ca3", "#4361ee", "#4cc9f0", "#06d6a0", "#ffd166", "#ef476f"];

export default function Stats() {
  const { data: records, load: loadRecords } = useStore("records");
  const { data: racetracks, load: loadRacetracks } = useStore("racetracks");
  const { data: characters, load: loadCharacters } = useStore("characters");
  const [filterRtId, setFilterRtId] = useState("");
  const [filterCharId, setFilterCharId] = useState("");

  useEffect(() => {
    loadRecords();
    loadRacetracks();
    loadCharacters();
  }, []);

  const filtered = records.filter((r) => {
    if (filterRtId && r.racetracksId !== filterRtId) return false;
    if (filterCharId && r.characterId !== filterCharId) return false;
    return true;
  });

  const failRecords = filtered.filter((r) => r.result !== "성공");
  const successCount = filtered.length - failRecords.length;
  const failCount = failRecords.length;
  const rate = filtered.length > 0 ? Math.round((successCount / filtered.length) * 100) : 0;

  // 실패 원인 분포
  const causeCounts = {};
  failRecords.forEach((r) => {
    const label = formatFailureCause(r.failureCause);
    causeCounts[label] = (causeCounts[label] || 0) + 1;
  });
  const causeLabels = Object.keys(causeCounts);
  const causeData = causeLabels.map((k) => causeCounts[k]);

  // 훈련실패 확률 분포
  const probBuckets = { "0-20%": 0, "21-40%": 0, "41-60%": 0, "61-80%": 0, "81-100%": 0 };
  failRecords
    .filter((r) => r.failureCause?.type === "훈련실패" && r.failureCause?.trainingFailProb != null)
    .forEach((r) => {
      const p = parseInt(r.failureCause.trainingFailProb);
      if (p <= 20) probBuckets["0-20%"]++;
      else if (p <= 40) probBuckets["21-40%"]++;
      else if (p <= 60) probBuckets["41-60%"]++;
      else if (p <= 80) probBuckets["61-80%"]++;
      else probBuckets["81-100%"]++;
    });

  // 상태이상 종류
  const condCounts = {};
  failRecords
    .filter((r) => r.failureCause?.type === "상태이상")
    .forEach((r) => {
      const t = r.failureCause.conditionType || "기타";
      condCounts[t] = (condCounts[t] || 0) + 1;
    });

  // 우마무스메별 실패 횟수
  const charCounts = {};
  failRecords.forEach((r) => {
    const ch = characters.find((c) => c.id === r.characterId);
    const name = ch?.name || "?";
    charCounts[name] = (charCounts[name] || 0) + 1;
  });
  const charEntries = Object.entries(charCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom", labels: { font: { size: 11 } } } },
  };
  const barOptions = {
    ...chartOptions,
    indexAxis: "y",
    plugins: { ...chartOptions.plugins, legend: { display: false } },
  };

  return (
    <>
      <div className="page-header">
        <h6>
          <i className="bi bi-bar-chart-fill me-1 text-danger"></i>통계
        </h6>
      </div>

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
          <i className="bi bi-inbox fs-2 d-block mb-2"></i>
          <p>조건에 맞는 기록이 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 요약 카드 */}
          <div className="row g-2 mb-3">
            {[
              { label: "총 기록", value: filtered.length, icon: "journal-text", color: "warning" },
              { label: "실패", value: failCount, icon: "x-circle", color: "danger" },
              { label: "성공", value: successCount, icon: "check-circle", color: "success" },
              { label: "성공률", value: `${rate}%`, icon: "graph-up", color: "primary" },
            ].map((card) => (
              <div key={card.label} className="col-6">
                <div className={`card border-${card.color} shadow-sm`}>
                  <div className="card-body p-2 text-center">
                    <i className={`bi bi-${card.icon} text-${card.color} fs-5`}></i>
                    <div className="fw-bold fs-5">{card.value}</div>
                    <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                      {card.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 실패 원인 분포 */}
          {causeLabels.length > 0 && (
            <div className="card shadow-sm mb-3">
              <div className="card-body p-2">
                <h6 className="card-title small fw-bold mb-2">실패 원인 분포</h6>
                <div style={{ position: "relative", height: "220px" }}>
                  <Pie
                    data={{
                      labels: causeLabels,
                      datasets: [{ data: causeData, backgroundColor: PALETTE }],
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 훈련 실패율 분포 */}
          {Object.values(probBuckets).some((v) => v > 0) && (
            <div className="card shadow-sm mb-3">
              <div className="card-body p-2">
                <h6 className="card-title small fw-bold mb-2">훈련실패 확률 분포</h6>
                <div style={{ position: "relative", height: "180px" }}>
                  <Bar
                    data={{
                      labels: Object.keys(probBuckets),
                      datasets: [{ data: Object.values(probBuckets), backgroundColor: "#4361ee" }],
                    }}
                    options={barOptions}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 상태이상 종류별 */}
          {Object.keys(condCounts).length > 0 && (
            <div className="card shadow-sm mb-3">
              <div className="card-body p-2">
                <h6 className="card-title small fw-bold mb-2">상태이상 종류별</h6>
                <div style={{ position: "relative", height: "150px" }}>
                  <Bar
                    data={{
                      labels: Object.keys(condCounts),
                      datasets: [{ data: Object.values(condCounts), backgroundColor: "#ef476f" }],
                    }}
                    options={barOptions}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 우마무스메별 실패 횟수 */}
          {charEntries.length > 0 && (
            <div className="card shadow-sm mb-3">
              <div className="card-body p-2">
                <h6 className="card-title small fw-bold mb-2">우마무스메별 실패 횟수 (상위 10)</h6>
                <div style={{ position: "relative", height: `${Math.max(150, charEntries.length * 28)}px` }}>
                  <Bar
                    data={{
                      labels: charEntries.map(([name]) => name),
                      datasets: [{ data: charEntries.map(([, count]) => count), backgroundColor: "#f72585" }],
                    }}
                    options={barOptions}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
