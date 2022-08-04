export default function Paginator({
  count,
  page,
  perPage,
  handlePageChange,
}: {
  count: number;
  page: number;
  perPage: number;
  handlePageChange: (page: number) => void;
}) {
  const pages = Math.ceil(count / perPage);

  return (
    <div className="mb-5 flex justify-center">
      <div className="flex justify-between">
        <button
          className="flex items-center justify-center px-4  py-2 text-sm font-medium hover:shadow-md disabled:text-gray-300 disabled:hover:shadow-none"
          onClick={() => handlePageChange(1)}
          disabled={page === 1}
        >
          &lt;&lt;
        </button>
        <button
          className="flex items-center justify-center  px-4 py-2 text-sm font-medium hover:shadow-md disabled:text-gray-300 disabled:hover:shadow-none"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          &lt;
        </button>
        <div className="flex items-center">
          <span className="text-sm font-medium">
            Strana {page} od {pages}
          </span>
        </div>
        <button
          className="flex items-center justify-center  px-4 py-2 text-sm font-medium hover:shadow-md disabled:text-gray-300 disabled:hover:shadow-none"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === pages}
        >
          &gt;
        </button>
        <button
          className="flex items-center justify-center  px-4 py-2 text-sm font-medium hover:shadow-md disabled:text-gray-300 disabled:hover:shadow-none"
          onClick={() => handlePageChange(pages)}
          disabled={page === pages}
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
}
