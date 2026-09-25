import { useEffect, useState } from "react";

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

  const fetchExpenses = () => {
    fetch("/api/expenses")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        return response.json();
      })
      .then((data) => {
        setExpenses(data);
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
      });
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

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
        throw new Error(
          editingExpenseId
            ? "Failed to update expense"
            : "Failed to create expense"
        );
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

      setMessage(
        editingExpenseId
          ? "Failed to update expense."
          : "Failed to add expense."
      );
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

    setMessage("");

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
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
      setMessage("Failed to delete expense.");
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
              </div>

              <button type="submit">
                {editingExpenseId ? "Update Expense" : "Add Expense"}
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

            {expenses.length === 0 ? (
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
                      >
                        Delete
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