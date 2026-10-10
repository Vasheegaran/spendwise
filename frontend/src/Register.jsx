import { useState } from "react";

function Register({ onRegisterSuccess, onShowLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required.");
      return false;
    }

    if (formData.name.trim().length > 100) {
      setError("Name must not exceed 100 characters.");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      return false;
    }

    if (!formData.password) {
      setError("Password is required.");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }

    if (formData.password.length > 100) {
      setError("Password must not exceed 100 characters.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsRegistering(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
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
          data.message || "Registration failed. Please try again."
        );
      }

      setSuccess(
        "Registration successful! You can now login with your account."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      if (onRegisterSuccess) {
        onRegisterSuccess(data);
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error instanceof TypeError) {
        setError(
          "Unable to connect to the backend. Please make sure the server is running."
        );
      } else {
        setError(error.message);
      }
    } finally {
      setIsRegistering(false);
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
          <h2>Create Account</h2>

          <p className="auth-subtitle">
            Create your account to start tracking your spending.
          </p>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success" role="status">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="register-name">Name</label>

              <input
                id="register-name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                maxLength={100}
                disabled={isRegistering}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">Email</label>

              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                maxLength={150}
                disabled={isRegistering}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">Password</label>

              <input
                id="register-password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                maxLength={100}
                disabled={isRegistering}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-confirm-password">
                Confirm Password
              </label>

              <input
                id="register-confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                maxLength={100}
                disabled={isRegistering}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-button"
              disabled={isRegistering}
            >
              {isRegistering ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            <span>Already have an account?</span>

            <button
              type="button"
              className="auth-link-button"
              onClick={onShowLogin}
              disabled={isRegistering}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;