import { useEffect, useState } from "react";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [isConnected, setIsConnected] = useState(false);

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
        </section>
      </main>

      <footer className="footer">
        <p>SpendWise © 2026</p>
      </footer>
    </div>
  );
}

export default App;