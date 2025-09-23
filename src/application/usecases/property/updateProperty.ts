import type { PropertyRepository } from "@/domain/ports/PropertyRepository";
import type { Property } from "@/domain/entities/Property";

export function makeUpdatePropertyUseCase(repo: PropertyRepository) {
  return async (id: string, data: Omit<Property, "id">): Promise<Property> => {
    if (!id) throw new Error("El ID es obligatorio para actualizar");

    return await repo.update!(id, data);
  };
}
