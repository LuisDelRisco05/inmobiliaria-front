// src/ui/components/owner/__tests__/OwnerForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OwnerForm from "../OwnerForm";
import { ownerApiAdapter } from "@/infra/api/ownerApiAdapter";
import { useAlert } from "@/ui/hooks/useAlert";

// --- Mocks ---
jest.mock("@/infra/api/ownerApiAdapter", () => ({
  ownerApiAdapter: {
    create: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock("@/ui/hooks/useAlert", () => ({
  useAlert: jest.fn(),
}));

const mockShowAlert = jest.fn();
(useAlert as jest.Mock).mockReturnValue({ showAlert: mockShowAlert });

describe("OwnerForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza inputs y botón", () => {
    render(<OwnerForm />);
    expect(screen.getByPlaceholderText("Nombre")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /crear/i })).toBeInTheDocument();
  });

  it("muestra errores de validación si se envía vacío", async () => {
    render(<OwnerForm />);
    fireEvent.click(screen.getByRole("button", { name: /crear/i }));

    expect(
      await screen.findByText(/El nombre es obligatorio/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/La dirección es obligatoria/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/La foto es obligatoria/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/La fecha de nacimiento es obligatoria/i)
    ).toBeInTheDocument();
  });

  it("crea un owner cuando no hay initialData", async () => {
    (ownerApiAdapter.create as jest.Mock).mockResolvedValueOnce({});

    const onCreated = jest.fn();
    render(<OwnerForm onCreated={onCreated} />);

    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Luis" },
    });
    fireEvent.change(screen.getByPlaceholderText("Dirección"), {
      target: { value: "Calle 123" },
    });
    fireEvent.change(screen.getByPlaceholderText("URL de la foto"), {
      target: { value: "http://foto.com/img.jpg" },
    });
    fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), {
      target: { value: "1990-01-01" },
    });

    fireEvent.click(screen.getByRole("button", { name: /crear/i }));

    await waitFor(() => {
      expect(ownerApiAdapter.create).toHaveBeenCalledWith({
        name: "Luis",
        address: "Calle 123",
        photo: "http://foto.com/img.jpg",
        birthday: "1990-01-01",
      });
      expect(onCreated).toHaveBeenCalled();
      expect(mockShowAlert).toHaveBeenCalledWith(
        "Propietario creado con éxito!",
        "success",
        5000
      );
    });
  });

  it("edita un owner cuando hay initialData", async () => {
    const onUpdated = jest.fn();
    const onClose = jest.fn();

    render(
      <OwnerForm
        initialData={{
          id: "1",
          name: "Ana",
          address: "Calle X",
          photo: "http://old.jpg",
          birthday: "1990-01-01",
        }}
        onUpdated={onUpdated}
        onClose={onClose}
      />
    );

    // 👇 espera a que el input esté poblado con "Ana"
    const nameInput = await screen.findByDisplayValue("Ana");

    // Cambia nombre
    fireEvent.change(nameInput, { target: { value: "Ana María" } });

    // Enviar formulario
    fireEvent.click(screen.getByRole("button", { name: /actualizar/i }));

    // Validaciones
    await waitFor(() => {
      expect(ownerApiAdapter.update).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({ name: "Ana María" })
      );
      expect(onUpdated).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalledWith(null);
      expect(mockShowAlert).toHaveBeenCalledWith(
        "Propietario actualizado con éxito!",
        "success",
        5000
      );
    });
  });

  it("muestra alerta de error si la API falla", async () => {
    (ownerApiAdapter.create as jest.Mock).mockRejectedValueOnce(
      new Error("fail")
    );

    render(<OwnerForm />);
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Luis" },
    });
    fireEvent.change(screen.getByPlaceholderText("Dirección"), {
      target: { value: "Calle 123" },
    });
    fireEvent.change(screen.getByPlaceholderText("URL de la foto"), {
      target: { value: "http://foto.com/img.jpg" },
    });
    fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), {
      target: { value: "1990-01-01" },
    });

    fireEvent.click(screen.getByRole("button", { name: /crear/i }));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "Error al guardar propietario!",
        "error",
        5000
      );
    });
  });
});
