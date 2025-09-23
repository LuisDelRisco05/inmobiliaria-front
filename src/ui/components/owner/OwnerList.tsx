import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import { FaArrowRotateRight } from "react-icons/fa6";

import Modal, { type ModalHandle } from "../common/Modal";
import OwnerForm from "./OwnerForm";
import ConfirmModal from "../common/ConfirmModal";
import Loading from "../common/Loading";
import type { Owner } from "@/domain/entities/Owner";
import { ownerApiAdapter } from "@/infra/api/ownerApiAdapter";
import type { OwnerFilter } from "@/domain/ports/OwnerRepository";
import SortDropdown from "../common/SortDropdown";
import Pagination from "../common/Pagination";

interface Props {
  owners: Owner[];
  loading: boolean;
  error: Error | null;
  load: (filters?: Partial<OwnerFilter>) => void;
  filters: OwnerFilter;
  totalPages: number;
}

export default function OwnerList({ owners, loading, error, load, filters, totalPages }: Props) {
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const modalRef = useRef<ModalHandle>(null);
  const navigate = useNavigate();

  const handleSort = (sortBy: "price" | "name", sortOrder: "asc" | "desc") => {
    load({ sortBy, sortOrder, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    load({ page: newPage });
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    await ownerApiAdapter.delete(selectedId);
    await load();
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const handleEdit = (owner: Owner) => {
    setEditingOwner(owner);
    modalRef.current?.open();
  };

  const handleViewDetails = (id: string) => {
    navigate(`/owners/${id}`);
  };
  

  if (loading) return <Loading type="spinner" size="lg" color="primary" />;
  if (error) return <div className="alert alert-error">{error.message}</div>;
  if (owners.length === 0)
    return <div className="text-center text-gray-500">No se encontraron propietarios.</div>;

  return (
    <>
      {/* Controles */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <SortDropdown onSort={handleSort} />
          <button
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            <FaArrowRotateRight />
          </button>
        </div>
        <Pagination
          page={filters.page ?? 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <div className="space-y-2">
        {owners.map((o : Owner) => (
          <div key={o.id} className="flex justify-between items-center p-2 bg-base-100 rounded shadow">
            <div>
              <p className="font-bold">{o.name}</p>
              <p className="text-sm text-gray-500">{o.address}</p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                className="tooltip btn btn-sm btn-white btn-outline border-none"
                data-tip="Ver detalles"
                onClick={() => handleViewDetails(o.id)}
              >
                <FaEye size={20} />
              </button>
              <button
                className="tooltip btn btn-sm btn-white btn-outline border-none"
                data-tip="Editar"
                onClick={() => handleEdit(o)}
              >
                <FaEdit size={20} />
              </button>
              <button
                className="tooltip btn btn-sm btn-white btn-outline border-none"
                data-tip="Eliminar"
                onClick={() => {
                  setSelectedId(o.id);
                  setConfirmOpen(true);
                }}
              >
                <FaTrash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal confirmación eliminar */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Eliminar propiedad"
        message="¿Seguro que deseas eliminar esta propiedad? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Modal edición */}
      <Modal ref={modalRef} title="Editar Propietario">
        {editingOwner && (
          <OwnerForm
            initialData={editingOwner}
            onUpdated={() => {
              modalRef.current?.close();
              load();
            }}
            onClose={setEditingOwner}
          />
        )}
      </Modal>
    </>
  );
}
