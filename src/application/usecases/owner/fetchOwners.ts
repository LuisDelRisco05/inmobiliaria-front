import type { Owner } from "@/domain/entities/Owner";
import type { OwnerFilter, OwnerRepository, PagedResult } from "@/domain/ports/OwnerRepository";
import { ownerApiAdapter } from "@/infra/api/ownerApiAdapter";

export function makeFetchOwnersUseCase() {
  return async () => {
    const owners = await ownerApiAdapter.fetchAll();
    return owners;
  };
}

export function makeFetchOwnersFilterUseCase(repo: OwnerRepository) {
  return async function fetchOwners(filters?: OwnerFilter): Promise<PagedResult<Owner>> {
    const result = await repo.fetchAll(filters);

    return {
      ...result,
      data: result.data.map((owner) => ({
        ...owner,
      })),
    };
  };
}
