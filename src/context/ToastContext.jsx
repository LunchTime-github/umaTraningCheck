import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const iconMap = {
    success: "check-circle-fill",
    error: "x-circle-fill",
    warning: "exclamation-triangle-fill",
    info: "info-circle-fill",
  };
  const bgMap = { success: "bg-success", error: "bg-danger", warning: "bg-warning", info: "bg-info" };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div
        className="position-fixed bottom-0 start-50 translate-middle-x p-3"
        style={{ zIndex: 9999, width: "420px", pointerEvents: "none" }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast show mb-1 ${bgMap[t.type] || "bg-success"} text-white border-0`}
            style={{ pointerEvents: "auto" }}
          >
            <div className="toast-body small d-flex align-items-center gap-2">
              <i className={`bi bi-${iconMap[t.type] || "check-circle-fill"}`}></i>
              {t.message}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
