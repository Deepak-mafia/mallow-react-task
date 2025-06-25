import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';

const Modal = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) => (
  <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
    <Dialog.Portal>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
        <Dialog.Content className="bg-white rounded-2xl p-8 min-w-[340px] max-w-[400px] w-full shadow-lg z-[1001] relative flex flex-col items-center">
          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 bg-transparent border-none text-2xl cursor-pointer">&times;</button>
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  </Dialog.Root>
);

export default Modal; 