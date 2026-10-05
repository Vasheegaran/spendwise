function CategorySpending({ categories = [] }) {
  if (categories.length === 0) {
    return (
      <div className="dashboard-empty-state">
        <p>No category spending data available.</p>
      </div>
    );
  }

  const maxAmount = Math.max(
    ...categories.map((category) => Number(category.totalAmount))
  );

  return (
    <div className="category-spending-list">
      {categories.map((category) => {
        const amount = Number(category.totalAmount);

        const percentage =
          maxAmount > 0 ? (amount / maxAmount) * 100 : 0;

        return (
          <div
            className="category-spending-item"
            key={category.categoryId}
          >
            <div className="category-spending-header">
              <span className="category-spending-name">
                {category.categoryName}
              </span>

              <strong className="category-spending-amount">
                ₹{amount.toFixed(2)}
              </strong>
            </div>

            <div className="category-spending-bar">
              <div
                className="category-spending-bar-fill"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CategorySpending;