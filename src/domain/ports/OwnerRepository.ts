import type { Owner } from "../entities/Owner";

export type OwnerFilter = {
  name?: string;
  address?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "price" | "name";
  sortOrder?: "asc" | "desc";
};

export interface PagedResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
}

export interface OwnerRepository {
  fetchAll(filters?: OwnerFilter): Promise<PagedResult<Owner>>;
  fetchById(id: string): Promise<Owner | null>;
  create(payload: Omit<Owner, "id">): Promise<Owner>;
  update(id: string, payload: Omit<Owner, "id">): Promise<Owner>;
  delete(id: string): Promise<void>;
}

