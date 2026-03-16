import { useState, useEffect } from "react";
import { useStore } from "../hooks/useStore";
import { formatRacetrackLabel, formatFailureCause } from "../utils";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { BarChart2, ClipboardList, CheckCircle, XCircle, TrendingUp, Inbox } from "lucide-react";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const CAUSE_TYPE_LABELS = {
  훈련실패: "훈련실패",
  상태이상: "상태이상",
  "": "전체",
};

const PALETTE = ["#f72585", "#7209b7", "#3a0ca3", "#75A7E7", "#4cc9f0", "#22c55e", "#ffd166", "#EF4444"];

export default function Stats() {
  const { data: records, load: loadRecords } = useStore("records");
  const { data: racetracks, load: loadRacetracks } = useStore("racetracks");
  const { data: characters, load: loadCharacters } = useStore("characters");
  const [filterRtId, setFilterRtId] = useState("");
  const [filterUmaName, setFilterUmaName] = useState("");
  const [causeTypeFilter, setCauseTypeFilter] = useState("");

  useEffect(() => {
    loadRecords();
    loadRacetracks();
    loadCharacters();
  }, []);

  // umaName 목록 (records + characters 합산)
  const allUmaNames = [
    ...new Set([
      ...records.map((r) => r.umaName || characters.find((c) => c.id === r.characterId)?.name).filter(Boolean),
      ...characters.map((c) => c.name),
    ]),
  ].sort();

  const filtered = records.filter((r) => {
    if (filterRtId && r.racetracksId !== filterRtId) return false;
    if (filterUmaName) {
      const name = r.umaName || characters.find((c) => c.id === r.characterId)?.name;
      if (name !== filterUmaName) return false;
    }
    return true;
  });

  const completeRecords = filtered.filter((r) => r.result === "완주");
  const incompleteRecords = filtered.filter((r) => r.result === "미완주" || !r.result);
  const completeCount = completeRecords.length;
  const incompleteCount = incompleteRecords.length;
  const completeRate = filtered.length > 0 ? Math.round((completeCount / filtered.length) * 100) : 0;

  // 미완주 원인 분포
  const causeCounts = {};
  incompleteRecords.forEach((r) => {
    const label = r.failureCause ? formatFailureCause(r.failureCause) : "원인 미상";
    causeCounts[label] = (causeCounts[label] || 0) + 1;
  });
  const causeLabels = Object.keys(causeCounts);
  const causeData = causeLabels.map((k) => causeCounts[k]);
  const causeEntries = Object.entries(causeCounts).sort((a, b) => b[1] - a[1]);

  // 미완주 원인 상세 목록 필터용
  const causeTypeOptions = [...new Set(incompleteRecords.map((r) => r.failureCause?.type).filter(Boolean))];
  const causeCountsFiltered = {};
  incompleteRecords
    .filter((r) => !causeTypeFilter || r.failureCause?.type === causeTypeFilter)
    .forEach((r) => {
      const label = r.failureCause ? formatFailureCause(r.failureCause) : "원인 미상";
      causeCountsFiltered[label] = (causeCountsFiltered[label] || 0) + 1;
    });
  const filteredCauseEntries = Object.entries(causeCountsFiltered).sort((a, b) => b[1] - a[1]);
  const filteredCauseTotal = filteredCauseEntries.reduce((s, [, c]) => s + c, 0);

  // 훈련실패 확률 분포
  const probBuckets = { "0-20%": 0, "21-40%": 0, "41-60%": 0, "61-80%": 0, "81-100%": 0 };
  incompleteRecords
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
  incompleteRecords
    .filter((r) => r.failureCause?.type === "상태이상")
    .forEach((r) => {
      const t = r.failureCause.conditionType || "기타";
      condCounts[t] = (condCounts[t] || 0) + 1;
    });

  // 우마무스메별 완주율
  const umaStats = {};
  filtered.forEach((r) => {
    const name = r.umaName || characters.find((c) => c.id === r.characterId)?.name || "?";
    if (!umaStats[name]) umaStats[name] = { complete: 0, total: 0 };
    umaStats[name].total++;
    if (r.result === "완주") umaStats[name].complete++;
  });
  const umaEntries = Object.entries(umaStats)
    .sort((a, b) => b[1].total - a[1].total)
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
          <BarChart2 size={15} className="me-1 text-danger" />
          통계
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
              value={filterUmaName}
              onChange={(e) => setFilterUmaName(e.target.value)}
            >
              <option value="">우마무스메 전체</option>
              {allUmaNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Inbox size={36} className="mb-2 text-muted" />
          <p>조건에 맞는 기록이 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 요약 카드 - 4열 */}
          <div className="row g-1 mb-2">
            {[
              { label: "총 기록", value: filtered.length, Icon: ClipboardList, color: "warning" },
              { label: "완주", value: completeCount, Icon: CheckCircle, color: "success" },
              { label: "미완주", value: incompleteCount, Icon: XCircle, color: "danger" },
              { label: "완주율", value: `${completeRate}%`, Icon: TrendingUp, color: "primary" },
            ].map((card) => (
              <div key={card.label} className="col-3">
                <div className={`card border-${card.color}`}>
                  <div className="card-body p-1 text-center">
                    <card.Icon size={16} className={`text-${card.color}`} />
                    <div className="fw-bold" style={{ fontSize: "1rem" }}>
                      {card.value}
                    </div>
                    <div className="stats-card-label">{card.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 완주/미완주 비율 */}
          <div className="card mb-2">
            <div className="card-body p-2">
              <h6 className="card-title small fw-bold mb-1">완주 / 미완주 비율</h6>
              <div style={{ position: "relative", height: "160px" }}>
                <Pie
                  data={{
                    labels: ["완주", "미완주"],
                    datasets: [{ data: [completeCount, incompleteCount], backgroundColor: ["#22c55e", "#EF4444"] }],
                  }}
                  options={chartOptions}
                />
              </div>
            </div>
          </div>

          {/* 미완주 원인 분포 */}
          {causeLabels.length > 0 && (
            <div className="card mb-2">
              <div className="card-body p-2">
                <h6 className="card-title small fw-bold mb-1">미완주 원인 분포</h6>
                <div style={{ position: "relative", height: "180px" }}>
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

          {/* 미완주 원인 상세 목록 */}
          {causeEntries.length > 0 && (
            <div className="card mb-2">
              <div className="card-body p-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h6 className="card-title small fw-bold mb-0">미완주 원인 상세</h6>
                  {causeTypeOptions.length > 1 && (
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "auto", maxWidth: "110px" }}
                      value={causeTypeFilter}
                      onChange={(e) => setCauseTypeFilter(e.target.value)}
                    >
                      <option value="">전체</option>
                      {causeTypeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <table className="table table-sm table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small">원인</th>
                      <th className="small text-end th-narrow">건수</th>
                      <th className="small text-end th-narrow">비율</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCauseEntries.map(([label, count]) => (
                      <tr key={label}>
                        <td className="small">{label}</td>
                        <td className="small text-end">{count}</td>
                        <td className="small text-end">
                          {filteredCauseTotal > 0 ? Math.round((count / filteredCauseTotal) * 100) : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 훈련 실패율 분포 */}
          {Object.values(probBuckets).some((v) => v > 0) && (
            <div className="card mb-2">
              <div className="card-body p-2">
                <h6 className="card-title small fw-bold mb-1">훈련실패 확률 분포</h6>
                <div style={{ position: "relative", height: "150px" }}>
                  <Bar
                    data={{
                      labels: Object.keys(probBuckets),
                      datasets: [{ data: Object.values(probBuckets), backgroundColor: "#75A7E7" }],
                    }}
                    options={barOptions}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 상태이상 종류별 */}
          {Object.keys(condCounts).length > 0 && (
            <div className="card mb-2">
              <div className="card-body p-2">
                <h6 className="card-title small fw-bold mb-1">상태이상 종류별</h6>
                <div style={{ position: "relative", height: "130px" }}>
                  <Bar
                    data={{
                      labels: Object.keys(condCounts),
                      datasets: [{ data: Object.values(condCounts), backgroundColor: "#EF4444" }],
                    }}
                    options={barOptions}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 우마무스메별 완주 현황 */}
          {umaEntries.length > 0 && (
            <div className="card mb-2">
              <div className="card-body p-2">
                <h6 className="card-title small fw-bold mb-1">우마무스메별 완주 현황 (상위 10)</h6>
                <div style={{ position: "relative", height: `${Math.max(120, umaEntries.length * 24)}px` }}>
                  <Bar
                    data={{
                      labels: umaEntries.map(([name]) => name),
                      datasets: [
                        {
                          label: "완주",
                          data: umaEntries.map(([, s]) => s.complete),
                          backgroundColor: "#06d6a0",
                        },
                        {
                          label: "미완주",
                          data: umaEntries.map(([, s]) => s.total - s.complete),
                          backgroundColor: "#ef476f",
                        },
                      ],
                    }}
                    options={{
                      ...barOptions,
                      plugins: {
                        ...barOptions.plugins,
                        legend: { display: true, position: "bottom", labels: { font: { size: 11 } } },
                      },
                      scales: { x: { stacked: true }, y: { stacked: true } },
                    }}
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
