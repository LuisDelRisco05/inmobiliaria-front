interface Props {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  return (
    <div className="join">
      <button
        className="join-item btn bg-primary text-white"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        «
      </button>
      <button disabled className="join-item btn bg-primary text-white">
        Página {page} / {totalPages}
      </button>
      <button
        className="join-item btn bg-primary text-white"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        »
      </button>
    </div>
  );
}
