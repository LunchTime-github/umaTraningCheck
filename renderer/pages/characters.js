window.Pages = window.Pages || {};

window.Pages.Characters = {
  _filterText: '',

  async render(container) {
    const data = await window.electronAPI.store.get('characters');
    container.innerHTML = this._pageHTML(data);
    this._renderModal();
    this._bindEvents(container, data);
  },

  _pageHTML(data) {
    const filtered = data.filter(c =>
      c.name.includes(this._filterText)
    );
    return `
      <div class="page-header">
        <h6><i class="bi bi-person-fill me-1 text-success"></i>육성 우마무스메</h6>
        <button class="btn btn-success btn-sm" id="btn-add-char">
          <i class="bi bi-plus-lg"></i> 등록
        </button>
      </div>
      <div class="filter-bar mb-2">
        <input type="text" class="form-control form-control-sm" id="char-search"
          placeholder="이름 검색..." value="${this._filterText}">
      </div>
      ${filtered.length === 0 ? this._emptyState(data.length > 0) : this._table(filtered)}`;
  },

  _emptyState(hasData) {
    return `
      <div class="empty-state">
        <i class="bi bi-person-circle"></i>
        <p>${hasData ? '검색 결과가 없습니다.' : '등록된 우마무스메가 없습니다.<br>우측 상단 버튼으로 추가하세요.'}</p>
      </div>`;
  },

  _table(data) {
    const sorted = [...data].sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
    const rows = sorted.map(c => `
      <tr>
        <td class="fw-semibold">${c.name}</td>
        <td>${Utils.formatDate(c.releaseDate)}</td>
        <td>
          <button class="btn btn-outline-secondary btn-sm py-0 px-1 btn-link-char" data-key="${c.urlKey}" title="gametora 페이지 열기">
            <i class="bi bi-box-arrow-up-right"></i>
          </button>
        </td>
        <td>
          <button class="btn btn-outline-danger btn-sm py-0 px-1 btn-del-char" data-id="${c.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>`).join('');
    return `
      <div class="table-responsive">
        <table class="table table-hover table-sm">
          <thead class="table-light">
            <tr>
              <th>이름</th><th>출시일</th><th>링크</th><th></th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  },

  _renderModal() {
    const opts = CHARACTERS_STATIC.map(c =>
      `<option value="${c.id}" data-release="${c.releaseDate}" data-key="${c.urlKey}">${c.name}</option>`
    ).join('');
    document.getElementById('modal-area').innerHTML = `
      <div class="modal fade" id="char-modal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header py-2">
              <h6 class="modal-title">육성 우마무스메 등록</h6>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-semibold small">우마무스메 <span class="text-danger">*</span></label>
                <select class="form-select form-select-sm" id="char-select">
                  <option value="">-- 선택 --</option>
                  ${opts}
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold small">출시일</label>
                <input type="date" class="form-control form-control-sm" id="char-release-date">
              </div>
            </div>
            <div class="modal-footer py-2">
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">취소</button>
              <button type="button" class="btn btn-success btn-sm" id="btn-save-char">저장</button>
            </div>
          </div>
        </div>
      </div>`;
  },

  _bindEvents(container) {
    // 검색 필터
    document.getElementById('char-search').addEventListener('input', e => {
      this._filterText = e.target.value;
      this.render(container);
    });

    // 등록 버튼
    document.getElementById('btn-add-char').addEventListener('click', () => {
      document.getElementById('char-select').value = '';
      document.getElementById('char-release-date').value = '';
      bootstrap.Modal.getOrCreateInstance(document.getElementById('char-modal')).show();
    });

    // 캐릭터 select → 출시일 자동 입력
    document.getElementById('char-select').addEventListener('change', e => {
      const opt = e.target.options[e.target.selectedIndex];
      document.getElementById('char-release-date').value = opt.dataset.release || '';
    });

    // gametora 링크
    document.querySelectorAll('.btn-link-char').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = `https://gametora.com/ko/umamusume/characters/${btn.dataset.key}`;
        window.electronAPI.shell.openExternal(url);
      });
    });

    // 삭제
    document.querySelectorAll('.btn-del-char').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('삭제하시겠습니까?')) return;
        await window.electronAPI.store.delete('characters', btn.dataset.id);
        Toast.show('삭제되었습니다.', 'danger');
        this.render(container);
      });
    });

    // 저장
    document.getElementById('btn-save-char').addEventListener('click', async () => {
      const selEl = document.getElementById('char-select');
      const selId = parseInt(selEl.value);
      if (!selId) { Toast.show('우마무스메를 선택하세요.', 'warning'); return; }

      const staticChar = CHARACTERS_STATIC.find(c => c.id === selId);
      if (!staticChar) return;

      // 중복 확인
      const existing = await window.electronAPI.store.get('characters');
      if (existing.find(c => c.name === staticChar.name)) {
        Toast.show('이미 등록된 우마무스메입니다.', 'warning'); return;
      }

      const releaseDate = document.getElementById('char-release-date').value || staticChar.releaseDate;
      await window.electronAPI.store.add('characters', {
        name: staticChar.name,
        releaseDate,
        urlKey: staticChar.urlKey,
      });
      Toast.show('등록되었습니다.');

      const modal = bootstrap.Modal.getInstance(document.getElementById('char-modal'));
      document.getElementById('char-modal').addEventListener('hidden.bs.modal', () => {
        this._filterText = '';
        this.render(container);
      }, { once: true });
      modal.hide();
    });
  },
};
