'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, title = '') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (message, title = 'Success') => addToast('success', message, title),
    error: (message, title = 'Error') => addToast('error', message, title),
    info: (message, title = 'Info') => addToast('info', message, title),
    warning: (message, title = 'Warning') => addToast('warning', message, title),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 sm:top-5 left-4 right-4 sm:left-auto sm:right-5 z-[9999] flex flex-col gap-3 max-w-sm w-[calc(100%-2rem)] sm:w-full pointer-events-none mx-auto sm:mx-0">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastItem({ toast, onClose }) {
  const { type, message, title } = toast;

  const styles = {
    success: {
      bg: 'bg-emerald-900/90 text-white border-emerald-500/30',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
      accent: 'bg-emerald-400',
    },
    error: {
      bg: 'bg-rose-900/90 text-white border-rose-500/30',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
      accent: 'bg-rose-400',
    },
    warning: {
      bg: 'bg-amber-900/90 text-white border-amber-500/30',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
      accent: 'bg-amber-400',
    },
    info: {
      bg: 'bg-sky-900/90 text-white border-sky-500/30',
      icon: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
      accent: 'bg-sky-400',
    },
  };

  const style = styles[type] || styles.info;

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-in relative overflow-hidden ${style.bg}`}
    >
      <div className="pt-0.5">{style.icon}</div>
      <div className="flex-1 min-w-0 pr-2">
        {title && <h4 className="text-xs font-bold uppercase tracking-wider opacity-90 mb-0.5">{title}</h4>}
        <p className="text-sm font-medium leading-snug">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
