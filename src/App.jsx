import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Training from "./pages/Training";
import Racetracks from "./pages/Racetracks";
import Stats from "./pages/Stats";
import WantedUma from "./pages/WantedUma";
import SettingsPage from "./pages/Settings";
import { ToastProvider } from "./context/ToastContext";

const PAGES = { training: Training, stats: Stats, racetracks: Racetracks, wanteduma: WantedUma, settings: SettingsPage };

export default function App() {
  const [page, setPage] = useState(() => {
    const hash = window.location.hash.slice(1);
    return PAGES[hash] ? hash : "training";
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (PAGES[hash]) setPage(hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (pageId) => {
    window.location.hash = pageId;
    setPage(pageId);
  };

  const PageComponent = PAGES[page];

  return (
    <ToastProvider>
      <div id="app-wrapper">
        <div className="app-brand">
          <img src="./icon.png" alt="logo" />
          <span>우마 플래너</span>
        </div>
        <Navbar currentPage={page} onNavigate={navigate} />
        <div id="page-content">
          <PageComponent />
        </div>
      </div>
    </ToastProvider>
  );
}
