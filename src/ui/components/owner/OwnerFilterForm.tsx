import { useForm } from "react-hook-form";
import type { OwnerFilter } from "@/domain/ports/OwnerRepository";

type FilterFormValues = {
  name?: string;
  address?: string;
};

interface Props {
  onFilter: (values: Partial<OwnerFilter>) => void;
  close: () => void;
}

export default function OwnerFilterForm({ onFilter, close }: Props) {
  const { register, handleSubmit, reset } = useForm<FilterFormValues>();

  const onSubmit = (values: FilterFormValues) => {
    const cleaned = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== "" && v !== undefined)
    );
    onFilter(cleaned);
    close(); // cerrar modal si aplica
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input
        {...register("name")}
        placeholder="Nombre del propietario"
        className="input input-bordered w-full"
      />
      <input
        {...register("address")}
        placeholder="Dirección"
        className="input input-bordered w-full"
      />

      <div className="flex justify-between">
        <button type="submit" className="btn btn-primary">
          Aplicar
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            reset();
            onFilter({});
            close();
          }}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}
