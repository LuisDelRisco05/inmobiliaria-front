import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { makeCreatePropertyUseCase } from "@/application/usecases/property/createProperty";
import { makeUpdatePropertyUseCase } from "@/application/usecases/property/updateProperty";
import { useRepository } from "@/ui/hooks/useRepository";
import type { Property } from "@/domain/entities/Property";
import type { Owner } from "@/domain/entities/Owner";
import { makeFetchOwnersUseCase } from "@/application/usecases/owner/fetchOwners";
import { useAlert } from "@/ui/hooks/useAlert";

type PropertyFormInputs = {
  idOwner: string;
  name: string;
  address: string;
  price: number;
  imageUrl: string;
};

interface Props {
  initialData?: Property;       // <- si viene, es edición
  onCreated?: () => void;       // callback al crear
  onUpdated?: () => void;       // callback al editar
}

export default function PropertyForm({ initialData, onCreated, onUpdated }: Props) {
  const [owners, setOwners] = useState<Owner[]>([]);

  const { propertyRepo } = useRepository();
  const createProperty = makeCreatePropertyUseCase(propertyRepo);
  const updateProperty = makeUpdatePropertyUseCase(propertyRepo);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormInputs>({
    defaultValues: initialData
      ? {
          idOwner: initialData.idOwner,
          name: initialData.name,
          address: initialData.address,
          price: initialData.price,
          imageUrl: initialData.imageUrl,
        }
      : {},
  });

  const { showAlert } = useAlert();

  // 🔹 Cargar Owners al montar
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const getOwners = makeFetchOwnersUseCase();
        const result = await getOwners();
        setOwners(result.data);
      } catch (error) {
        console.error("Error al cargar propietarios:", error);
      }
    };

    fetchOwners();
  }, []);

  // 🔹 Resetear si cambia initialData (modo edición)
  useEffect(() => {
    if (initialData) {
      reset({
        idOwner: initialData.idOwner,
        name: initialData.name,
        address: initialData.address,
        price: initialData.price,
        imageUrl: initialData.imageUrl,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: PropertyFormInputs) => {
    try {
      if (initialData) {
        await updateProperty(initialData.id!, {
          ...data,
          price: Number(data.price),
        });
        onUpdated?.();
        showAlert("Propiedad actualizada con éxito!", "success", 5000);
      } else {
        await createProperty({
          ...data,
          price: Number(data.price),
        });
        onCreated?.();
        reset();
        showAlert("Propiedad creada con éxito!", "success", 5000);
      }
    } catch (err: unknown) {
      showAlert(err instanceof Error ? "Error:" + err.message : "Error desconocido", "error", 5000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 bg-base-200 rounded-xl shadow-md"
    >
      <h2 className="text-xl font-bold">
        {initialData ? "Editar Propiedad" : "Agregar Propiedad"}
      </h2>

      {/* 🔹 Select de Owners */}
      <select
        className="select select-bordered w-full"
        {...register("idOwner", { required: "El propietario es obligatorio" })}
      >
        <option value="">Selecciona un propietario</option>
        {owners.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
      {errors.idOwner && <p className="text-error">{errors.idOwner.message}</p>}

      <input
        type="text"
        placeholder="Nombre"
        className="input input-bordered w-full"
        {...register("name", { required: "El nombre es obligatorio" })}
      />
      {errors.name && <p className="text-error">{errors.name.message}</p>}

      <input
        type="text"
        placeholder="Dirección"
        className="input input-bordered w-full"
        {...register("address", { required: "La dirección es obligatoria" })}
      />
      {errors.address && <p className="text-error">{errors.address.message}</p>}

      <input
        type="number"
        placeholder="Precio"
        className="input input-bordered w-full"
        {...register("price", { required: "El precio es obligatorio", min: 1 })}
      />
      {errors.price && <p className="text-error">{errors.price.message}</p>}

      <input
        type="text"
        placeholder="URL de la imagen"
        className="input input-bordered w-full"
        {...register("imageUrl", { required: "La imagen es obligatoria" })}
      />
      {errors.imageUrl && <p className="text-error">{errors.imageUrl.message}</p>}

      <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
        {isSubmitting ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}
