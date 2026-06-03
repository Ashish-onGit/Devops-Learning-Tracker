import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X, Loader2 } from 'lucide-react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type, message, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    if (type !== 'loading' && duration !== Infinity) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
    return id;
  }, [dismiss]);

  const success = useCallback((msg) => addToast('success', msg), [addToast]);
  const error = useCallback((msg) => addToast('error', msg), [addToast]);
  const warning = useCallback((msg) => addToast('warning', msg), [addToast]);
  const info = useCallback((msg) => addToast('info', msg), [addToast]);
  const loading = useCallback((msg) => addToast('loading', msg), [addToast]);

  const toast = { success, error, warning, info, loading, dismiss };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Panel Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            let icon = <Info className="w-4 h-4 text-blue-500" />;
            let borderStyle = 'border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95';
            
            if (t.type === 'success') {
              icon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            } else if (t.type === 'error') {
              icon = <X className="w-4 h-4 text-red-500" />;
            } else if (t.type === 'warning') {
              icon = <AlertTriangle className="w-4 h-4 text-amber-500" />;
            } else if (t.type === 'loading') {
              icon = <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
            }

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className={`p-3.5 rounded-xl border glass-panel backdrop-blur-md flex items-center justify-between gap-3 pointer-events-auto ${borderStyle} shadow-lg`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {icon}
                  <span className="text-xs font-bold truncate leading-none text-slate-800 dark:text-slate-200">
                    {t.message}
                  </span>
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
