const TABS = [
  { id: 'training',   icon: 'bi-journal-text',  label: '훈련기록',      color: 'text-warning' },
  { id: 'stats',      icon: 'bi-bar-chart-fill', label: '통계',          color: 'text-danger'  },
  { id: 'racetracks', icon: 'bi-flag-fill',      label: '마장',          color: 'text-primary' },
  { id: 'characters', icon: 'bi-person-fill',    label: '우마무스메',    color: 'text-success' },
];

const PAGE_MAP = {
  training:   Pages.Training,
  stats:      Pages.Stats,
  racetracks: Pages.Racetracks,
  characters: Pages.Characters,
};

window.App = {
  currentPage: null,

  init() {
    this._renderNavbar();
    window.addEventListener('hashchange', () => this._route());
    this._route();
  },

  _renderNavbar() {
    const navbarArea = document.getElementById('navbar-area');
    const tabs = TABS.map(tab => `
      <li class="nav-item flex-fill text-center">
        <a class="nav-link app-tab" href="#${tab.id}" data-page="${tab.id}">
          <i class="bi ${tab.icon} ${tab.color}"></i>
          <span>${tab.label}</span>
        </a>
      </li>`).join('');
    navbarArea.innerHTML = `
      <ul class="nav app-nav d-flex justify-content-around border-bottom mb-0">
        ${tabs}
      </ul>`;
  },

  _route() {
    const hash = window.location.hash || '#training';
    const pageId = hash.slice(1) || 'training';
    const page = PAGE_MAP[pageId] || PAGE_MAP['training'];
    const resolvedId = PAGE_MAP[pageId] ? pageId : 'training';

    // 열려 있는 모달이 있으면 먼저 닫기
    document.querySelectorAll('.modal.show').forEach(el => {
      const m = bootstrap.Modal.getInstance(el);
      if (m) m.hide();
    });

    // 탭 활성화 업데이트
    document.querySelectorAll('.app-tab').forEach(a => {
      a.classList.toggle('active', a.dataset.page === resolvedId);
    });

    this.currentPage = resolvedId;
    const container = document.getElementById('page-content');
    page.render(container);
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
