import { useEffect, useState } from "react";
import "./dashboard.css";
import CategorySpending from "./CategorySpending";
import RecentExpenses from "./RecentExpenses";
import CategorySpendingChart from "./CategorySpendingChart";

function DashboardSection() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/dashboard");

      if (!response.ok) {
        throw new Error(
          "Unable to load dashboard data. Please try again."
        );
      }

      const data = await response.json();

      setDashboard(data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);

      if (error instanceof TypeError) {
        setError(
          "Unable to connect to the backend. Please make sure the server is running."
        );
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <section className="dashboard-section">
        <div className="dashboard-header">
          <div>
            <h2>Dashboard</h2>
            <p className="dashboard-subtitle">
              Overview of your expenses and subscriptions
            </p>
          </div>
        </div>

        <div className="dashboard-loading-state">
          <p>Loading dashboard...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="dashboard-section">
        <div className="dashboard-header">
          <div>
            <h2>Dashboard</h2>
            <p className="dashboard-subtitle">
              Overview of your expenses and subscriptions
            </p>
          </div>
        </div>

        <div className="dashboard-error-state">
          <h3>Unable to load dashboard</h3>
          <p>{error}</p>

          <button
            type="button"
            onClick={fetchDashboard}
            className="dashboard-retry-button"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <div className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p className="dashboard-subtitle">
            Overview of your expenses and subscriptions
          </p>
        </div>
      </div>

      <div className="dashboard-summary-grid">
        <article className="dashboard-card">
          <span className="dashboard-card-label">
            Total Expenses
          </span>

          <strong className="dashboard-card-value">
            {formatCurrency(dashboard.totalExpenses)}
          </strong>

          <p className="dashboard-card-description">
            All recorded expenses
          </p>
        </article>

        <article className="dashboard-card">
          <span className="dashboard-card-label">
            This Month
          </span>

          <strong className="dashboard-card-value">
            {formatCurrency(dashboard.currentMonthExpenses)}
          </strong>

          <p className="dashboard-card-description">
            Expenses this month
          </p>
        </article>

        <article className="dashboard-card">
          <span className="dashboard-card-label">
            Today
          </span>

          <strong className="dashboard-card-value">
            {formatCurrency(dashboard.todayExpenses)}
          </strong>

          <p className="dashboard-card-description">
            Expenses today
          </p>
        </article>

        <article className="dashboard-card">
          <span className="dashboard-card-label">
            Active Subscriptions
          </span>

          <strong className="dashboard-card-value">
            {dashboard.activeSubscriptions}
          </strong>

          <p className="dashboard-card-description">
            Currently tracked
          </p>
        </article>

        <article className="dashboard-card">
          <span className="dashboard-card-label">
            Monthly Subscription Cost
          </span>

          <strong className="dashboard-card-value">
            {formatCurrency(
              dashboard.estimatedMonthlySubscriptionCost
            )}
          </strong>

          <p className="dashboard-card-description">
            Estimated monthly cost
          </p>
        </article>
      </div>

      <div className="dashboard-content-grid">
        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h3>Category Spending</h3>
          </div>

          <CategorySpending
            categories={dashboard.categorySpending || []}
          />
<div className="category-chart-section">
  <div className="category-chart-title">
    <h4>Spending Chart</h4>
  </div>

  <CategorySpendingChart
    categories={dashboard.categorySpending || []}
  />
</div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h3>Recent Expenses</h3>
          </div>

          <RecentExpenses
            expenses={dashboard.recentExpenses || []}
          />
        </article>
      </div>
    </section>
  );
}

export default DashboardSection;