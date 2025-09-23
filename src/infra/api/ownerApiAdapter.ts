import { type Owner } from "@/domain/entities/Owner";

import { api } from "./propertyApiAdapter";
import type { OwnerFilter, OwnerRepository, PagedResult } from "@/domain/ports/OwnerRepository";


// Normaliza el objeto Owner
function mapOwner(raw: Owner): Owner {
  return {
    id: raw.id ?? raw.id ?? "",
    name: raw.name ?? "",
    address: raw.address ?? "",
    photo: raw.photo ?? "",
    birthday: raw.birthday ? new Date(raw.birthday) : new Date(),
  };
}

// Implementación uniforme del repositorio
export const ownerApiAdapter: OwnerRepository = {
  async fetchAll(filters?: OwnerFilter): Promise<PagedResult<Owner>> {
    const resp = await api.get("/owners", { params: filters });
    return {
      data: resp.data.data.map(mapOwner),
      totalCount: resp.data.totalCount,
      totalPages: resp.data.totalPages,
    };
  },

  async fetchById(id: string): Promise<Owner | null> {
    const resp = await api.get(`/owners/${id}`);
    return mapOwner(resp.data);
  },

  async create(payload: Omit<Owner, "id">): Promise<Owner> {
    const resp = await api.post("/owners", payload);
    return mapOwner(resp.data);
  },

  async update(id: string, payload: Omit<Owner, "id">): Promise<Owner> {
    const resp = await api.put(`/owners/${id}`, payload);
    return mapOwner(resp.data);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/owners/${id}`);
  },
};
