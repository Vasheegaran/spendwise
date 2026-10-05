function ExpensePagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) {
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= totalPages - 1;

  return (
    <div className="expense-pagination">
      <button
        type="button"
        className="pagination-button"
        onClick={onPrevious}
        disabled={isFirstPage}
      >
        Previous
      </button>

      <span className="pagination-info">
        Page {currentPage + 1} of {totalPages}
      </span>

      <button
        type="button"
        className="pagination-button"
        onClick={onNext}
        disabled={isLastPage}
      >
        Next
      </button>
    </div>
  );
}

export default ExpensePagination;