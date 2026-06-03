import React, { createContext, useState, useCallback, useRef } from 'react';
import ConfirmModal from '../components/modals/ConfirmModal';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    description: '',
    variant: 'danger', // danger, warning, success, info
  });

  const resolverRef = useRef(null);

  const confirm = useCallback((config) => {
    setModalState({
      isOpen: true,
      title: config.title || 'Are you sure?',
      description: config.description || 'This action cannot be undone.',
      variant: config.variant || 'danger',
    });

    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  };

  const handleCancel = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  };

  return (
    <ModalContext.Provider value={confirm}>
      {children}
      <ConfirmModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        description={modalState.description}
        variant={modalState.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ModalContext.Provider>
  );
};
export default ModalProvider;
