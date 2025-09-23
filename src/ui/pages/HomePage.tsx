import PropertyForm from "@/ui/components/property/PropertyForm";
import PropertyList from "@/ui/components/property/PropertyList";
import PropertyFilterForm from "@/ui/components/property/PropertyFilterForm";
import { useFetchProperties } from "@/ui/hooks/property/useFetchProperties";
import Modal, { type ModalHandle } from "../components/common/Modal";
import OwnerForm from "@/ui/components/owner/OwnerForm";
import { useRef } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { load, data, loading, error, filters, totalPages } = useFetchProperties();

  const filterModalRef = useRef<ModalHandle>(null);
  const propertyModalRef = useRef<ModalHandle>(null);
  const ownerModalRef = useRef<ModalHandle>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      {/* Botón flotante de filtros */}
      <button
        data-tip="Filtrar propiedades"
        className="btn btn-circle btn-primary fixed bottom-6 right-6 shadow-lg tooltip tooltip-left tooltip-primary z-50"
        onClick={() => filterModalRef.current?.open()}
      >
        <FaSearch />
      </button>

      {/* Botón flotante de nueva propiedad */}
      <button
        data-tip="Agregar propiedad"
        className="btn btn-circle btn-secondary fixed bottom-20 right-6 shadow-lg tooltip tooltip-left tooltip-secondary z-50"
        onClick={() => propertyModalRef.current?.open()}
      >
        <FaPlus />
      </button>

      {/* Botón flotante para ir a la página de propietarios */}
      <div
        data-tip="Ver propietarios"
        className="tooltip tooltip-left tooltip-accent fixed top-12 right-6 z-50"
      >
        <Link
          to="/owners"
          className="btn btn-circle bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
        >
          👤
        </Link>
      </div>



      {/* Modal Filtros */}
      <Modal ref={filterModalRef} title="Filtros">
        <PropertyFilterForm
          onFilter={(filters) => load({ page: 1, ...filters })}
          close={() => filterModalRef.current?.close()}
        />
      </Modal>

      {/* Modal Crear Propiedad */}
      <Modal ref={propertyModalRef} title="Nueva Propiedad">
        <PropertyForm
          onCreated={() => {
            load();
            propertyModalRef.current?.close();
          }}
        />
      </Modal>

      {/* Modal Crear Propietario */}
      <Modal ref={ownerModalRef} title="Nuevo Propietario">
        <OwnerForm
          onCreated={() => {
            ownerModalRef.current?.close();
          }}
        />
      </Modal>

      {/* Contenido principal */}
      <div className="lg:col-span-2">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">
            🏡 Listado de propiedades
          </h1>
          <p className="text-lg text-base-content/70 pl-9">
            Explora, filtra y agrega propiedades fácilmente
          </p>
        </div>

        <PropertyList
          data={data}
          loading={loading}
          error={error}
          load={load}
          filters={filters}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
