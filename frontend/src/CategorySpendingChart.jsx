function CategorySpendingChart({ categories = [] }) {
  if (categories.length === 0) {
    return (
      <div className="dashboard-empty-state">
        <p>No category spending data available.</p>
      </div>
    );
  }

  const maxAmount = Math.max(
    ...categories.map((category) =>
      Number(category.totalAmount)
    )
  );

  return (
    <div className="category-chart">
      <div className="category-chart-axis">
        <span>₹{maxAmount.toFixed(0)}</span>
        <span>₹0</span>
      </div>

      <div className="category-chart-bars">
        {categories.map((category) => {
          const amount = Number(category.totalAmount);

          const height =
            maxAmount > 0
              ? (amount / maxAmount) * 100
              : 0;

          return (
            <div
              className="category-chart-item"
              key={category.categoryId}
            >
              <div className="category-chart-value">
                ₹{amount.toFixed(0)}
              </div>

              <div className="category-chart-bar-area">
                <div
                  className="category-chart-bar"
                  style={{
                    height: `${height}%`,
                  }}
                  title={`${category.categoryName}: ₹${amount.toFixed(
                    2
                  )}`}
                />
              </div>

              <span className="category-chart-label">
                {category.categoryName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategorySpendingChart;