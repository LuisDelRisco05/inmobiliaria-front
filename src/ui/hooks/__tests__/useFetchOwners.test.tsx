import { renderHook, act, waitFor } from "@testing-library/react";
import { jest } from '@jest/globals';
import { useFetchOwners } from "../owner/useFetchOwners";
import type { OwnerFilter, PagedResult } from "@/domain/ports/OwnerRepository";
import type { Owner } from "@/domain/entities/Owner";

// —————————————————————————————————————————————
// Mocks
// —————————————————————————————————————————————

// devolvemos un repo cualquiera; no lo usamos directamente porque el
// usecase se mockea para devolver nuestra función 'mockFetch'
jest.mock("../../hooks/useRepository", () => ({
  useRepository: () => ({ ownerRepo: {} as any }),
}));

// esta será la función que el usecase fabrique y que el hook invocará
const mockFetch = jest.fn<([filters]: [OwnerFilter]) => Promise<PagedResult<Owner>>>();

// mockeamos la fábrica del usecase para que devuelva 'mockFetch'
jest.mock("@/application/usecases/owner/fetchOwners", () => ({
  makeFetchOwnersFilterUseCase: jest.fn(() => mockFetch),
}));

// utilidad para fabricar respuesta típica del backend
const ok = (overrides?: Partial<{ data: any[]; totalCount: number; totalPages: number }>) => ({
  data: [{ id: "1", name: "Luis", address: "Calle 123" }],
  totalCount: 1,
  totalPages: 1,
  ...overrides,
});

describe("useFetchOwners", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hace la carga inicial y setea owners/totalPages", async () => {
    mockFetch.mockResolvedValueOnce(ok());

    const { result } = renderHook(() => useFetchOwners());

    // la carga inicial la dispara el useEffect del hook
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result.current.loading).toBe(false);
      expect(result.current.owners).toHaveLength(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.error).toBeNull();
    });
  });

  it("mergea filtros al llamar refresh() (p. ej. page=2) y actualiza el estado", async () => {
    // 1) respuesta de la carga inicial
    mockFetch.mockResolvedValueOnce(ok());

    const { result } = renderHook(() => useFetchOwners());

    // espera la carga inicial
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    mockFetch.mockClear();

    // 2) respuesta para el refresh
    mockFetch.mockResolvedValueOnce(ok({ totalCount: 2, totalPages: 2 }));

    await act(async () => {
      await result.current.refresh({ page: 2 });
    });

    // se llamó con los filtros merged (page=2 + defaults)
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const passedFilters = mockFetch.mock.calls[0][0] as OwnerFilter;
    expect(passedFilters.page).toBe(2);

    // y el estado se actualiza
    expect(result.current.totalCount).toBe(2);
    expect(result.current.totalPages).toBe(2);

    // también puedes chequear que el state interno de filtros cambió
    await waitFor(() => expect(result.current.filters.page).toBe(2));
  });

  it("propaga errores cuando el usecase falla", async () => {
    mockFetch.mockRejectedValueOnce(new Error("boom"));

    const { result } = renderHook(() => useFetchOwners());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.owners).toEqual([]);
    });
  });

  it("respeta initialFilters al primer fetch", async () => {
    mockFetch.mockResolvedValueOnce(ok());

    const initial = { page: 3 } as Partial<OwnerFilter>;
    renderHook(() => useFetchOwners(initial as any));

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    const calledWith: OwnerFilter = mockFetch.mock.calls[0][0] as OwnerFilter;
    expect(calledWith.page).toBe(3); // llegó el filtro inicial
  });
});
