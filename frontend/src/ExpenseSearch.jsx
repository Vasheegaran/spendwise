function ExpenseSearch({ value, onChange }) {
  return (
    <div className="expense-search">
      <label htmlFor="expense-search-input">
        Search Expenses
      </label>

      <div className="expense-search-input-wrapper">
        <span className="expense-search-icon" aria-hidden="true">
          🔍
        </span>

        <input
          id="expense-search-input"
          type="search"
          placeholder="Search by description or category..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}

export default ExpenseSearch;