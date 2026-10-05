function ExpensePaymentFilter({ value, onChange }) {
  return (
    <div className="expense-filter">
      <label htmlFor="expense-payment-filter">
        Payment Method
      </label>

      <select
        id="expense-payment-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">All Payment Methods</option>

        <option value="CASH">Cash</option>

        <option value="UPI">UPI</option>

        <option value="CREDIT_CARD">
          Credit Card
        </option>

        <option value="DEBIT_CARD">
          Debit Card
        </option>

        <option value="BANK_TRANSFER">
          Bank Transfer
        </option>

        <option value="OTHER">Other</option>
      </select>
    </div>
  );
}

export default ExpensePaymentFilter;