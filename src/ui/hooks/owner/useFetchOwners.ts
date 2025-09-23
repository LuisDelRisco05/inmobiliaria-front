import { useCallback, useEffect, useMemo, useState } from "react";
import type { Owner } from "@/domain/entities/Owner";
import type { PropertyFilter } from "@/domain/ports/PropertyRepository";
import type { OwnerFilter } from "@/domain/ports/OwnerRepository";
import { useRepository } from "../useRepository";
import { makeFetchOwnersFilterUseCase } from "@/application/usecases/owner/fetchOwners";

export function useFetchOwners(initialFilters?: PropertyFilter) {

  const { ownerRepo } = useRepository();

  const fetchProps = useMemo(
      () => makeFetchOwnersFilterUseCase(ownerRepo),
      [ownerRepo]
  );
  const [owners, setOwners] = useState<Owner[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<OwnerFilter>({
    page: 1,
    pageSize: 6,
    sortBy: "price",
    sortOrder: "asc",
    ...initialFilters,
  });

  const load = useCallback(
    async (newFilters?: Partial<OwnerFilter>) => {
      const merged = { ...filters, ...newFilters };
      setFilters(merged);
      setLoading(true);
      setError(null);
      try {
        const res = await fetchProps(merged);
        setOwners(res.data);
        setTotalCount(res.totalCount);
        setTotalPages(res.totalPages);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("Error desconocido"));
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchProps, filters]
  );

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    owners,
    loading,
    error,
    refresh: load,
    setOwners,
    totalCount,
    totalPages,
    filters
  };
}
