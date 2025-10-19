import React from 'react';

interface ModalBackdropProps {
  onClose: () => void;
}

const ModalBackdrop: React.FC<ModalBackdropProps> = ({ onClose }) => {
  return (
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClose();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Close modal"
      onMouseDown={(e) => { e.preventDefault(); }}
      onMouseUp={(e) => { e.preventDefault(); }}
    />
  );
};

export default ModalBackdrop;
