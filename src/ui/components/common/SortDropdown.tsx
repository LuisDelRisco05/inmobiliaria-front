interface Props {
  onSort: (sortBy: "price" | "name", sortOrder: "asc" | "desc") => void;
}

export default function SortDropdown({ onSort }: Props) {
  return (
    <div className="dropdown">
      <label tabIndex={0} className="btn m-1 bg-primary text-white">
        Ordenar
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <button onClick={() => onSort("price", "asc")}>Precio ascendente</button>
        </li>
        <li>
          <button onClick={() => onSort("price", "desc")}>Precio descendente</button>
        </li>
        <li>
          <button onClick={() => onSort("name", "asc")}>Nombre A-Z</button>
        </li>
        <li>
          <button onClick={() => onSort("name", "desc")}>Nombre Z-A</button>
        </li>
      </ul>
    </div>
  );
}
