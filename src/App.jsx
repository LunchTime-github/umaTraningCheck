import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Training from "./pages/Training";
import Characters from "./pages/Characters";
import Racetracks from "./pages/Racetracks";
import Stats from "./pages/Stats";
import { ToastProvider } from "./context/ToastContext";

const PAGES = { training: Training, stats: Stats, racetracks: Racetracks, characters: Characters };

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
          <img src="./favicon.svg" alt="logo" />
          <span>우마무스메 육성 기록</span>
        </div>
        <Navbar currentPage={page} onNavigate={navigate} />
        <div id="page-content">
          <PageComponent />
        </div>
      </div>
    </ToastProvider>
  );
}
