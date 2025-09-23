import axios from "axios";
import type { Property } from "@/domain/entities/Property";
import type { PropertyRepository, PropertyFilter } from "@/domain/ports/PropertyRepository";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// helper: normalizar id (_id -> id)
function mapProperty(raw: Property ): Property {
  return {
    id: raw.id ?? "",
    idOwner: raw.idOwner ?? "",
    name: raw.name ?? "",
    address: raw.address ?? "",
    price: typeof raw.price === "number" ? raw.price : Number(raw.price ?? 0),
    imageUrl: raw.imageUrl ?? "",
  };
}

export const propertyApiAdapter: PropertyRepository = {
  async fetchAll(filters?: PropertyFilter) {
    const resp = await api.get("/properties", { params: filters });
    return {
      data: resp.data.data.map(mapProperty),
      totalCount: resp.data.totalCount,
      totalPages: resp.data.totalPages,
    };
  },
  async fetchById(id: string) {
    const resp = await api.get(`/properties/${id}`);
    return mapProperty(resp.data);
  },
  async create(payload) {
    const resp = await api.post("/properties", payload);
    return mapProperty(resp.data);
  },
  
  async update(id: string, payload: Omit<Property, "id">) {
    const resp = await api.put(`/properties/${id}`, payload);
    return mapProperty(resp.data);
  },


  async delete(id: string): Promise<void> {
    const res = await api.delete(`/properties/${id}`);
    if (res.status !== 200 && res.status !== 204) {
      throw new Error("Error deleting property");
    }
  }
  
};

