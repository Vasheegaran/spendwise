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
      return "The requested subscription was not found.";

    case 500:
      return "Something went wrong on the server.";

    default:
      return "Something went wrong. Please try again.";
  }
};

function SubscriptionSection() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    billingCycle: "MONTHLY",
    startDate: "",
    nextBillingDate: "",
    categoryId: "",
    description: "",
  });

  const [editingSubscriptionId, setEditingSubscriptionId] =
    useState(null);

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
    fetchCategories();
  }, []);

  const fetchSubscriptions = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/subscriptions");

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = await response.json();

      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);

      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = await response.json();

      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);

      setMessage(`Unable to load categories: ${error.message}`);
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
      newErrors.name = "Subscription name is required.";
    }

    const amount = Number(formData.amount);

    if (!formData.amount) {
      newErrors.amount = "Amount is required.";
    } else if (Number.isNaN(amount) || amount <= 0) {
      newErrors.amount = "Amount must be greater than 0.";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required.";
    }

    if (!formData.nextBillingDate) {
      newErrors.nextBillingDate =
        "Next billing date is required.";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required.";
    }

    if (formData.description.length > 500) {
      newErrors.description =
        "Description must not exceed 500 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      billingCycle: "MONTHLY",
      startDate: "",
      nextBillingDate: "",
      categoryId: "",
      description: "",
    });

    setEditingSubscriptionId(null);
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
      const url = editingSubscriptionId
        ? `/api/subscriptions/${editingSubscriptionId}`
        : "/api/subscriptions";

      const method = editingSubscriptionId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          amount: Number(formData.amount),
          billingCycle: formData.billingCycle,
          startDate: formData.startDate,
          nextBillingDate: formData.nextBillingDate,
          categoryId: Number(formData.categoryId),
          description: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const savedSubscription = await response.json();

      if (editingSubscriptionId) {
        setSubscriptions((previousSubscriptions) =>
          previousSubscriptions.map((subscription) =>
            subscription.id === editingSubscriptionId
              ? savedSubscription
              : subscription
          )
        );

        setMessage("Subscription updated successfully!");
      } else {
        setSubscriptions((previousSubscriptions) => [
          ...previousSubscriptions,
          savedSubscription,
        ]);

        setMessage("Subscription added successfully!");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving subscription:", error);

      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (subscription) => {
    setEditingSubscriptionId(subscription.id);

    setFormData({
      name: subscription.name,
      amount: subscription.amount,
      billingCycle: subscription.billingCycle,
      startDate: subscription.startDate,
      nextBillingDate: subscription.nextBillingDate,
      categoryId: String(subscription.categoryId),
      description: subscription.description || "",
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
      "Are you sure you want to delete this subscription?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setMessage("");

    try {
      const response = await fetch(
        `/api/subscriptions/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setSubscriptions((previousSubscriptions) =>
        previousSubscriptions.filter(
          (subscription) => subscription.id !== id
        )
      );

      if (editingSubscriptionId === id) {
        resetForm();
      }

      setMessage("Subscription deleted successfully!");
    } catch (error) {
      console.error("Error deleting subscription:", error);

      setMessage(error.message);
    } finally {
      setDeletingId(null);
    }
  };

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

  const formatBillingCycle = (billingCycle) => {
    return billingCycle
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <section className="subscription-section">
      <div className="expense-section-header">
        <h2>Subscriptions</h2>

        <span className="expense-count">
          {subscriptions.length}{" "}
          {subscriptions.length === 1
            ? "subscription"
            : "subscriptions"}
        </span>
      </div>

      <div className="expense-form-section">
        <h2>
          {editingSubscriptionId
            ? "Edit Subscription"
            : "Add Subscription"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="subscription-name">
              Subscription Name
            </label>

            <input
              id="subscription-name"
              name="name"
              type="text"
              placeholder="Example: Netflix"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {errors.name && (
              <p className="field-error">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="subscription-amount">
              Amount
            </label>

            <input
              id="subscription-amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />

            {errors.amount && (
              <p className="field-error">{errors.amount}</p>
            )}
          </div>

          <div>
            <label htmlFor="billingCycle">
              Billing Cycle
            </label>

            <select
              id="billingCycle"
              name="billingCycle"
              value={formData.billingCycle}
              onChange={handleChange}
            >
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>

          <div>
            <label htmlFor="subscription-start-date">
              Start Date
            </label>

            <input
              id="subscription-start-date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />

            {errors.startDate && (
              <p className="field-error">
                {errors.startDate}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="next-billing-date">
              Next Billing Date
            </label>

            <input
              id="next-billing-date"
              name="nextBillingDate"
              type="date"
              value={formData.nextBillingDate}
              onChange={handleChange}
              required
            />

            {errors.nextBillingDate && (
              <p className="field-error">
                {errors.nextBillingDate}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="subscription-category">
              Category
            </label>

            <select
              id="subscription-category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            {errors.categoryId && (
              <p className="field-error">
                {errors.categoryId}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="subscription-description">
              Description
            </label>

            <input
              id="subscription-description"
              name="description"
              type="text"
              placeholder="Example: Video streaming"
              value={formData.description}
              onChange={handleChange}
            />

            {errors.description && (
              <p className="field-error">
                {errors.description}
              </p>
            )}
          </div>

          <button type="submit" disabled={isSaving}>
            {isSaving
              ? editingSubscriptionId
                ? "Updating..."
                : "Saving..."
              : editingSubscriptionId
                ? "Update Subscription"
                : "Add Subscription"}
          </button>

          {editingSubscriptionId && (
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
          <h3>Loading subscriptions...</h3>
          <p>Please wait while your subscriptions are loaded.</p>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="empty-state">
          <h3>No subscriptions yet</h3>
          <p>Add your first subscription above.</p>
        </div>
      ) : (
        <div className="expense-list">
          {subscriptions.map((subscription) => (
            <article
              className="expense-card"
              key={subscription.id}
            >
              <div className="expense-card-main">
                <div>
                  <h3>{subscription.name}</h3>

                  <p className="expense-description">
                    {subscription.categoryName} ·{" "}
                    {formatBillingCycle(
                      subscription.billingCycle
                    )}
                  </p>

                  {subscription.description && (
                    <p className="expense-description">
                      {subscription.description}
                    </p>
                  )}
                </div>

                <strong className="expense-amount">
                  ₹{Number(subscription.amount).toFixed(2)}
                </strong>
              </div>

              <div className="expense-card-details">
                <span>
                  📅 Next:{" "}
                  {formatDate(subscription.nextBillingDate)}
                </span>

                <span>
                  ▶ Started:{" "}
                  {formatDate(subscription.startDate)}
                </span>
              </div>

              <div className="expense-card-actions">
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => handleEdit(subscription)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    handleDelete(subscription.id)
                  }
                  disabled={deletingId === subscription.id}
                >
                  {deletingId === subscription.id
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

export default SubscriptionSection;