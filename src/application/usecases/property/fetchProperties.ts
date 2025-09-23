import type { Property } from "@/domain/entities/Property";
import type { PropertyRepository, PropertyFilter, PagedResult } from "@/domain/ports/PropertyRepository";

export function makeFetchPropertiesUseCase(repo: PropertyRepository) {
  return async function fetchProperties(filters?: PropertyFilter): Promise<PagedResult<Property>> {
    // Validaciones simples
    if (filters?.minPrice != null && filters?.maxPrice != null && filters.minPrice > filters.maxPrice) {
      throw new Error("minPrice cannot be greater than maxPrice");
    }

    const items = await repo.fetchAll(filters);

    return {
      ...items,
      data: items.data.map(item => ({...item, price: item.price < 0 ? 0 : item.price})),
    };
  };
}
