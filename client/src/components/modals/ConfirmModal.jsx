import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  title,
  description,
  variant,
  onConfirm,
  onCancel,
}) => {
  const modalRef = useRef(null);

  // Esc key closure
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  // Trap focus inside modal when open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus(); // Default focus on cancel
      }
    }
  }, [isOpen]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", duration: 0.4 },
    },
  };

  let icon = <AlertCircle className="w-6 h-6 text-red-500" />;
  let primaryBtnClass =
    "bg-red-600 hover:bg-red-500 shadow-red-500/10 text-white";

  if (variant === "warning") {
    icon = <AlertTriangle className="w-6 h-6 text-amber-500" />;
    primaryBtnClass =
      "bg-amber-500 hover:bg-amber-450 shadow-amber-500/10 text-slate-950";
  } else if (variant === "success") {
    icon = <CheckCircle className="w-6 h-6 text-emerald-500" />;
    primaryBtnClass =
      "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10 text-white";
  } else if (variant === "info") {
    icon = <Info className="w-6 h-6 text-blue-500" />;
    primaryBtnClass =
      "bg-blue-600 hover:bg-blue-500 shadow-blue-500/10 text-white";
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onCancel}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-sm"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            className="w-full max-w-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-black shadow-2xl overflow-hidden glass-card text-left p-6 relative"
          >
            {/* Close Cross */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Body */}
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 shrink-0">
                {icon}
              </div>
              <div className="space-y-1.5 flex-1 pr-4">
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 leading-snug">
                  {title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 justify-end mt-6 border-t border-slate-100 dark:border-slate-850 pt-4 select-none">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-350"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow-md ${primaryBtnClass}`}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
