window.Pages = window.Pages || {};

window.Pages.Training = {
  _filterRtId: '',
  _filterCharId: '',

  async render(container) {
    const [records, racetracks, characters] = await Promise.all([
      window.electronAPI.store.get('records'),
      window.electronAPI.store.get('racetracks'),
      window.electronAPI.store.get('characters'),
    ]);

    // 마지막 선택값 복원
    try {
      const saved = JSON.parse(localStorage.getItem('trainingFilters') || '{}');
      if (!this._filterRtId && saved.rtId)   this._filterRtId   = saved.rtId;
      if (!this._filterCharId && saved.charId) this._filterCharId = saved.charId;
    } catch {}

    container.innerHTML = this._pageHTML(records, racetracks, characters);
    this._renderModal(racetracks, characters);
    this._bindEvents(container);
  },

  _pageHTML(records, racetracks, characters) {
    const filtered = records.filter(r => {
      if (this._filterRtId   && r.racetracksId !== this._filterRtId)   return false;
      if (this._filterCharId && r.characterId   !== this._filterCharId) return false;
      return true;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const rtOpts = racetracks.map(rt =>
      `<option value="${rt.id}" ${this._filterRtId === rt.id ? 'selected' : ''}>${Utils.formatRacetrackLabel(rt)}</option>`
    ).join('');
    const charOpts = characters.map(c =>
      `<option value="${c.id}" ${this._filterCharId === c.id ? 'selected' : ''}>${c.name}</option>`
    ).join('');

    return `
      <div class="page-header">
        <h6><i class="bi bi-journal-text me-1 text-warning"></i>훈련기록</h6>
        <button class="btn btn-warning btn-sm text-white" id="btn-add-rec"
          ${racetracks.length === 0 || characters.length === 0 ? 'disabled title="마장과 우마무스메를 먼저 등록하세요"' : ''}>
          <i class="bi bi-plus-lg"></i> 등록
        </button>
      </div>
      ${racetracks.length === 0 || characters.length === 0 ? `
        <div class="alert alert-info small py-2">
          <i class="bi bi-info-circle me-1"></i>
          마장과 육성 우마무스메를 먼저 등록해 주세요.
        </div>` : ''}
      <div class="filter-bar">
        <div class="row g-1">
          <div class="col-6">
            <select class="form-select form-select-sm" id="filter-rt">
              <option value="">마장 전체</option>
              ${rtOpts}
            </select>
          </div>
          <div class="col-6">
            <select class="form-select form-select-sm" id="filter-char">
              <option value="">우마무스메 전체</option>
              ${charOpts}
            </select>
          </div>
        </div>
      </div>
      ${filtered.length === 0 ? this._emptyState() : this._table(filtered, racetracks, characters)}`;
  },

  _emptyState() {
    return `
      <div class="empty-state">
        <i class="bi bi-journal"></i>
        <p>기록이 없습니다.</p>
      </div>`;
  },

  _table(records, racetracks, characters) {
    const rtMap   = Object.fromEntries(racetracks.map(r => [r.id, r]));
    const charMap = Object.fromEntries(characters.map(c => [c.id, c]));

    const rows = records.map(rec => {
      const rt   = rtMap[rec.racetracksId];
      const char = charMap[rec.characterId];
      const rtLabel   = rt   ? `${rt.type === '챔피언스미팅' ? '챔미' : 'LoH'} ${rt.racecourse} ${rt.distance}m` : '-';
      const charLabel = char ? char.name : '-';
      const fcLabel   = Utils.formatFailureCause(rec.failureCause);
      return `
        <tr>
          <td style="font-size:0.72rem">${Utils.formatDateTime(rec.timestamp)}</td>
          <td>${rtLabel}</td>
          <td>${charLabel}</td>
          <td>${rec.horseName || '-'}</td>
          <td><span class="badge bg-secondary badge-sm">${fcLabel}</span></td>
          <td>
            <button class="btn btn-outline-danger btn-sm py-0 px-1 btn-del-rec" data-id="${rec.id}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>`;
    }).join('');

    return `
      <div class="table-responsive">
        <table class="table table-hover table-sm">
          <thead class="table-light">
            <tr>
              <th>등록시간</th><th>대상마장</th><th>우마무스메</th>
              <th>육성마</th><th>실패원인</th><th></th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  },

  _renderModal(racetracks, characters) {
    const rtOpts = racetracks.map(rt =>
      `<option value="${rt.id}">${Utils.formatRacetrackLabel(rt)}</option>`
    ).join('');
    const charOpts = characters.map(c =>
      `<option value="${c.id}">${c.name}</option>`
    ).join('');
    const failTypeRadios = Utils.FAILURE_TYPES.map(ft => `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="fail-type" id="ft-${ft.value}" value="${ft.value}">
        <label class="form-check-label small" for="ft-${ft.value}">${ft.label}</label>
      </div>`).join('');
    const condOpts = Utils.CONDITION_TYPES.map(ct =>
      `<option value="${ct}">${ct}</option>`
    ).join('');

    document.getElementById('modal-area').innerHTML = `
      <div class="modal fade" id="rec-modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header py-2">
              <h6 class="modal-title">훈련 실패 등록</h6>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-semibold small">대상 마장 <span class="text-danger">*</span></label>
                <select class="form-select form-select-sm" id="rec-rt-sel">
                  <option value="">-- 선택 --</option>
                  ${rtOpts}
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold small">육성중인 우마무스메 <span class="text-danger">*</span></label>
                <select class="form-select form-select-sm" id="rec-char-sel">
                  <option value="">-- 선택 --</option>
                  ${charOpts}
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold small">육성마 이름</label>
                <input type="text" class="form-control form-control-sm" id="rec-horse-name" placeholder="유저가 지은 말 이름 (선택)">
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold small">실패 원인 <span class="text-danger">*</span></label>
                <div class="border rounded p-2">
                  ${failTypeRadios}
                  <!-- 훈련실패 확률 -->
                  <div id="fail-prob-wrap" class="mt-2 ms-3 d-none">
                    <label class="form-label small mb-1">실패 확률 (%)</label>
                    <input type="number" class="form-control form-control-sm" id="rec-fail-prob"
                      min="0" max="100" placeholder="0~100">
                  </div>
                  <!-- 상태이상 종류 -->
                  <div id="condition-wrap" class="mt-2 ms-3 d-none">
                    <label class="form-label small mb-1">상태이상 종류</label>
                    <select class="form-select form-select-sm" id="rec-condition-type">
                      ${condOpts}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer py-2">
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">취소</button>
              <button type="button" class="btn btn-warning btn-sm text-white" id="btn-save-rec">저장</button>
            </div>
          </div>
        </div>
      </div>`;
  },

  _bindEvents(container) {
    // 필터 변경
    document.getElementById('filter-rt').addEventListener('change', e => {
      this._filterRtId = e.target.value;
      this._saveFilters();
      this.render(container);
    });
    document.getElementById('filter-char').addEventListener('change', e => {
      this._filterCharId = e.target.value;
      this._saveFilters();
      this.render(container);
    });

    // 등록 버튼
    const addBtn = document.getElementById('btn-add-rec');
    if (addBtn && !addBtn.disabled) {
      addBtn.addEventListener('click', () => {
        document.querySelectorAll('input[name="fail-type"]').forEach(r => r.checked = false);
        document.getElementById('rec-horse-name').value = '';
        document.getElementById('fail-prob-wrap').classList.add('d-none');
        document.getElementById('condition-wrap').classList.add('d-none');

        // 마지막 선택값 복원
        const rtSel   = document.getElementById('rec-rt-sel');
        const charSel = document.getElementById('rec-char-sel');
        if (this._filterRtId)   rtSel.value   = this._filterRtId;
        if (this._filterCharId) charSel.value = this._filterCharId;

        bootstrap.Modal.getOrCreateInstance(document.getElementById('rec-modal')).show();
      });
    }

    // 실패 타입 라디오 → 서브 옵션 표시
    document.querySelectorAll('input[name="fail-type"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const v = radio.value;
        document.getElementById('fail-prob-wrap').classList.toggle('d-none', v !== '훈련실패');
        document.getElementById('condition-wrap').classList.toggle('d-none', v !== '상태이상');
      });
    });

    // 삭제
    document.querySelectorAll('.btn-del-rec').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('삭제하시겠습니까?')) return;
        await window.electronAPI.store.delete('records', btn.dataset.id);
        Toast.show('삭제되었습니다.', 'danger');
        this.render(container);
      });
    });

    // 저장
    document.getElementById('btn-save-rec').addEventListener('click', async () => {
      const rtId    = document.getElementById('rec-rt-sel').value;
      const charId  = document.getElementById('rec-char-sel').value;
      const typeEl  = document.querySelector('input[name="fail-type"]:checked');
      if (!rtId)   { Toast.show('대상 마장을 선택하세요.', 'warning'); return; }
      if (!charId) { Toast.show('우마무스메를 선택하세요.', 'warning'); return; }
      if (!typeEl) { Toast.show('실패 원인을 선택하세요.', 'warning'); return; }

      const failureCause = { type: typeEl.value };
      if (typeEl.value === '훈련실패') {
        failureCause.trainingFailProb = parseInt(document.getElementById('rec-fail-prob').value) || 0;
      }
      if (typeEl.value === '상태이상') {
        failureCause.conditionType = document.getElementById('rec-condition-type').value;
      }

      await window.electronAPI.store.add('records', {
        timestamp:    new Date().toISOString(),
        racetracksId: rtId,
        characterId:  charId,
        horseName:    document.getElementById('rec-horse-name').value.trim(),
        failureCause,
      });
      Toast.show('등록되었습니다.');

      const modal = bootstrap.Modal.getInstance(document.getElementById('rec-modal'));
      document.getElementById('rec-modal').addEventListener('hidden.bs.modal', () => {
        this.render(container);
      }, { once: true });
      modal.hide();
    });
  },

  _saveFilters() {
    localStorage.setItem('trainingFilters', JSON.stringify({
      rtId:   this._filterRtId,
      charId: this._filterCharId,
    }));
  },
};
