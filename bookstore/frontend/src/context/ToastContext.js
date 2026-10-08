import React, { useState, useEffect } from "react";

const ToastContext = React.createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast" style={{
          background: toast.type === "error" ? "#dc2626" : toast.type === "warning" ? "#d97706" : "#16a34a"
        }}>
          <span>{toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "⚠"}</span>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => React.useContext(ToastContext);
