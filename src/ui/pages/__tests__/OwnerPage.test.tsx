// src/ui/pages/__tests__/OwnerPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RepoContext } from "@/ui/context/repoContext";
import { AlertProvider } from "@/ui/context/alert/AlertProvider";

// --- Mocks de ownerApiAdapter y propertyApiAdapter ---
jest.mock("@/infra/api/ownerApiAdapter", () => ({
  ownerApiAdapter: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    fetchAll: jest.fn(),
    fetchById: jest.fn(),
  },
}));

jest.mock("@/infra/api/propertyApiAdapter", () => ({
  propertyApiAdapter: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    fetchAll: jest.fn(),
    fetchById: jest.fn(),
  },
}));

// --- Mock de useFetchOwners ---
jest.mock("@/ui/hooks/owner/useFetchOwners", () => ({
  useFetchOwners: () => ({
    owners: [],
    loading: false,
    error: null,
    refresh: jest.fn(),
    filters: {},
    totalPages: 1,
  }),
}));

// --- Mock de OwnerForm, OwnerFilterForm y OwnerList ---
jest.mock("@/ui/components/owner/OwnerForm", () => () => (
  <div>Mocked OwnerForm</div>
));
jest.mock("@/ui/components/owner/OwnerFilterForm", () => () => (
  <div>Mocked OwnerFilterForm</div>
));
jest.mock("@/ui/components/owner/OwnerList", () => () => (
  <div>Mocked OwnerList</div>
));

// --- Mock de Modal (para evitar errores con <dialog>) ---
jest.mock("@/ui/components/common/Modal", () => {
  return ({ title, children }: any) => (
    <div data-testid="modal">
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
});

// 🚨 IMPORTAMOS OwnersPage después de declarar mocks
import OwnersPage from "../OwnersPage";

// --- Fake repos para RepoContext ---
const fakeRepos = {
  propertyRepo: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    fetchAll: jest.fn(),
    fetchById: jest.fn(),
  },
  ownerRepo: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    fetchAll: jest.fn(),
    fetchById: jest.fn(),
  },
};

// --- Helper con Providers ---
const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <MemoryRouter>
      <RepoContext.Provider value={fakeRepos}>
        <AlertProvider>{ui}</AlertProvider>
      </RepoContext.Provider>
    </MemoryRouter>
  );

// --- Tests ---
describe("OwnersPage (integration-light)", () => {
  it("renderiza título y OwnerList", () => {
    renderWithProviders(<OwnersPage />);
    expect(screen.getByText(/👤 Lista de propietarios/i)).toBeInTheDocument();
    expect(screen.getByText(/Mocked OwnerList/i)).toBeInTheDocument();
  });

  it("abre modal de nuevo propietario al hacer click en botón flotante", () => {
    renderWithProviders(<OwnersPage />);
    fireEvent.click(screen.getByTestId("btn-add-owner"));
    expect(screen.getByText(/Mocked OwnerForm/i)).toBeInTheDocument();
  });

  it("abre modal de filtros al hacer click en botón flotante", () => {
    renderWithProviders(<OwnersPage />);
    fireEvent.click(screen.getByTestId("btn-filter-owner"));
    expect(screen.getByText(/Mocked OwnerFilterForm/i)).toBeInTheDocument();
  });

  it("muestra link para volver a propiedades", () => {
    renderWithProviders(<OwnersPage />);
    const link = screen.getByTestId("link-to-properties");
    expect(link).toHaveAttribute("href", "/");
  });
});
