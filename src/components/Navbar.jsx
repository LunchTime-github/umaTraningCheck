const TABS = [
  { id: "training", icon: "bi-journal-text", label: "훈련기록", color: "text-warning" },
  { id: "stats", icon: "bi-bar-chart-fill", label: "통계", color: "text-danger" },
  { id: "racetracks", icon: "bi-flag-fill", label: "마장", color: "text-primary" },
  { id: "characters", icon: "bi-person-fill", label: "우마무스메", color: "text-success" },
];

export default function Navbar({ currentPage, onNavigate }) {
  return (
    <div id="navbar-area">
      <ul className="nav app-nav d-flex justify-content-around border-bottom mb-0">
        {TABS.map((tab) => (
          <li key={tab.id} className="nav-item flex-fill text-center">
            <a
              className={`nav-link app-tab${currentPage === tab.id ? " active" : ""}`}
              href={`#${tab.id}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(tab.id);
              }}
            >
              <i className={`bi ${tab.icon} ${tab.color}`}></i>
              <span>{tab.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
