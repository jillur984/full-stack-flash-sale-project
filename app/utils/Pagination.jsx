const Pagination = ({
  TotalPages,
  currentPage,
  setCurrentPage,
  recordsPerPage,
}) => {
  // Ensure we have at least one page to display
  const pageNumbers =
    TotalPages > 0 ? [...Array(TotalPages).keys()].map((i) => i + 1) : [];

  // Go to the next page if not on the last page
  const goToNextPage = () => {
    if (currentPage !== TotalPages) setCurrentPage(currentPage + 1);
  };

  // Go to the previous page if not on the first page
  const goToPrevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };

  return (
    <nav>
      <ul className="flex items-center justify-center space-x-2 mt-5">
        {/* Previous Button */}
        <li>
          <button
            className={`px-4 py-2 border rounded-lg ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((pgNumber) => (
          <li key={pgNumber}>
            <button
              onClick={() => setCurrentPage(pgNumber)}
              className={`px-4 py-2 border rounded-lg ${
                currentPage === pgNumber
                  ? "bg-blue-500 text-white"
                  : "text-blue-500"
              }`}
            >
              {pgNumber}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            className={`px-4 py-2 border rounded-lg ${
              currentPage === TotalPages
                ? "text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
            onClick={goToNextPage}
            disabled={currentPage === TotalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
