import type { Property } from "@/domain/entities/Property";
import type { PropertyRepository } from "@/domain/ports/PropertyRepository";


export function makeCreatePropertyUseCase(repo: PropertyRepository) {
  return async function createProperty(payload: Omit<Property, "id">): Promise<Property> {
    if (!payload.name || !payload.address) {
      throw new Error("Name and address are required");
    }
    if (payload.price <= 0) {
      throw new Error("Price must be greater than 0");
    }
    return await repo.create(payload);
  };
}