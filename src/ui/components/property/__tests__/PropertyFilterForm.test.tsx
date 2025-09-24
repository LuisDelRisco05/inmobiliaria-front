// src/ui/components/property/__tests__/PropertyFilterForm.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import PropertyFilterForm from "../PropertyFilterForm";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";

describe("PropertyFilterForm", () => {
  let onFilter: jest.Mock;
  let close: jest.Mock;

  beforeEach(() => {
    onFilter = jest.fn();
    close = jest.fn();
  });

  it("renderiza inputs y botones", () => {
    render(<PropertyFilterForm onFilter={onFilter} close={close} />);

    expect(screen.getByPlaceholderText("Nombre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Dirección")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Precio mínimo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Precio máximo")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /aplicar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /limpiar/i })
    ).toBeInTheDocument();
  });

  it("envía filtros al hacer submit y llama a close", async () => {
  render(<PropertyFilterForm onFilter={onFilter} close={close} />);

  fireEvent.change(screen.getByPlaceholderText("Nombre"), {
    target: { value: "Casa Bonita" },
  });
  fireEvent.change(screen.getByPlaceholderText("Dirección"), {
    target: { value: "Calle 123" },
  });
  fireEvent.change(screen.getByPlaceholderText("Precio mínimo"), {
    target: { value: "1000" },
  });
  fireEvent.change(screen.getByPlaceholderText("Precio máximo"), {
    target: { value: "5000" },
  });

  await userEvent.click(screen.getByRole("button", { name: /aplicar/i }));


  expect(onFilter).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "Casa Bonita",
      address: "Calle 123",
      minPrice: 1000,
      maxPrice: 5000,
    })
  );
  expect(close).toHaveBeenCalled();
});

it("no incluye campos vacíos en el filtro", async () => {
  render(<PropertyFilterForm onFilter={onFilter} close={close} />);

  fireEvent.change(screen.getByPlaceholderText("Precio máximo"), {
    target: { value: "8000" },
  });

  await userEvent.click(screen.getByRole("button", { name: /aplicar/i }));

  expect(onFilter).toHaveBeenCalledWith(
    expect.objectContaining({ maxPrice: 8000 })
  );
});


  it("resetea al hacer click en limpiar", () => {
    render(<PropertyFilterForm onFilter={onFilter} close={close} />);

    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Casa Bonita" },
    });

    fireEvent.click(screen.getByRole("button", { name: /limpiar/i }));

    expect(onFilter).toHaveBeenCalledWith({});
    expect(close).toHaveBeenCalled();
  });
});
