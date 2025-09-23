import Modal from "./Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = "Confirmar acción",
  message = "¿Estás seguro?",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="py-4">{message}</p>
      <div className="flex justify-end gap-2">
        <button className="btn btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button className="btn btn-error" onClick={onConfirm}>
          Eliminar
        </button>
      </div>
    </Modal>
  );
}
