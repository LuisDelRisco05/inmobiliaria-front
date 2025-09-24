import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PropertyDetail from "../PropertyDetail";

// 🔹 Mocks
jest.mock("@/ui/hooks/useRepository", () => ({
  useRepository: () => ({ propertyRepo: {} }),
}));

const mockFetchById = jest.fn();
jest.mock("@/application/usecases/property/fetchPropertyById", () => ({
  makeFetchPropertyByIdUseCase: () => mockFetchById,
}));

jest.mock("../../common/Modal", () => ({ children, isOpen }: any) =>
  isOpen ? <div data-testid="modal">{children}</div> : null
);

jest.mock("../../common/ConfirmModal", () => (props: any) =>
  props.isOpen ? (
    <div data-testid="confirm">
      <button onClick={props.onConfirm}>Confirmar</button>
      <button onClick={props.onCancel}>Cancelar</button>
    </div>
  ) : null
);

jest.mock("../PropertyForm", () => () => <div data-testid="form">Form</div>);

jest.mock("@/infra/api/propertyApiAdapter", () => ({
  propertyApiAdapter: {
    delete: jest.fn(),
  },
}));
import { propertyApiAdapter } from "@/infra/api/propertyApiAdapter";

// helper render con router y param id
const renderWithRouter = (ui: React.ReactNode, { route = "/properties/1" } = {}) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/properties/:id" element={ui} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("PropertyDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("muestra loading inicialmente", async () => {
    mockFetchById.mockReturnValue(new Promise(() => {})); // no resuelve
    renderWithRouter(<PropertyDetail />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("muestra error si API falla", async () => {
    mockFetchById.mockRejectedValueOnce(new Error("Error de carga"));
    renderWithRouter(<PropertyDetail />);
    expect(await screen.findByText("Error de carga")).toBeInTheDocument();
  });

  it("muestra mensaje si propiedad no existe", async () => {
    mockFetchById.mockResolvedValueOnce(null);
    renderWithRouter(<PropertyDetail />);
    expect(await screen.findByText(/propiedad no encontrada/i)).toBeInTheDocument();
  });

  it("renderiza datos de la propiedad", async () => {
    mockFetchById.mockResolvedValueOnce({
      id: "1",
      name: "Casa Bonita",
      address: "Calle 123",
      price: 2000,
      imageUrl: "http://foto.jpg",
      idOwner: "99",
    });
    renderWithRouter(<PropertyDetail />);

    expect(await screen.findByText("Casa Bonita")).toBeInTheDocument();
    expect(screen.getByText("Calle 123")).toBeInTheDocument();
    expect(screen.getByText(/\$/).closest("p")).toHaveTextContent(/2[.,]000/);
    expect(screen.getByText(/ID Owner: 99/)).toBeInTheDocument();
  });

  it("abre modal de edición al hacer click en editar", async () => {
    mockFetchById.mockResolvedValueOnce({
      id: "1",
      name: "Casa Bonita",
      address: "Calle 123",
      price: 2000,
      imageUrl: "http://foto.jpg",
      idOwner: "99",
    });
    renderWithRouter(<PropertyDetail />);

    const editBtn = await screen.findByTitle("Editar");
    fireEvent.click(editBtn);

    expect(await screen.findByTestId("modal")).toBeInTheDocument();
  });

  it("confirma eliminación y navega a home", async () => {
    (propertyApiAdapter.delete as jest.Mock).mockResolvedValueOnce(undefined);
    mockFetchById.mockResolvedValueOnce({
      id: "1",
      name: "Casa Bonita",
      address: "Calle 123",
      price: 2000,
      imageUrl: "http://foto.jpg",
      idOwner: "99",
    });
    renderWithRouter(<PropertyDetail />);

    const deleteBtn = await screen.findByTitle("Eliminar");
    fireEvent.click(deleteBtn);

    const confirmBtn = await screen.findByText("Confirmar");
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(propertyApiAdapter.delete).toHaveBeenCalledWith("1");
      expect(screen.getByText("Home")).toBeInTheDocument();
    });
  });
});
