import { createContext } from "react";
import type { PropertyRepository } from "@/domain/ports/PropertyRepository";
import type { OwnerRepository } from "@/domain/ports/OwnerRepository";

export const RepoContext = createContext<{ propertyRepo: PropertyRepository, ownerRepo: OwnerRepository } | null>(null);
