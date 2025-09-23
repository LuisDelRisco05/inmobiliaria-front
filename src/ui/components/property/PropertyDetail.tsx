import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useRepository } from "@/ui/hooks/useRepository";
import { makeFetchPropertyByIdUseCase } from "@/application/usecases/property/fetchPropertyById";
import type { Property } from "@/domain/entities/Property";
import Loading from "../common/Loading";
import ConfirmModal from "../common/ConfirmModal";
import Modal from "../common/Modal";
import PropertyForm from "./PropertyForm";
import { propertyApiAdapter } from "@/infra/api/propertyApiAdapter";
import { FaTrash, FaEdit, FaChevronLeft } from "react-icons/fa";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { propertyRepo } = useRepository();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!id) return;
    await propertyApiAdapter.delete(id);
    navigate("/");
  };

  // memoriza el use-case una sola vez
  const fetchById = useMemo(
    () => makeFetchPropertyByIdUseCase(propertyRepo),
    [propertyRepo]
  );

  const loadProperty = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await fetchById(id);
      if (!data) {
        setError("Propiedad no encontrada");
      } else {
        setProperty(data);
        setError(null);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado"
      );
    } finally {
      setLoading(false);
    }
  }, [id, fetchById]);

  useEffect(() => {
    loadProperty();
  }, [loadProperty]);
  if (loading) return <Loading fullScreen />;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!property) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-100 shadow-xl rounded-xl">
      <img
        src={property.imageUrl}
        alt={property.name}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "https://hackmd.io/_uploads/SkmfOYJ3ll.png";
        }}
        className="w-full h-80 object-cover rounded-xl"
      />
      <h1 className="text-3xl font-bold mt-4">{property.name}</h1>
      <p className="text-gray-600">{property.address}</p>
      <p className="text-primary text-2xl font-semibold mt-2">
        ${property.price.toLocaleString()}
      </p>
      <p className="text-sm text-gray-400 mt-2">ID Owner: {property.idOwner}</p>

      <div className="mt-6 flex justify-between items-center">
        {/* Botón volver */}
        <Link to="/" className="btn btn-outline border-none">
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
            <FaTrash size={20} />
          </button>
        </div>
      </div>

      {/* Modal confirmación eliminar */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Eliminar propiedad"
        message="¿Seguro que deseas eliminar esta propiedad?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Modal edición */}
      <Modal
        isOpen={editing}
        onClose={() => setEditing(false)}
        title="Editar propiedad"
      >
        {property && (
          <PropertyForm
            initialData={property}
            onUpdated={() => {
              setEditing(false);
              window.location.reload(); // refresca la vista detalle
            }}
          />
        )}
      </Modal>
    </div>
  );
}
