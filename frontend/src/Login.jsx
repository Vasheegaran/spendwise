import { useState } from "react";
import { saveAuth } from "./auth";

function Login({ onLoginSuccess, onShowRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoggingIn(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

    if (!data.token) {
  throw new Error(
    "Login succeeded but no authentication token was received."
  );
}

saveAuth(data);
onLoginSuccess(data);
    } catch (error) {
      console.error("Login error:", error);

      if (error instanceof TypeError) {
        setError(
          "Unable to connect to the backend. Please make sure the server is running."
        );
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>SpendWise</h1>
          <p>Personal Expense & Subscription Tracker</p>
        </div>

        <div className="auth-content">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">
            Login to manage your expenses and subscriptions.
          </p>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="login-email">Email</label>

              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={isLoggingIn}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Password</label>

              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={isLoggingIn}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-button"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-switch">
            <span>Don't have an account?</span>

            <button
              type="button"
              className="auth-link-button"
              onClick={onShowRegister}
              disabled={isLoggingIn}
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;