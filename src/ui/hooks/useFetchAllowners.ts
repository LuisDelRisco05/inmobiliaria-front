// src/ui/hooks/useFetchAllOwners.ts
import { useEffect, useState, useMemo } from "react";
import type { Owner } from "@/domain/entities/Owner";
import { makeFetchOwnersUseCase } from "@/application/usecases/owner/fetchOwners";
import { useRepository } from "./useRepository";

export function useFetchAllOwners() {
  const { ownerRepo }= useRepository(); // Este ya te da el repo correcto
  const fetchOwners = useMemo(() => makeFetchOwnersUseCase(ownerRepo), [ownerRepo]);

  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await fetchOwners(); // ya no hay filtros
        setOwners(result.data);
      } catch (err) {
        if (err instanceof Error) setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [fetchOwners]);

  return { owners, loading, error };
}
