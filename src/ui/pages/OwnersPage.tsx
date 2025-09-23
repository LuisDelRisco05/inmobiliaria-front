import { useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Modal, { type ModalHandle } from "@/ui/components/common/Modal";
import OwnerForm from "@/ui/components/owner/OwnerForm";
import OwnerList from "@/ui/components/owner/OwnerList";
import { useFetchOwners } from "@/ui/hooks/owner/useFetchOwners";

export default function OwnersPage() {
  const { error, loading, refresh, owners } = useFetchOwners();
  const ownerModalRef = useRef<ModalHandle>(null);

  return (
    <div className="space-y-6 relative">
      {/* Botón flotante para crear nuevo propietario */}
      <button
        data-tip="Agregar propietario"
        className="btn btn-circle btn-primary fixed bottom-20 right-6 shadow-lg tooltip tooltip-left tooltip-primary z-50"
        onClick={() => ownerModalRef.current?.open()}
      >
        <FaPlus />
      </button>

      {/* Botón flotante para ir a propiedades */}
      <div
        data-tip="Ver propiedades"
        className="tooltip tooltip-left tooltip-secondary fixed top-12 right-6 z-50"
      >
        <Link
          to="/"
          className="btn btn-circle bg-secondary hover:bg-secondary-focus text-white shadow-lg"
        >
          🏡
        </Link>
      </div>

      {/* Modal Crear Propietario */}
      <Modal ref={ownerModalRef} title="Nuevo Propietario">
        <OwnerForm
          onCreated={() => {
            refresh(); // Recargar lista
            ownerModalRef.current?.close();
          }}
        />
      </Modal>

      {/* Encabezado y Lista */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">👤 Lista de propietarios</h1>
      </div>

      <OwnerList owners={owners} loading={loading} error={error} load={refresh} />
    </div>
  );
}
