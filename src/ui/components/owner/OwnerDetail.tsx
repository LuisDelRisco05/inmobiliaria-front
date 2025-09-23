import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Owner } from "@/domain/entities/Owner";
import { ownerApiAdapter } from "@/infra/api/ownerApiAdapter";
import Modal from "../common/Modal";
import ConfirmModal from "../common/ConfirmModal";
import OwnerForm from "./OwnerForm";
import { FaChevronLeft, FaEdit, FaTrash } from "react-icons/fa";
import Loading from "../common/Loading";

export default function OwnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const loadOwner = async () => {
    setLoading(true);
    try {
      const res = await ownerApiAdapter.fetchAll();
      const match = res.find((o) => o.id === id);
      if (!match) {
        setError("Propietario no encontrado");
      } else {
        setOwner(match);
        setError(null);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al cargar propietario"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    await ownerApiAdapter.delete(id);
    navigate("/owners");
  };

  useEffect(() => {
    loadOwner();
  }, [id]);

  if (loading) return <Loading fullScreen />;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!owner) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-100 shadow-xl rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">👤 {owner.name}</h1>
      </div>
      <img
        src={owner.photo}
        alt={owner.name}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "https://hackmd.io/_uploads/SkmfOYJ3ll.png";
        }}
        className="w-full h-80 object-cover rounded-xl"
      />
      <p className="text-sm font-semibold mt-4">Dirección:</p>
      <p className="mb-3">{owner.address}</p>

      <p className="text-sm font-semibold">Fecha de nacimiento:</p>
      <p>{new Date(owner.birthday).toLocaleDateString()}</p>

      <div className="mt-6 flex justify-between items-center">
        {/* Botón volver */}
        <Link to="/owners" className="btn btn-outline border-none">
          <FaChevronLeft /> Regresar
        </Link>

        {/* Botones acción */}
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-white btn-outline border-none"
            onClick={() => setEditing(true)}
            title="Editar"
          >
            <FaEdit size={20} />
          </button>
          <button
            className="btn btn-sm btn-white btn-outline border-none"
            onClick={() => setConfirmOpen(true)}
            title="Eliminar"
          >
            <FaTrash size={20}/>
          </button>
        </div>
      </div>

      {/* Modal de edición */}
      <Modal isOpen={editing} onClose={() => setEditing(false)} title="Editar propietario">
        {owner && (
          <OwnerForm
            onCreated={() => {
              setEditing(false);
              loadOwner();
            }}
            onUpdated={() => {
              setEditing(false);
              loadOwner();
            }}
            initialData={owner}
            onClose={setOwner}
          />
        )}
      </Modal>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Eliminar propietario"
        message="¿Seguro que deseas eliminar este propietario?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
