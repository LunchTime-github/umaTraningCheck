import { ClipboardList, BarChart2, Flag, Users, Settings } from "lucide-react";

const TABS = [
  { id: "training", Icon: ClipboardList, label: "훈련기록", color: "text-warning" },
  { id: "stats", Icon: BarChart2, label: "통계", color: "text-danger" },
  { id: "racetracks", Icon: Flag, label: "마장", color: "text-primary" },
  { id: "wanteduma", Icon: Users, label: "출주희망", color: "text-success" },
  { id: "settings", Icon: Settings, label: "설정", color: "text-secondary" },
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
              <tab.Icon size={16} className={tab.color} />
              <span>{tab.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
