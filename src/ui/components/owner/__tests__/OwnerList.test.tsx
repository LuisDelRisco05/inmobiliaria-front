// src/ui/components/owner/__tests__/OwnerList.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OwnerList from "../OwnerList";
import type { Owner } from "@/domain/entities/Owner";
import { ownerApiAdapter } from "@/infra/api/ownerApiAdapter";
import { useNavigate } from "react-router-dom";
import type { OwnerFilter } from "@/domain/ports/OwnerRepository";


// --- Mocks ---
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("@/infra/api/ownerApiAdapter", () => ({
  ownerApiAdapter: { delete: jest.fn() },
}));

jest.mock("../../common/SortDropdown", () => (props: any) => (
  <select
    data-testid="sort"
    onChange={(e) => {
      const [sortBy, sortOrder] = e.target.value.split("-");
      props.onSort(sortBy, sortOrder);
    }}
  >
    <option value="name-asc">Name Asc</option>
    <option value="price-desc">Price Desc</option>
  </select>
));


jest.mock("../../common/Pagination", () => (props: any) => (
  <div>
    <button onClick={() => props.onPageChange(2)}>2</button>
  </div>
));

jest.mock("../../common/ConfirmModal", () => (props: any) =>
  props.isOpen ? (
    <div>
      <p>{props.message}</p>
      <button onClick={props.onConfirm}>Confirmar</button>
      <button onClick={props.onCancel}>Cancelar</button>
    </div>
  ) : null
);

jest.mock("../../common/Modal", () => ({ children }: any) => <div>{children}</div>);

jest.mock("../OwnerForm", () => () => <div>OwnerForm</div>);

jest.mock("../../common/Loading", () => () => (
  <div data-testid="spinner">Loading...</div>
));


const sampleOwners: Owner[] = [
  { id: "1", name: "Luis", address: "Calle 123", photo: "photo1.jpg", birthday: new Date("1990-01-01") },
  { id: "2", name: "Ana", address: "Avenida 456", photo: "photo2.jpg", birthday: new Date("1992-02-02") },
];


describe("OwnerList", () => {
  const setup = (props?: Partial<React.ComponentProps<typeof OwnerList>>) => {
    const defaultProps = {
      owners: sampleOwners,
      loading: false,
      error: null,
      load: jest.fn(),
      filters: { page: 1, pageSize: 6, sortBy: "price", sortOrder: "asc" } as OwnerFilter,
      totalPages: 1,
    };
    return render(<OwnerList {...defaultProps} {...props} />);
  };

  it("muestra spinner cuando loading es true", () => {
    setup({ loading: true });
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("muestra error cuando error existe", () => {
    setup({ error: new Error("falló la carga") });
    expect(screen.getByText(/falló la carga/i)).toBeInTheDocument();
  });

  it("muestra mensaje cuando no hay owners", () => {
    setup({ owners: [] });
    expect(
      screen.getByText(/no se encontraron propietarios/i)
    ).toBeInTheDocument();
  });

  it("renderiza lista de owners", () => {
    setup();
    expect(screen.getByText("Luis")).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
  });

  it("llama navigate al ver detalles", () => {
    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    setup();
    const btn = screen.getAllByRole("button").find(b => b.getAttribute("data-tip") === "Ver detalles");
    fireEvent.click(btn!);
    expect(navigateMock).toHaveBeenCalledWith("/owners/1");

  });

  it("abre modal de confirmación al eliminar y ejecuta delete al confirmar", async () => {
    const loadMock = jest.fn();
    (ownerApiAdapter.delete as jest.Mock).mockResolvedValueOnce(undefined);

    setup({ load: loadMock });

    // Buscar botón por data-tip
    const deleteBtn = screen.getAllByRole("button").find(
        (b) => b.getAttribute("data-tip") === "Eliminar"
    );
    fireEvent.click(deleteBtn!);

    // Confirmar eliminación
    const confirmBtn = screen.getByRole("button", { name: /confirmar/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
        expect(ownerApiAdapter.delete).toHaveBeenCalledWith("1");
        expect(loadMock).toHaveBeenCalled();
    });
});


  it("ejecuta load al cambiar página", () => {
    const loadMock = jest.fn();
    setup({ load: loadMock, totalPages: 5 });
    fireEvent.click(screen.getByRole("button", { name: /2/i })); // botón página 2
    expect(loadMock).toHaveBeenCalledWith({ page: 2 });
  });

  it("ejecuta load al ordenar", () => {
    const loadMock = jest.fn();
    setup({ load: loadMock });
    // ⚠️ Ajustar según cómo renderice SortDropdown
    const sortDropdown = screen.getByRole("combobox");
    fireEvent.change(sortDropdown, { target: { value: "name-asc" } });
    expect(loadMock).toHaveBeenCalled();
  });
});
