import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';

const overlayStyle = {
  background: 'rgba(0,0,0,0.5)',
  position: 'fixed' as const,
  inset: 0,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const contentStyle = {
  background: '#fff',
  borderRadius: 16,
  padding: 32,
  minWidth: 340,
  maxWidth: 400,
  width: '100%',
  boxShadow: '0 2px 16px #e0e0e0',
  zIndex: 1001,
  position: 'relative' as const,
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
};

const Modal = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) => (
  <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
    <Dialog.Portal>
      <div style={overlayStyle}>
        <Dialog.Content style={contentStyle}>
          <Dialog.Close asChild>
            <button style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>&times;</button>
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  </Dialog.Root>
);

export default Modal; 