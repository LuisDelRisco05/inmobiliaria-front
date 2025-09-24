import { useForm } from "react-hook-form";
import { ownerApiAdapter } from "@/infra/api/ownerApiAdapter";
import type { Owner } from "@/domain/entities/Owner";
import { useEffect } from "react";
import { useAlert } from "@/ui/hooks/useAlert";

type OwnerFormInputs = {
  name: string;
  address: string;
  photo: string;
  birthday: Date | string;
};

interface Props {
  initialData?: Owner;
  onCreated?: () => void;
  onUpdated?: () => void;
  onClose?: (owner: Owner | null) => void;
}

export default function OwnerForm({ initialData, onCreated, onUpdated, onClose }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OwnerFormInputs>();

  const { showAlert } = useAlert();

  useEffect(() => {
  if (initialData) {
    reset({
      name: initialData.name,
      address: initialData.address,
      photo: initialData.photo,
      birthday: initialData.birthday
    });
  }
}, [initialData, reset]);

  const onSubmit = async (data: OwnerFormInputs) => {
    try {
      if (initialData) {
        // editar
        await ownerApiAdapter.update(initialData.id, data);
        onUpdated?.();
        onClose?.(null);
        showAlert("Propietario actualizado con éxito!", "success", 5000);
      } else {
        const { name, address, photo, birthday } = data;
        await ownerApiAdapter.create({ name, address, photo, birthday });
        onCreated?.();
        showAlert("Propietario creado con éxito!", "success", 5000);
      }
      reset();
    } catch {
      showAlert("Error al guardar propietario!", "error", 5000);
    }
  };


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 bg-base-200 rounded-xl shadow-md"
    >
      <h2 className="text-xl font-bold">{initialData ? "Editar Propietario" : "Agregar Propietario"}</h2>

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
        type="text"
        placeholder="URL de la foto"
        className="input input-bordered w-full"
        {...register("photo", { required: "La foto es obligatoria" })}
      />
      {errors.photo && <p className="text-error">{errors.photo.message}</p>}

      <input
        type="date"
        aria-label="Fecha de nacimiento"
        className="input input-bordered w-full"
        {...register("birthday", { required: "La fecha de nacimiento es obligatoria" })}
      />
      {errors.birthday && <p className="text-error">{errors.birthday.message}</p>}

      <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
        {isSubmitting ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}
