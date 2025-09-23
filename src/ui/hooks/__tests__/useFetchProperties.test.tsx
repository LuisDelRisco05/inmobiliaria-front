// src/ui/hooks/__tests__/useFetchProperties.test.tsx
import { renderHook, act, waitFor } from "@testing-library/react";
import { jest } from "@jest/globals";
import { useFetchProperties } from "../property/useFetchProperties";
import type { PropertyFilter, PagedResult } from "@/domain/ports/PropertyRepository";
import type { Property } from "@/domain/entities/Property";

// —————————————————————————————————————————————
// Mocks
// —————————————————————————————————————————————

// devolvemos un repo cualquiera; no lo usamos directamente porque el
// usecase se mockea para devolver nuestra función 'mockFetch'
jest.mock("../../hooks/useRepository", () => ({
  useRepository: () => ({ propertyRepo: {} as any }),
}));

// esta será la función que el usecase fabrique y que el hook invocará
const mockFetch = jest.fn<([filters]: [PropertyFilter]) => Promise<PagedResult<Property>>>();

// mockeamos la fábrica del usecase para que devuelva 'mockFetch'
jest.mock("@/application/usecases/property/fetchProperties", () => ({
  makeFetchPropertiesUseCase: jest.fn(() => mockFetch),
}));

// utilidad para fabricar respuesta típica del backend
const ok = (
  overrides?: Partial<{ data: any[]; totalCount: number; totalPages: number }>
) => ({
  data: [{ id: "p1", name: "Casa Bonita", address: "Calle 123", price: 5000 }],
  totalCount: 1,
  totalPages: 1,
  ...overrides,
});

describe("useFetchProperties", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hace la carga inicial y setea properties/totalPages", async () => {
    mockFetch.mockResolvedValueOnce(ok());

    const { result } = renderHook(() => useFetchProperties());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toHaveLength(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.error).toBeNull();
    });
  });

  it("mergea filtros al llamar refresh() y actualiza el estado", async () => {
    // 1) carga inicial
    mockFetch.mockResolvedValueOnce(ok());

    const { result } = renderHook(() => useFetchProperties());

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    mockFetch.mockClear();

    // 2) refresh con filtros
    mockFetch.mockResolvedValueOnce(ok({ totalCount: 2, totalPages: 2 }));

    await act(async () => {
      await result.current.load({ page: 2 });
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const passedFilters = mockFetch.mock.calls[0][0] as PropertyFilter;
    expect(passedFilters.page).toBe(2);

    expect(result.current.totalCount).toBe(2);
    expect(result.current.totalPages).toBe(2);

    await waitFor(() => expect(result.current.filters.page).toBe(2));
  });

  it("propaga errores cuando el usecase falla", async () => {
    mockFetch.mockRejectedValueOnce(new Error("boom"));

    const { result } = renderHook(() => useFetchProperties());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.data).toEqual([]);
    });
  });

  it("respeta initialFilters al primer fetch", async () => {
    mockFetch.mockResolvedValueOnce(ok());

    const initial = { page: 3 } as Partial<PropertyFilter>;
    renderHook(() => useFetchProperties(initial as any));

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    const calledWith: PropertyFilter = mockFetch.mock.calls[0][0] as PropertyFilter;
    expect(calledWith.page).toBe(3);
  });
});
