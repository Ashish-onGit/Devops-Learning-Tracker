import { useContext } from 'react';
import { ModalContext } from '../providers/ModalProvider';

export const useConfirm = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ModalProvider');
  }
  return context;
};

export default useConfirm;
