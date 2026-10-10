function RecentExpenses({ expenses = [] }) {
  if (expenses.length === 0) {
    return (
      <div className="dashboard-empty-state">
        <p>No recent expenses available.</p>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

 const formatPaymentMethod = (paymentMethod) => {
  if (!paymentMethod) {
    return "Not specified";
  }

  return paymentMethod
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};
  return (
    <div className="recent-expenses-list">
      {expenses.map((expense) => (
        <article
          className="recent-expense-item"
          key={expense.id}
        >
          <div className="recent-expense-main">
            <div>
              <h4 className="recent-expense-category">
                {expense.categoryName}
              </h4>

              {expense.description && (
                <p className="recent-expense-description">
                  {expense.description}
                </p>
              )}
            </div>

            <strong className="recent-expense-amount">
              ₹{Number(expense.amount).toFixed(2)}
            </strong>
          </div>

          <div className="recent-expense-details">
            <span>
              {formatDate(expense.expenseDate)}
            </span>

            <span>
              {formatPaymentMethod(expense.paymentMethod)}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

export default RecentExpenses;