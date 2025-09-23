import type { Property } from "../entities/Property";

export type PropertyFilter = {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
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

export interface PropertyRepository {
  fetchAll(filters?: PropertyFilter): Promise<PagedResult<Property>>;
  fetchById(id: string): Promise<Property | null>;
  create(payload: Omit<Property, "id">): Promise<Property>;
  update(id: string, payload: Omit<Property, "id">): Promise<Property>;
  delete(id: string): Promise<void>;
}

