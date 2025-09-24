// src/ui/components/owner/__tests__/OwnerDetail.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OwnerDetail from "../OwnerDetail";
import { ownerApiAdapter } from "@/infra/api/ownerApiAdapter";
import { useParams, useNavigate, MemoryRouter } from "react-router-dom";

// --- Mocks ---
jest.mock("@/infra/api/ownerApiAdapter", () => ({
  ownerApiAdapter: {
    fetchAll: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("../../owner/OwnerForm", () => () => (
  <div data-testid="owner-form">OwnerForm</div>
));
jest.mock(
  "../../common/Modal",
  () =>
    ({ children, isOpen }: any) =>
      isOpen ? <div data-testid="modal">{children}</div> : null
);
jest.mock(
  "../../common/ConfirmModal",
  () => (props: any) =>
    props.isOpen ? (
      <div>
        <p>{props.message}</p>
        <button onClick={props.onConfirm}>Confirmar</button>
        <button onClick={props.onCancel}>Cancelar</button>
      </div>
    ) : null
);
jest.mock("../../common/Loading", () => () => (
  <div data-testid="spinner">Loading...</div>
));

describe("OwnerDetail", () => {
  const navigateMock = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
  });

  it("muestra loading inicialmente", () => {
    (ownerApiAdapter.fetchAll as jest.Mock).mockResolvedValueOnce({ data: [] });
    render(
      <MemoryRouter>
        <OwnerDetail />
      </MemoryRouter>
    );
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("muestra error si API falla", async () => {
    (ownerApiAdapter.fetchAll as jest.Mock).mockRejectedValueOnce(
      new Error("boom")
    );
    render(
      <MemoryRouter>
        <OwnerDetail />
      </MemoryRouter>
    );
    expect(await screen.findByText("boom")).toBeInTheDocument();
  });

  it("muestra mensaje si owner no existe", async () => {
    (ownerApiAdapter.fetchAll as jest.Mock).mockResolvedValueOnce({ data: [] });
    render(
      <MemoryRouter>
        <OwnerDetail />
      </MemoryRouter>
    );
    expect(
      await screen.findByText(/propietario no encontrado/i)
    ).toBeInTheDocument();
  });

  it("renderiza datos del owner", async () => {
    (ownerApiAdapter.fetchAll as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          id: "1",
          name: "Luis",
          address: "Calle 123",
          photo: "http://foto.jpg",
          birthday: "1990-01-01",
        },
      ],
    });

    render(
      <MemoryRouter>
        <OwnerDetail />
      </MemoryRouter>
    );
    expect(await screen.findByText(/Luis/)).toBeInTheDocument();
    expect(screen.getByText(/Calle 123/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Luis" })).toHaveAttribute(
      "src",
      "http://foto.jpg"
    );
  });

  it("abre modal de edición al hacer click en editar", async () => {
    (ownerApiAdapter.fetchAll as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          id: "1",
          name: "Luis",
          address: "Calle 123",
          photo: "",
          birthday: "1990-01-01",
        },
      ],
    });

    render(
      <MemoryRouter>
        <OwnerDetail />
      </MemoryRouter>
    );
    const editBtn = await screen.findByTitle("Editar");
    fireEvent.click(editBtn);

    expect(await screen.findByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("owner-form")).toBeInTheDocument();
  });

  it("confirma eliminación y navega a /owners", async () => {
    (ownerApiAdapter.fetchAll as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          id: "1",
          name: "Luis",
          address: "Calle 123",
          photo: "",
          birthday: "1990-01-01",
        },
      ],
    });
    (ownerApiAdapter.delete as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter>
        <OwnerDetail />
      </MemoryRouter>
    );
    const deleteBtn = await screen.findByTitle("Eliminar");
    fireEvent.click(deleteBtn);

    const confirmBtn = await screen.findByText("Confirmar");
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(ownerApiAdapter.delete).toHaveBeenCalledWith("1");
      expect(navigateMock).toHaveBeenCalledWith("/owners");
    });
  });
});
