import type { Property } from "@/domain/entities/Property";
import Loading from "../common/Loading";
import { Link } from "react-router-dom";
import type { PropertyFilter } from "@/domain/ports/PropertyRepository";
import Pagination from "../common/Pagination";
import SortDropdown from "../common/SortDropdown";
import { useState } from "react";
import ConfirmModal from "../common/ConfirmModal";
import { propertyApiAdapter } from "@/infra/api/propertyApiAdapter";
import Modal from "../common/Modal";
import PropertyForm from "./PropertyForm";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

interface Props {
  data: Property[];
  loading: boolean;
  error: Error | null;
  load: (filters?: Partial<PropertyFilter>) => void;
  filters: PropertyFilter;
  totalPages: number;
}

export default function PropertyList({ data, loading, error, load, filters, totalPages }: Props) {

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [editing, setEditing] = useState<Property | null>(null);

  const handleSort = (sortBy: "price" | "name", sortOrder: "asc" | "desc") => {
    load({ sortBy, sortOrder, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    load({ page: newPage });
  };

  if (loading) return <Loading type="spinner" size="lg" color="primary" />;
  if (error) return <div className="alert alert-error">{error.message}</div>;
  if (!loading && !error && data.length === 0)
    return (
      <div className="text-center text-gray-500">
        No se encontraron propiedades.
      </div>
    );

    const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    await propertyApiAdapter.delete(selectedId);
    load();
    setConfirmOpen(false);
    setSelectedId(null);
  };

  return (
    <div>
      {/* Controles */}
      <div className="flex justify-between items-center mb-4">
        <SortDropdown onSort={handleSort} />
        <Pagination
          page={filters.page ?? 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    
      {/* Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((p) => (
          <div key={p.id} className="card bg-base-100 shadow-xl relative">
            <figure>
              <img 
                src={p.imageUrl} 
                alt={p.name} 
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://hackmd.io/_uploads/SkmfOYJ3ll.png";
                }}
                className="h-48 w-full object-cover" 
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{p.name}</h2>
              <p>{p.address}</p>
              <p className="text-primary font-semibold">
                ${p.price.toLocaleString()}
              </p>
              <div className="flex justify-between mt-2 gap-2">
                <Link to={`/properties/${p.id}`} className="btn btn-sm btn-white btn-outline border-none">
                  <FaEye size={20} />
                </Link>
                <button
                  className="btn btn-sm btn-white btn-outline border-none"
                  onClick={() => setEditing(p)}
                >
                  <FaEdit size={20} />
                </button>
                <button
                  className="btn btn-sm btn-white btn-outline border-none absolute right-6 bottom-32"
                  onClick={() => handleDeleteClick(p.id!)}
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal confirmación eliminar */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Eliminar propiedad"
        message="¿Seguro que deseas eliminar esta propiedad? Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Modal edición */}
      <Modal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        title="Editar propiedad"
      >
        {editing && (
          <PropertyForm
            initialData={editing}
            onUpdated={() => {
              setEditing(null);
              load(); // refrescar lista
            }}
          />
        )}
      </Modal>
    </div>
  );
}
