import { useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Modal, { type ModalHandle } from "@/ui/components/common/Modal";
import OwnerForm from "@/ui/components/owner/OwnerForm";
import OwnerList from "@/ui/components/owner/OwnerList";
import { useFetchOwners } from "@/ui/hooks/owner/useFetchOwners";
import { FaSearch } from "react-icons/fa";
import OwnerFilterForm from "../components/owner/OwnerFilterForm";

export default function OwnersPage() {
  const { error, loading, refresh, owners, filters, totalPages } =
    useFetchOwners();
  const ownerModalRef = useRef<ModalHandle>(null);
  const filterModalRef = useRef<ModalHandle>(null);

  return (
    <div className="space-y-6 relative">
      {/* Botón flotante para crear nuevo propietario */}
      <button
        data-tip="Agregar propietario"
        data-testid="btn-add-owner"
        className="btn btn-circle btn-secondary fixed bottom-20 right-6 shadow-lg tooltip tooltip-left tooltip-secondary z-50"
        onClick={() => ownerModalRef.current?.open()}
      >
        <FaPlus />
      </button>

      {/* Botón flotante de filtros */}
      <button
        data-tip="Filtrar propietarios"
        data-testid="btn-filter-owner"
        className="btn btn-circle btn-primary fixed bottom-6 right-6 shadow-lg tooltip tooltip-left tooltip-primary z-50"
        onClick={() => filterModalRef.current?.open()}
      >
        <FaSearch />
      </button>

      {/* Botón flotante para ir a propiedades */}
      <div
        data-tip="Ver propiedades"
        className="tooltip tooltip-left tooltip-secondary fixed top-12 right-6 z-50"
      >
        <Link
          to="/"
          aria-label="Volver a propiedades"
          data-testid="link-to-properties"
          className="btn btn-circle bg-secondary hover:bg-secondary-focus text-white shadow-lg"
        >
          🏡
        </Link>
      </div>
      {/* Encabezado y Lista */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          👤 Lista de propietarios
        </h1>
      </div>
      {/* Lista de propietarios */}
      <OwnerList
        owners={owners}
        loading={loading}
        error={error}
        load={refresh}
        filters={filters}
        totalPages={totalPages}
      />
      {/* Modal Filtros */}
      <Modal ref={filterModalRef} title="Filtros">
        <OwnerFilterForm
          onFilter={(filters) => refresh({ page: 1, ...filters })}
          close={() => filterModalRef.current?.close()}
        />
      </Modal>

      {/* Modal Crear Propietario */}
      <Modal ref={ownerModalRef} title="Nuevo Propietario">
        <OwnerForm
          onCreated={() => {
            refresh(); // Recargar lista
            ownerModalRef.current?.close();
          }}
        />
      </Modal>
    </div>
  );
}
