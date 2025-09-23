import { useForm } from "react-hook-form";

type FilterFormValues = {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
};

export default function PropertyFilterForm({ onFilter, close }: { onFilter: (values: FilterFormValues) => void, close: () => void }) {
  const { register, handleSubmit, reset } = useForm<FilterFormValues>();

  const onSubmit = (values: FilterFormValues) => {
    const cleaned = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== "" && v !== undefined)
    );
    onFilter(cleaned);
    close(); // cerrar modal al aplicar filtros
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input {...register("name")} placeholder="Nombre" className="input input-bordered w-full" />
      <input {...register("address")} placeholder="Dirección" className="input input-bordered w-full" />
      <div className="flex gap-2">
        <input type="number" {...register("minPrice")} placeholder="Precio mínimo" className="input input-bordered w-1/2" />
        <input type="number" {...register("maxPrice")} placeholder="Precio máximo" className="input input-bordered w-1/2" />
      </div>
      <div className="flex justify-between">
        <button type="submit" className="btn btn-primary">Aplicar</button>
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
