import type { Property } from "@/domain/entities/Property";
import type { PropertyRepository } from "@/domain/ports/PropertyRepository";

export function makeFetchPropertyByIdUseCase(repo: PropertyRepository) {
  return async function fetchPropertyById(id: string): Promise<Property | null> {
    if (!id) throw new Error("Property id is required");
    return await repo.fetchById(id);
  };
}
