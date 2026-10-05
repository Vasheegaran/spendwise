function ExpenseCategoryFilter({
  categories = [],
  value,
  onChange,
}) {
  return (
    <div className="expense-filter">
      <label htmlFor="expense-category-filter">
        Category
      </label>

      <select
        id="expense-category-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">All Categories</option>

        {categories.map((category) => (
          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ExpenseCategoryFilter;