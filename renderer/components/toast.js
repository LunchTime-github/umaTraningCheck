window.Toast = {
  show(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const id = 'toast-' + Date.now();
    const map = {
      success: 'text-bg-success',
      danger:  'text-bg-danger',
      warning: 'text-bg-warning',
      info:    'text-bg-info',
    };
    const cls = map[type] || 'text-bg-secondary';
    container.insertAdjacentHTML('beforeend', `
      <div id="${id}" class="toast align-items-center ${cls} border-0" role="alert" data-bs-autohide="true" data-bs-delay="2500">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>`);
    const el = document.getElementById(id);
    const t = new bootstrap.Toast(el);
    t.show();
    el.addEventListener('hidden.bs.toast', () => el.remove());
  },
};
