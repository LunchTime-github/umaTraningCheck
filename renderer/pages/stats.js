window.Pages = window.Pages || {};

window.Pages.Stats = {
  _filterRtId:   '',
  _filterCharId: '',
  _charts:       {},

  async render(container) {
    const [records, racetracks, characters] = await Promise.all([
      window.electronAPI.store.get('records'),
      window.electronAPI.store.get('racetracks'),
      window.electronAPI.store.get('characters'),
    ]);
    this._destroyCharts();
    container.innerHTML = this._pageHTML(racetracks, characters);
    this._bindFilterEvents(container);
    this._updateCharts(records, racetracks, characters);
  },

  _pageHTML(racetracks, characters) {
    const rtOpts = racetracks.map(rt =>
      `<option value="${rt.id}" ${this._filterRtId === rt.id ? 'selected' : ''}>${Utils.formatRacetrackLabel(rt)}</option>`
    ).join('');
    const charOpts = characters.map(c =>
      `<option value="${c.id}" ${this._filterCharId === c.id ? 'selected' : ''}>${c.name}</option>`
    ).join('');
    return `
      <div class="page-header">
        <h6><i class="bi bi-bar-chart-fill me-1 text-danger"></i>통계</h6>
      </div>
      <div class="filter-bar">
        <div class="row g-1">
          <div class="col-6">
            <select class="form-select form-select-sm" id="stat-filter-rt">
              <option value="">마장 전체</option>
              ${rtOpts}
            </select>
          </div>
          <div class="col-6">
            <select class="form-select form-select-sm" id="stat-filter-char">
              <option value="">우마무스메 전체</option>
              ${charOpts}
            </select>
          </div>
        </div>
      </div>
      <div id="stat-summary" class="row g-2 mb-3"></div>
      <div class="mb-3">
        <div class="card shadow-sm">
          <div class="card-body p-2">
            <h6 class="card-title small fw-bold mb-2">실패 원인 분포</h6>
            <div style="position:relative;height:220px">
              <canvas id="chart-cause"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <div class="card shadow-sm">
          <div class="card-body p-2">
            <h6 class="card-title small fw-bold mb-2">훈련실패 확률 분포</h6>
            <div style="position:relative;height:180px">
              <canvas id="chart-prob"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <div class="card shadow-sm">
          <div class="card-body p-2">
            <h6 class="card-title small fw-bold mb-2">상태이상 종류별</h6>
            <div style="position:relative;height:160px">
              <canvas id="chart-condition"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <div class="card shadow-sm">
          <div class="card-body p-2">
            <h6 class="card-title small fw-bold mb-2">우마무스메별 실패 횟수</h6>
            <div style="position:relative;height:180px">
              <canvas id="chart-char"></canvas>
            </div>
          </div>
        </div>
      </div>`;
  },

  _bindFilterEvents(container) {
    document.getElementById('stat-filter-rt').addEventListener('change', e => {
      this._filterRtId = e.target.value;
      this.render(container);
    });
    document.getElementById('stat-filter-char').addEventListener('change', e => {
      this._filterCharId = e.target.value;
      this.render(container);
    });
  },

  _getFiltered(records) {
    return records.filter(r => {
      if (this._filterRtId   && r.racetracksId !== this._filterRtId)   return false;
      if (this._filterCharId && r.characterId   !== this._filterCharId) return false;
      return true;
    });
  },

  _updateCharts(records, racetracks, characters) {
    const filtered = this._getFiltered(records);

    // 요약 카드
    this._renderSummary(filtered);

    if (filtered.length === 0) {
      document.getElementById('stat-summary').innerHTML = `
        <div class="col-12 text-center text-muted small py-3">
          <i class="bi bi-inbox fs-4 d-block mb-1"></i>조건에 맞는 기록이 없습니다.
        </div>`;
      return;
    }

    // 1. 실패 원인 분포 (도넛)
    const causeCounts = {};
    Utils.FAILURE_TYPES.forEach(ft => { causeCounts[ft.value] = 0; });
    filtered.forEach(r => {
      if (r.failureCause && causeCounts[r.failureCause.type] !== undefined) {
        causeCounts[r.failureCause.type]++;
      }
    });
    this._charts.cause = new Chart(document.getElementById('chart-cause'), {
      type: 'doughnut',
      data: {
        labels: Utils.FAILURE_TYPES.map(ft => ft.label),
        datasets: [{
          data: Utils.FAILURE_TYPES.map(ft => causeCounts[ft.value]),
          backgroundColor: ['#0d6efd','#198754','#ffc107','#dc3545','#6f42c1','#0dcaf0'],
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { font: { size: 10 }, boxWidth: 12 } } },
      },
    });

    // 2. 훈련실패 확률 분포 (히스토그램)
    const probRecs = filtered.filter(r => r.failureCause?.type === '훈련실패');
    const probBins = [0,5,10,15,20,25,30,40,50,60,70,80,90,100];
    const probCounts = new Array(probBins.length - 1).fill(0);
    probRecs.forEach(r => {
      const p = r.failureCause.trainingFailProb || 0;
      for (let i = 0; i < probBins.length - 1; i++) {
        if (p >= probBins[i] && p < probBins[i+1]) { probCounts[i]++; break; }
      }
    });
    const probLabels = probBins.slice(0,-1).map((v,i) => `${v}~${probBins[i+1]-1}%`);
    this._charts.prob = new Chart(document.getElementById('chart-prob'), {
      type: 'bar',
      data: {
        labels: probLabels,
        datasets: [{
          label: '건수',
          data: probCounts,
          backgroundColor: '#0d6efd88',
          borderColor: '#0d6efd',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { stepSize: 1 }, beginAtZero: true } },
      },
    });

    // 3. 상태이상 종류별 (가로 바)
    const condCounts = {};
    Utils.CONDITION_TYPES.forEach(ct => { condCounts[ct] = 0; });
    filtered .filter(r => r.failureCause?.type === '상태이상')
             .forEach(r => {
               const ct = r.failureCause.conditionType;
               if (ct && condCounts[ct] !== undefined) condCounts[ct]++;
             });
    this._charts.condition = new Chart(document.getElementById('chart-condition'), {
      type: 'bar',
      data: {
        labels: Utils.CONDITION_TYPES,
        datasets: [{
          label: '건수',
          data: Utils.CONDITION_TYPES.map(ct => condCounts[ct]),
          backgroundColor: ['#ffc10788','#dc354588','#6f42c188'],
          borderColor:     ['#ffc107',  '#dc3545',  '#6f42c1'],
          borderWidth: 1,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { stepSize: 1 }, beginAtZero: true } },
      },
    });

    // 4. 우마무스메별 실패 횟수
    const charMap = Object.fromEntries(
      (characters || []).map(c => [c.id, c.name])
    );
    const charCounts = {};
    filtered.forEach(r => {
      const name = charMap[r.characterId] || r.characterId || '미등록';
      charCounts[name] = (charCounts[name] || 0) + 1;
    });
    const charEntries = Object.entries(charCounts).sort((a,b) => b[1]-a[1]);
    this._charts.char = new Chart(document.getElementById('chart-char'), {
      type: 'bar',
      data: {
        labels: charEntries.map(e => e[0]),
        datasets: [{
          label: '실패 횟수',
          data: charEntries.map(e => e[1]),
          backgroundColor: '#19875488',
          borderColor: '#198754',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { stepSize: 1 }, beginAtZero: true } },
      },
    });
  },

  _renderSummary(filtered) {
    const total    = filtered.length;
    const trainFail = filtered.filter(r => r.failureCause?.type === '훈련실패').length;
    const condition = filtered.filter(r => r.failureCause?.type === '상태이상').length;
    document.getElementById('stat-summary').innerHTML = `
      <div class="col-4">
        <div class="card text-center border-0 bg-light py-2">
          <div class="fs-5 fw-bold text-primary">${total}</div>
          <div class="small text-muted">총 기록</div>
        </div>
      </div>
      <div class="col-4">
        <div class="card text-center border-0 bg-light py-2">
          <div class="fs-5 fw-bold text-danger">${trainFail}</div>
          <div class="small text-muted">훈련실패</div>
        </div>
      </div>
      <div class="col-4">
        <div class="card text-center border-0 bg-light py-2">
          <div class="fs-5 fw-bold text-warning">${condition}</div>
          <div class="small text-muted">상태이상</div>
        </div>
      </div>`;
  },

  _destroyCharts() {
    Object.values(this._charts).forEach(c => { try { c.destroy(); } catch {} });
    this._charts = {};
  },
};
