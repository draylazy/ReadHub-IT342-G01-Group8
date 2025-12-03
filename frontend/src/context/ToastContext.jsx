import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import '../styles/toast.scss';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // 1. Define removeToast FIRST so it can be used below
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // 2. Define showToast SECOND and include removeToast in dependencies
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]); // Added dependency here

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            <div className="toast-icon">
              {toast.type === 'success' && <CheckCircle size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
            </div>
            <p className="toast-message">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="toast-close">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);