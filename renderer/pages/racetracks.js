window.Pages = window.Pages || {};

window.Pages.Racetracks = {
  _editId: null,

  async render(container) {
    const data = await window.electronAPI.store.get('racetracks');
    container.innerHTML = this._pageHTML(data);
    this._renderModal();
    this._bindEvents();
  },

  _pageHTML(data) {
    return `
      <div class="page-header">
        <h6><i class="bi bi-flag-fill me-1 text-primary"></i>마장</h6>
        <button class="btn btn-primary btn-sm" id="btn-add-rt">
          <i class="bi bi-plus-lg"></i> 등록
        </button>
      </div>
      ${data.length === 0 ? this._emptyState() : this._table(data)}`;
  },

  _emptyState() {
    return `
      <div class="empty-state">
        <i class="bi bi-flag"></i>
        <p>등록된 마장이 없습니다.<br>우측 상단 버튼으로 추가하세요.</p>
      </div>`;
  },

  _table(data) {
    const rows = data.map(rt => `
      <tr data-id="${rt.id}" style="cursor:pointer">
        <td><span class="badge ${rt.type === '챔피언스미팅' ? 'bg-primary' : 'bg-success'} badge-sm">${rt.type === '챔피언스미팅' ? '챔미' : 'LoH'}</span></td>
        <td>${rt.racecourse}</td>
        <td class="text-nowrap" style="font-size:0.72rem">${rt.startDate}<br>~${rt.endDate}</td>
        <td>${rt.surface}</td>
        <td>${rt.distance}m<br><span class="text-muted" style="font-size:0.7rem">${Utils.getDistanceCategory(rt.distance)}</span></td>
        <td>${rt.direction}</td>
        <td>
          <button class="btn btn-outline-danger btn-sm py-0 px-1 btn-del-rt" data-id="${rt.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>`).join('');
    return `
      <div class="table-responsive">
        <table class="table table-hover table-sm" id="rt-table">
          <thead class="table-light">
            <tr>
              <th>종류</th><th>경기장</th><th>기간</th>
              <th>마장</th><th>거리</th><th>방향</th><th></th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  },

  _renderModal() {
    const opts = RACETRACKS_STATIC.map(r =>
      `<option value="${r.id}">${r.name} · ${r.surface} · ${r.distance}m · ${r.direction}</option>`
    ).join('');
    document.getElementById('modal-area').innerHTML = `
      <div class="modal fade" id="rt-modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header py-2">
              <h6 class="modal-title" id="rt-modal-title">마장 등록</h6>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="rt-form">
                <div class="mb-3">
                  <label class="form-label fw-semibold small">종류 <span class="text-danger">*</span></label>
                  <div class="d-flex gap-3">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="rt-type" id="rt-type-cm" value="챔피언스미팅">
                      <label class="form-check-label small" for="rt-type-cm">챔피언스미팅</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="rt-type" id="rt-type-loh" value="리그오브히어로즈">
                      <label class="form-check-label small" for="rt-type-loh">리그오브히어로즈</label>
                    </div>
                  </div>
                </div>
                <div class="row g-2 mb-3">
                  <div class="col-6">
                    <label class="form-label fw-semibold small">시작일</label>
                    <input type="date" class="form-control form-control-sm" id="rt-start-date">
                  </div>
                  <div class="col-6">
                    <label class="form-label fw-semibold small">종료일</label>
                    <input type="date" class="form-control form-control-sm" id="rt-end-date">
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold small">경기장</label>
                  <select class="form-select form-select-sm" id="rt-racecourse-sel">
                    <option value="">-- 경기장 선택 (자동 입력) --</option>
                    ${opts}
                  </select>
                </div>
                <div class="row g-2 mb-3">
                  <div class="col-4">
                    <label class="form-label fw-semibold small">마장</label>
                    <select class="form-select form-select-sm" id="rt-surface">
                      <option value="잔디">잔디</option>
                      <option value="더트">더트</option>
                    </select>
                  </div>
                  <div class="col-4">
                    <label class="form-label fw-semibold small">방향</label>
                    <select class="form-select form-select-sm" id="rt-direction">
                      <option value="시계">시계</option>
                      <option value="반시계">반시계</option>
                    </select>
                  </div>
                  <div class="col-4">
                    <label class="form-label fw-semibold small">거리 (m)</label>
                    <div class="input-group input-group-sm">
                      <input type="number" class="form-control" id="rt-distance" min="800" max="3600" step="100">
                    </div>
                    <div class="text-muted" style="font-size:0.7rem;margin-top:2px" id="rt-dist-cat"></div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer py-2">
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">취소</button>
              <button type="button" class="btn btn-primary btn-sm" id="btn-save-rt">저장</button>
            </div>
          </div>
        </div>
      </div>`;
  },

  _bindEvents() {
    const container = document.getElementById('page-content');

    // 등록 버튼
    document.getElementById('btn-add-rt').addEventListener('click', () => {
      this._editId = null;
      document.getElementById('rt-modal-title').textContent = '마장 등록';
      document.getElementById('rt-form').reset();
      document.getElementById('rt-dist-cat').textContent = '';
      bootstrap.Modal.getOrCreateInstance(document.getElementById('rt-modal')).show();
    });

    // 경기장 select → 자동 입력
    document.getElementById('rt-racecourse-sel').addEventListener('change', e => {
      const rt = RACETRACKS_STATIC.find(r => r.id === parseInt(e.target.value));
      if (!rt) return;
      document.getElementById('rt-surface').value = rt.surface;
      document.getElementById('rt-distance').value = rt.distance;
      document.getElementById('rt-direction').value = rt.direction;
      document.getElementById('rt-dist-cat').textContent = Utils.getDistanceCategory(rt.distance);
    });

    // 거리 직접 입력 → 카테고리 갱신
    document.getElementById('rt-distance').addEventListener('input', e => {
      document.getElementById('rt-dist-cat').textContent = Utils.getDistanceCategory(e.target.value);
    });

    // 테이블 행 클릭 → 수정
    const tbody = document.querySelector('#rt-table tbody');
    if (tbody) {
      tbody.addEventListener('click', async e => {
        if (e.target.closest('.btn-del-rt')) return;
        const row = e.target.closest('tr');
        if (!row) return;
        const all = await window.electronAPI.store.get('racetracks');
        const rt = all.find(r => r.id === row.dataset.id);
        if (!rt) return;
        this._editId = rt.id;
        this._fillModal(rt);
        document.getElementById('rt-modal-title').textContent = '마장 수정';
        bootstrap.Modal.getOrCreateInstance(document.getElementById('rt-modal')).show();
      });
    }

    // 삭제
    document.querySelectorAll('.btn-del-rt').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.stopPropagation();
        if (!confirm('삭제하시겠습니까?')) return;
        await window.electronAPI.store.delete('racetracks', btn.dataset.id);
        Toast.show('삭제되었습니다.', 'danger');
        this.render(container);
      });
    });

    // 저장
    document.getElementById('btn-save-rt').addEventListener('click', async () => {
      const typeEl = document.querySelector('input[name="rt-type"]:checked');
      if (!typeEl) { Toast.show('종류를 선택하세요.', 'warning'); return; }
      const startDate = document.getElementById('rt-start-date').value;
      const endDate   = document.getElementById('rt-end-date').value;
      const distance  = document.getElementById('rt-distance').value;
      if (!startDate || !endDate || !distance) {
        Toast.show('필수 항목을 모두 입력하세요.', 'warning'); return;
      }

      let racecourse = '';
      const selId = parseInt(document.getElementById('rt-racecourse-sel').value);
      if (selId) {
        const staticRt = RACETRACKS_STATIC.find(r => r.id === selId);
        if (staticRt) racecourse = staticRt.name;
      }

      const item = {
        type:       typeEl.value,
        startDate,
        endDate,
        racecourse,
        surface:    document.getElementById('rt-surface').value,
        distance:   parseInt(distance),
        direction:  document.getElementById('rt-direction').value,
      };

      if (this._editId) {
        await window.electronAPI.store.update('racetracks', this._editId, item);
        Toast.show('수정되었습니다.');
      } else {
        await window.electronAPI.store.add('racetracks', item);
        Toast.show('등록되었습니다.');
      }

      const modal = bootstrap.Modal.getInstance(document.getElementById('rt-modal'));
      document.getElementById('rt-modal').addEventListener('hidden.bs.modal', () => {
        this.render(container);
      }, { once: true });
      modal.hide();
    });
  },

  _fillModal(rt) {
    const typeEl = document.querySelector(`input[name="rt-type"][value="${rt.type}"]`);
    if (typeEl) typeEl.checked = true;
    document.getElementById('rt-start-date').value = rt.startDate || '';
    document.getElementById('rt-end-date').value   = rt.endDate || '';
    document.getElementById('rt-surface').value    = rt.surface;
    document.getElementById('rt-distance').value   = rt.distance;
    document.getElementById('rt-direction').value  = rt.direction;
    document.getElementById('rt-dist-cat').textContent = Utils.getDistanceCategory(rt.distance);
    const match = RACETRACKS_STATIC.find(r =>
      r.name === rt.racecourse && r.surface === rt.surface &&
      r.distance === rt.distance && r.direction === rt.direction
    );
    document.getElementById('rt-racecourse-sel').value = match ? match.id : '';
  },
};
