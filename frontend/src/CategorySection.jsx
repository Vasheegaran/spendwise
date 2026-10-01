import { useEffect, useState } from "react";

const getErrorMessage = async (response) => {
  try {
    const errorData = await response.json();

    if (errorData.message) {
      return errorData.message;
    }
  } catch {
    // Response does not contain JSON.
  }

  switch (response.status) {
    case 400:
      return "Invalid request. Please check your input.";

    case 404:
      return "The requested category was not found.";

    case 409:
      return "A category with this name already exists.";

    case 500:
      return "Something went wrong on the server.";

    default:
      return "Something went wrong. Please try again.";
  }
};

function CategorySection() {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [editingCategoryId, setEditingCategoryId] =
    useState(null);

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/categories");

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = await response.json();

      setCategories(data);
      setMessage("");
    } catch (error) {
      console.error("Error fetching categories:", error);

      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required.";
    }

    if (formData.name.trim().length > 50) {
      newErrors.name =
        "Category name must not exceed 50 characters.";
    }

    if (formData.description.length > 255) {
      newErrors.description =
        "Category description must not exceed 255 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });

    setEditingCategoryId(null);
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const url = editingCategoryId
        ? `/api/categories/${editingCategoryId}`
        : "/api/categories";

      const method = editingCategoryId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const savedCategory = await response.json();

      if (editingCategoryId) {
        setCategories((previousCategories) =>
          previousCategories.map((category) =>
            category.id === editingCategoryId
              ? savedCategory
              : category
          )
        );

        setMessage("Category updated successfully!");
      } else {
        setCategories((previousCategories) => [
          ...previousCategories,
          savedCategory,
        ]);

        setMessage("Category added successfully!");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);

      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category.id);

    setFormData({
      name: category.name,
      description: category.description || "",
    });

    setMessage("");
    setErrors({});

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setMessage("");

    try {
      const response = await fetch(
        `/api/categories/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setCategories((previousCategories) =>
        previousCategories.filter(
          (category) => category.id !== id
        )
      );

      if (editingCategoryId === id) {
        resetForm();
      }

      setMessage("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);

      setMessage(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="category-section">
      <div className="expense-section-header">
        <h2>Categories</h2>

        <span className="expense-count">
          {categories.length}{" "}
          {categories.length === 1
            ? "category"
            : "categories"}
        </span>
      </div>

      <div className="expense-form-section">
        <h2>
          {editingCategoryId
            ? "Edit Category"
            : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="category-name">
              Category Name
            </label>

            <input
              id="category-name"
              name="name"
              type="text"
              placeholder="Example: Food"
              value={formData.name}
              onChange={handleChange}
              maxLength={50}
              required
            />

            {errors.name && (
              <p className="field-error">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="category-description">
              Description
            </label>

            <input
              id="category-description"
              name="description"
              type="text"
              placeholder="Example: Food and dining expenses"
              value={formData.description}
              onChange={handleChange}
              maxLength={255}
            />

            {errors.description && (
              <p className="field-error">
                {errors.description}
              </p>
            )}
          </div>

          <button type="submit" disabled={isSaving}>
            {isSaving
              ? editingCategoryId
                ? "Updating..."
                : "Saving..."
              : editingCategoryId
                ? "Update Category"
                : "Add Category"}
          </button>

          {editingCategoryId && (
            <button
              type="button"
              className="cancel-button"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </form>

        {message && <p>{message}</p>}
      </div>

      {isLoading ? (
        <div className="empty-state">
          <h3>Loading categories...</h3>
          <p>Please wait while your categories are loaded.</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <h3>No categories yet</h3>
          <p>Add your first category above.</p>
        </div>
      ) : (
        <div className="expense-list">
          {categories.map((category) => (
            <article
              className="expense-card"
              key={category.id}
            >
              <div className="expense-card-main">
                <div>
                  <h3>{category.name}</h3>

                  {category.description && (
                    <p className="expense-description">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="expense-card-actions">
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => handleEdit(category)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    handleDelete(category.id)
                  }
                  disabled={deletingId === category.id}
                >
                  {deletingId === category.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default CategorySection;