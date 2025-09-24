import userEvent from "@testing-library/user-event";
import PropertyForm from "../PropertyForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// 🔹 Mocks de usecases y hooks
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockFetchOwners = jest.fn();
const mockShowAlert = jest.fn();

jest.mock("@/application/usecases/property/createProperty", () => ({
  makeCreatePropertyUseCase: () => mockCreate,
}));

jest.mock("@/application/usecases/property/updateProperty", () => ({
  makeUpdatePropertyUseCase: () => mockUpdate,
}));

jest.mock("@/application/usecases/owner/fetchOwners", () => ({
  makeFetchOwnersUseCase: () => mockFetchOwners,
}));

jest.mock("@/ui/hooks/useRepository", () => ({
  useRepository: () => ({ propertyRepo: {} }),
}));

jest.mock("@/ui/hooks/useAlert", () => ({
  useAlert: () => ({ showAlert: mockShowAlert }),
}));

describe("PropertyForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchOwners.mockResolvedValue({
      data: [{ id: "o1", name: "Luis" }],
    });
  });

  it("renderiza inputs y botón", async () => {
    render(<PropertyForm />);
    expect(await screen.findByText("Agregar Propiedad")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nombre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Dirección")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Precio")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("URL de la imagen")).toBeInTheDocument();
  });

  it("muestra errores de validación si se envía vacío", async () => {
    render(<PropertyForm />);
    fireEvent.click(screen.getByRole("button", { name: /crear/i }));
    expect(
      await screen.findByText(/El propietario es obligatorio/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/El nombre es obligatorio/i)
    ).toBeInTheDocument();
  });

  it("crea una propiedad cuando no hay initialData", async () => {
    const onCreated = jest.fn();

    render(<PropertyForm onCreated={onCreated} />);

    // 👇 Espera a que aparezca el option
    await screen.findByRole("option", { name: "Luis" });

    // Selección del owner
    await userEvent.selectOptions(screen.getByRole("combobox"), "o1");

    // Completar el formulario
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Casa Bonita" },
    });
    fireEvent.change(screen.getByPlaceholderText("Dirección"), {
      target: { value: "Calle 123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Precio"), {
      target: { value: "3000" },
    });
    fireEvent.change(screen.getByPlaceholderText("URL de la imagen"), {
      target: { value: "http://img.jpg" },
    });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /crear/i }));

    // 👇 Validar que se haya llamado el usecase
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        idOwner: "o1",
        name: "Casa Bonita",
        address: "Calle 123",
        price: 3000,
        imageUrl: "http://img.jpg",
      });
      expect(onCreated).toHaveBeenCalled();
      expect(mockShowAlert).toHaveBeenCalledWith(
        "Propiedad creada con éxito!",
        "success",
        5000
      );
    });
  });

 it("edita una propiedad cuando hay initialData", async () => {
  const onUpdated = jest.fn();
  const initialData = {
    id: "1",
    idOwner: "o1",
    name: "Casa Vieja",
    address: "Calle Vieja",
    price: 1000,
    imageUrl: "http://old.jpg",
  };

  mockUpdate.mockResolvedValueOnce({});

  render(<PropertyForm initialData={initialData} onUpdated={onUpdated} />);

  // 👇 asegura que el select y el input se cargaron
  await screen.findByRole("option", { name: "Luis" });
  const nameInput = await screen.findByDisplayValue("Casa Vieja");

  // 👇 cambia el owner para forzar re-sync de react-hook-form
  await userEvent.selectOptions(screen.getByRole("combobox"), "o1");

  // 👇 ahora cambia el nombre con userEvent
  await userEvent.clear(nameInput);
  await userEvent.type(nameInput, "Casa Nueva");

  // Submit
  await userEvent.click(screen.getByRole("button", { name: /actualizar/i }));

  // Validaciones
  await waitFor(() => {
    expect(mockUpdate).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({ name: "Casa Nueva" })
    );
    expect(onUpdated).toHaveBeenCalled();
    expect(mockShowAlert).toHaveBeenCalledWith(
      "Propiedad actualizada con éxito!",
      "success",
      5000
    );
  });
});

});
