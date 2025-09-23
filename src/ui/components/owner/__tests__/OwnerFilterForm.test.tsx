// src/ui/components/__tests__/OwnerFilterForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OwnerFilterForm from "../OwnerFilterForm";
import type { OwnerFilter } from "@/domain/ports/OwnerRepository";
import userEvent from "@testing-library/user-event";

describe("OwnerFilterForm", () => {
  const setup = () => {
    const onFilter: jest.MockedFunction<
      (values: Partial<OwnerFilter>) => void
    > = jest.fn();
    const close = jest.fn();
    render(<OwnerFilterForm onFilter={onFilter} close={close} />);
    return { onFilter, close };
  };

  it("renderiza los inputs y botones", () => {
    setup();

    expect(
      screen.getByPlaceholderText("Nombre del propietario")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Dirección")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /aplicar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /limpiar/i })
    ).toBeInTheDocument();
  });

  it("envía filtros al hacer submit y llama a close", async () => {
    const { onFilter, close } = setup();

    await userEvent.type(
      screen.getByPlaceholderText("Nombre del propietario"),
      "Luis"
    );
    await userEvent.type(screen.getByPlaceholderText("Dirección"), "Calle 123");

    await userEvent.click(screen.getByRole("button", { name: /aplicar/i }));

    await waitFor(() => {
      expect(onFilter).toHaveBeenCalledWith({
        name: "Luis",
        address: "Calle 123",
      });
      expect(close).toHaveBeenCalled();
    });
  });

  it("no incluye campos vacíos en el filtro", async () => {
    const { onFilter } = setup();

    await userEvent.type(screen.getByPlaceholderText("Dirección"), "Calle 123");

    await userEvent.click(screen.getByRole("button", { name: /aplicar/i }));

    await waitFor(() => {
      expect(onFilter).toHaveBeenCalledWith({ address: "Calle 123" });
    });
  });

  it("resetea al hacer click en limpiar", () => {
    const { onFilter, close } = setup();

    fireEvent.change(screen.getByPlaceholderText("Nombre del propietario"), {
      target: { value: "Luis" },
    });
    fireEvent.change(screen.getByPlaceholderText("Dirección"), {
      target: { value: "Calle 123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /limpiar/i }));

    expect(onFilter).toHaveBeenCalledWith({});
    expect(close).toHaveBeenCalled();

    // los inputs deberían quedar vacíos
    expect(screen.getByPlaceholderText("Nombre del propietario")).toHaveValue(
      ""
    );
    expect(screen.getByPlaceholderText("Dirección")).toHaveValue("");
  });
});
