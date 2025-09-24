// src/ui/pages/__tests__/HomePage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RepoContext } from "@/ui/context/repoContext";
import { AlertProvider } from "@/ui/context/alert/AlertProvider";

// --- Mocks de propertyApiAdapter y ownerApiAdapter ---
jest.mock("@/infra/api/propertyApiAdapter", () => ({
  propertyApiAdapter: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    fetchAll: jest.fn(),
    fetchById: jest.fn(),
  },
}));

jest.mock("@/infra/api/ownerApiAdapter", () => ({
  ownerApiAdapter: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    fetchAll: jest.fn(),
    fetchById: jest.fn(),
  },
}));

// --- Mock de useFetchProperties ---
jest.mock("@/ui/hooks/property/useFetchProperties", () => ({
  useFetchProperties: () => ({
    properties: [],
    data: [],
    loading: false,
    error: null,
    refresh: jest.fn(),
    filters: {},
    totalPages: 1,
    load: jest.fn(),
  }),
}));

// --- Mock de PropertyForm, PropertyFilterForm y PropertyList ---
jest.mock("@/ui/components/property/PropertyForm", () => () => (
  <div>Mocked PropertyForm</div>
));
jest.mock("@/ui/components/property/PropertyFilterForm", () => () => (
  <div>Mocked PropertyFilterForm</div>
));
jest.mock("@/ui/components/property/PropertyList", () => () => (
  <div>Mocked PropertyList</div>
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

// 🚨 IMPORTAMOS HomePage después de declarar mocks
import HomePage from "../HomePage";

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

// --- Helper con RepoContext y AlertProvider ---
const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <MemoryRouter>
      <RepoContext.Provider value={fakeRepos}>
        <AlertProvider>{ui}</AlertProvider>
      </RepoContext.Provider>
    </MemoryRouter>
  );

// --- Tests ---
describe("HomePage (integration-light)", () => {
  it("renderiza título y PropertyList", () => {
    renderWithProviders(<HomePage />);
    expect(
      screen.getByText(/🏡 Listado de propiedades/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Mocked PropertyList/i)).toBeInTheDocument();
  });

  it("abre modal de nueva propiedad al hacer click en botón flotante", () => {
    renderWithProviders(<HomePage />);
    fireEvent.click(screen.getByTestId("add-property-btn"));
    expect(screen.getByText(/Mocked PropertyForm/i)).toBeInTheDocument();
  });

  it("abre modal de filtros al hacer click en botón flotante", () => {
    renderWithProviders(<HomePage />);
    fireEvent.click(screen.getByTestId("filter-btn"));
    expect(screen.getByText(/Mocked PropertyFilterForm/i)).toBeInTheDocument();
  });

  it("muestra link a la página de propietarios", () => {
    renderWithProviders(<HomePage />);
    const link = screen.getByRole("link", { name: /👤/i });
    expect(link).toHaveAttribute("href", "/owners");
  });
});
