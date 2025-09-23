import { propertyApiAdapter } from "@/infra/api/propertyApiAdapter";
import { RepoContext } from "../context/repoContext";
import { ownerApiAdapter } from "@/infra/api/ownerApiAdapter";



export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const propertyRepo = propertyApiAdapter;
  const ownerRepo = ownerApiAdapter;
  return <RepoContext.Provider value={{ propertyRepo, ownerRepo }}>{children}</RepoContext.Provider>;
};