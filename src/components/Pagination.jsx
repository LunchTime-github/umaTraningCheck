export default function Pagination({ total, page, pageSize, onPage }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const delta = 2;
  const start = Math.max(1, page - delta);
  const end = Math.min(totalPages, page + delta);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="mt-2">
      <ul className="pagination pagination-sm justify-content-center mb-0">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link py-0 px-2" onClick={() => onPage(1)}>
            «
          </button>
        </li>
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link py-0 px-2" onClick={() => onPage(page - 1)}>
            ‹
          </button>
        </li>
        {start > 1 && (
          <li className="page-item disabled">
            <span className="page-link py-0 px-2">…</span>
          </li>
        )}
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
            <button className="page-link py-0 px-2" onClick={() => onPage(p)}>
              {p}
            </button>
          </li>
        ))}
        {end < totalPages && (
          <li className="page-item disabled">
            <span className="page-link py-0 px-2">…</span>
          </li>
        )}
        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button className="page-link py-0 px-2" onClick={() => onPage(page + 1)}>
            ›
          </button>
        </li>
        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button className="page-link py-0 px-2" onClick={() => onPage(totalPages)}>
            »
          </button>
        </li>
      </ul>
      <div className="text-center text-muted mt-1" style={{ fontSize: "0.7rem" }}>
        {total}건 중 {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)}
      </div>
    </nav>
  );
}
