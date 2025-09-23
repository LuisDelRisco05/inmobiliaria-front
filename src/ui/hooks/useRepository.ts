import { useContext } from "react";
import { RepoContext } from "../context/repoContext";

export const useRepository = () => {
  const ctx = useContext(RepoContext);
  if (!ctx) throw new Error("RepoContext not found");
  return ctx;
};