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

    case 401:
      return "You are not authorized to perform this action.";

    case 403:
      return "You do not have permission to perform this action.";

    case 404:
      return "The requested expense was not found.";

    case 409:
      return "This request conflicts with existing data.";

    case 500:
      return "Something went wrong on the server.";

    default:
      return "Something went wrong. Please try again.";
  }
};

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [isConnected, setIsConnected] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    expenseDate: "",
    paymentMethod: "UPI",
  });

  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);

  useEffect(() => {
    fetch("/api/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }

        return response.text();
      })
      .then((data) => {
        setBackendStatus(data);
        setIsConnected(true);
      })
      .catch(() => {
        setBackendStatus("Backend is offline");
        setIsConnected(false);
      });
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setIsLoadingExpenses(true);
    setMessage("");

    try {
      const response = await fetch("/api/expenses");

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
      }

      const data = await response.json();

      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);

      if (error instanceof TypeError) {
        setMessage(
          "Unable to connect to the backend. Please make sure the server is running."
        );
      } else {
        setMessage(error.message);
      }
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      category: "",
      description: "",
      expenseDate: "",
      paymentMethod: "UPI",
    });

    setEditingExpenseId(null);
    setErrors({});
  };

const validateForm = () => {
  const newErrors = {};

  const amount = Number(formData.amount);

  if (!formData.amount) {
    newErrors.amount = "Amount is required.";
  } else if (Number.isNaN(amount) || amount <= 0) {
    newErrors.amount = "Amount must be greater than 0.";
  }

  if (!formData.category.trim()) {
    newErrors.category = "Category is required.";
  }

  if (formData.description.length > 500) {
    newErrors.description = "Description must not exceed 500 characters.";
  }

  if (!formData.expenseDate) {
    newErrors.expenseDate = "Expense date is required.";
  }

  if (!formData.paymentMethod) {
    newErrors.paymentMethod = "Payment method is required.";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const url = editingExpenseId
        ? `/api/expenses/${editingExpenseId}`
        : "/api/expenses";

      const method = editingExpenseId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(formData.amount),
          category: formData.category,
          description: formData.description,
          expenseDate: formData.expenseDate,
          paymentMethod: formData.paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
      }

      const savedExpense = await response.json();

      if (editingExpenseId) {
        setExpenses((previousExpenses) =>
          previousExpenses.map((expense) =>
            expense.id === editingExpenseId ? savedExpense : expense
          )
        );

        setMessage("Expense updated successfully!");
      } else {
        setExpenses((previousExpenses) => [
          ...previousExpenses,
          savedExpense,
        ]);

        setMessage("Expense added successfully!");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving expense:", error);

      if (error instanceof TypeError) {
        setMessage(
          "Unable to connect to the backend. Please try again."
        );
      } else {
        setMessage(error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpenseId(expense.id);

    setFormData({
      amount: expense.amount,
      category: expense.category,
      description: expense.description || "",
      expenseDate: expense.expenseDate,
      paymentMethod: expense.paymentMethod,
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
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingExpenseId(id);
    setMessage("");

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
      }

      setExpenses((previousExpenses) =>
        previousExpenses.filter((expense) => expense.id !== id)
      );

      if (editingExpenseId === id) {
        resetForm();
      }

      setMessage("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);

      if (error instanceof TypeError) {
        setMessage(
          "Unable to connect to the backend. Please try again."
        );
      } else {
        setMessage(error.message);
      }
    } finally {
      setDeletingExpenseId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPaymentMethod = (paymentMethod) => {
    return paymentMethod
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <div className="app">
      <header className="header">
        <h1>SpendWise</h1>
        <p>Personal Expense & Subscription Tracker</p>
      </header>

      <main className="main">
        <section className="welcome-card">
          <h2>Welcome to SpendWise</h2>

          <p>
            Manage your expenses and subscriptions in one simple place.
          </p>

          <div className="status-card">
            <span
              className="status-dot"
              style={{
                backgroundColor: isConnected ? "#22c55e" : "#ef4444",
              }}
            ></span>

            <div>
              <h3>
                {isConnected ? "Backend Connected" : "Backend Offline"}
              </h3>

              <p>{backendStatus}</p>
            </div>
          </div>

          <div className="expense-form-section">
            <h2>
              {editingExpenseId ? "Edit Expense" : "Add Expense"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="amount">Amount</label>

                <input
                  id="amount"
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
                <label htmlFor="category">Category</label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="Example: Food"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
{errors.category && (
  <p className="field-error">{errors.category}</p>
)}
              </div>

              <div>
                <label htmlFor="description">Description</label>

                <input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Example: Dinner"
                  value={formData.description}
                  onChange={handleChange}
                />

{errors.expenseDate && (
  <p className="field-error">{errors.expenseDate}</p>
)}
              </div>

              <div>
                <label htmlFor="expenseDate">Expense Date</label>

                <input
                  id="expenseDate"
                  name="expenseDate"
                  type="date"
                  value={formData.expenseDate}
                  onChange={handleChange}
                  required
                />

{errors.expenseDate && (
  <p className="field-error">{errors.expenseDate}</p>
)}
              </div>

              <div>
                <label htmlFor="paymentMethod">Payment Method</label>

                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="DEBIT_CARD">Debit Card</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="OTHER">Other</option>
                </select>
{errors.paymentMethod && (
  <p className="field-error">{errors.paymentMethod}</p>
)}
              </div>

              <button type="submit" disabled={isSaving}>
                {isSaving
                  ? editingExpenseId
                    ? "Updating..."
                    : "Saving..."
                  : editingExpenseId
                    ? "Update Expense"
                    : "Add Expense"}
              </button>

              {editingExpenseId && (
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

          <div className="expense-section">
            <div className="expense-section-header">
              <h2>Expenses</h2>

              <span className="expense-count">
                {expenses.length}{" "}
                {expenses.length === 1 ? "expense" : "expenses"}
              </span>
            </div>

            {isLoadingExpenses ? (
              <div className="empty-state">
                <h3>Loading expenses...</h3>
                <p>Please wait while your expenses are loaded.</p>
              </div>
            ) : expenses.length === 0 ? (
              <div className="empty-state">
                <h3>No expenses yet</h3>
                <p>Add your first expense using the form above.</p>
              </div>
            ) : (
              <div className="expense-list">
                {expenses.map((expense) => (
                  <article className="expense-card" key={expense.id}>
                    <div className="expense-card-main">
                      <div>
                        <h3>{expense.category}</h3>

                        {expense.description && (
                          <p className="expense-description">
                            {expense.description}
                          </p>
                        )}
                      </div>

                      <strong className="expense-amount">
                        ₹{Number(expense.amount).toFixed(2)}
                      </strong>
                    </div>

                    <div className="expense-card-details">
                      <span>
                        📅 {formatDate(expense.expenseDate)}
                      </span>

                      <span>
                        💳 {formatPaymentMethod(expense.paymentMethod)}
                      </span>
                    </div>

                    <div className="expense-card-actions">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => handleEdit(expense)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDelete(expense.id)}
                        disabled={deletingExpenseId === expense.id}
                      >
                        {deletingExpenseId === expense.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>SpendWise © 2026</p>
      </footer>
    </div>
  );
}

export default App;