import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PropertyList from "../PropertyList";
import type { Property } from "@/domain/entities/Property";
import type { PropertyFilter } from "@/domain/ports/PropertyRepository";

// 🔹 Mock de componentes hijos
jest.mock("../../common/SortDropdown", () => ({ onSort }: any) => (
  <select data-testid="sort" onChange={() => onSort("name", "asc")}>
    <option value="name-asc">Name Asc</option>
  </select>
));

jest.mock("../../common/Pagination", () => ({ onPageChange }: any) => (
  <button onClick={() => onPageChange(2)}>2</button>
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
      <div data-testid="confirm">
        <button onClick={props.onConfirm}>Confirmar</button>
        <button onClick={props.onCancel}>Cancelar</button>
      </div>
    ) : null
);

// 🔹 Mock de react-router-dom (si lo usas en PropertyList)
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

// 🔹 Mock del propertyApiAdapter para no ejecutar import.meta.env
jest.mock("@/infra/api/propertyApiAdapter", () => ({
  propertyApiAdapter: {
    delete: jest.fn(),
    fetchAll: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
}));
import { propertyApiAdapter } from "@/infra/api/propertyApiAdapter";

const defaultProps = {
  data: [
    {
      id: "1",
      name: "Casa Bonita",
      address: "Calle 123",
      price: 2000,
      imageUrl: "http://foto.jpg",
    },
  ] as Property[],
  loading: false,
  error: null,
  load: jest.fn(),
  filters: {
    page: 1,
    pageSize: 6,
    sortBy: "price",
    sortOrder: "asc",
  } as PropertyFilter,
  totalPages: 1,
};

const setup = (props = {}) =>
  render(<PropertyList {...defaultProps} {...props} />);

describe("PropertyList", () => {
  it("muestra spinner cuando loading es true", () => {
    setup({ loading: true, data: [] });
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("muestra error cuando error existe", () => {
    setup({ error: new Error("Error de carga"), data: [] });
    expect(screen.getByText("Error de carga")).toBeInTheDocument();
  });

  it("muestra mensaje cuando no hay propiedades", () => {
    setup({ data: [] });
    expect(
      screen.getByText(/no se encontraron propiedades/i)
    ).toBeInTheDocument();
  });

  it("renderiza lista de propiedades", () => {
    setup();
    expect(screen.getByText("Casa Bonita")).toBeInTheDocument();
    expect(screen.getByText("Calle 123")).toBeInTheDocument();
    expect(screen.getByText(/\$/).closest("p")).toHaveTextContent(/2[.,]000/);
  });

  it("abre confirmación y elimina propiedad", async () => {
    const loadMock = jest.fn();
    (propertyApiAdapter.delete as jest.Mock).mockResolvedValueOnce(undefined);

    setup({ load: loadMock });

    // abrir confirmación
    fireEvent.click(screen.getByTitle("Eliminar"));

    // ahora confirmar
    const confirmBtn = await screen.findByText("Confirmar");
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(propertyApiAdapter.delete).toHaveBeenCalledWith("1");
      expect(loadMock).toHaveBeenCalled();
    });
  });

  it("ejecuta load al cambiar de página", () => {
    const loadMock = jest.fn();
    setup({ load: loadMock });
    fireEvent.click(screen.getByText("2"));
    expect(loadMock).toHaveBeenCalled();
  });

  it("ejecuta load al ordenar", () => {
    const loadMock = jest.fn();
    setup({ load: loadMock });
    fireEvent.change(screen.getByTestId("sort"), {
      target: { value: "name-asc" },
    });
    expect(loadMock).toHaveBeenCalled();
  });
});
