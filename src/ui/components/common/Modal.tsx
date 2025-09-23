import { forwardRef, useRef, useImperativeHandle, useEffect } from "react";

export type ModalHandle = {
  open: () => void;
  close: () => void;
};

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

const Modal = forwardRef<ModalHandle, ModalProps>(
  ({ title, children, isOpen = false, onClose }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => dialogRef.current?.showModal(),
      close: () => dialogRef.current?.close(),
    }));

    // sincronizar estado externo con isOpen
    useEffect(() => {
      if (isOpen) {
        dialogRef.current?.showModal();
      } else {
        dialogRef.current?.close();
      }
    }, [isOpen]);

    return (
      <dialog
        ref={dialogRef}
        className="modal"
        onClose={onClose}
      >
        <div className="modal-box relative">
          <button
            onClick={() => dialogRef.current?.close()}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
          {title && <h3 className="font-bold text-lg mb-4">{title}</h3>}
          {children}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  }
);

export default Modal;
