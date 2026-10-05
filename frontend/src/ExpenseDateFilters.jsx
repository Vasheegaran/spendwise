function ExpenseDateFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) {
  return (
    <div className="expense-date-filters">
      <div className="expense-date-filter">
        <label htmlFor="expense-start-date">
          Start Date
        </label>

        <input
          id="expense-start-date"
          type="date"
          value={startDate}
          onChange={(event) =>
            onStartDateChange(event.target.value)
          }
        />
      </div>

      <div className="expense-date-filter">
        <label htmlFor="expense-end-date">
          End Date
        </label>

        <input
          id="expense-end-date"
          type="date"
          value={endDate}
          onChange={(event) =>
            onEndDateChange(event.target.value)
          }
        />
      </div>
    </div>
  );
}

export default ExpenseDateFilters;