import { useEffect, useState, useCallback, useMemo } from "react";
import { makeFetchPropertiesUseCase } from "@/application/usecases/property/fetchProperties";
import type { Property } from "@/domain/entities/Property";
import { useRepository } from "../useRepository";
import type { PropertyFilter } from "@/domain/ports/PropertyRepository";

export function useFetchProperties(initialFilters?: PropertyFilter) {
  const { propertyRepo } = useRepository();

  // memorizar el use-case
  const fetchProps = useMemo(
    () => makeFetchPropertiesUseCase(propertyRepo),
    [propertyRepo]
  );

  const [data, setData] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<PropertyFilter>({
    page: 1,
    pageSize: 6,
    sortBy: "price",
    sortOrder: "asc",
    ...initialFilters,
  });

  const load = useCallback(
    async (newFilters?: Partial<PropertyFilter>) => {
      const merged = { ...filters, ...newFilters };
      setFilters(merged);
      setLoading(true);
      setError(null);
      try {
        const result = await fetchProps(merged);
        setData(result.data);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
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
    load(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  return { data, totalCount, totalPages, loading, error, load, filters };
}
