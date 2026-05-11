import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// TODO: build a login form with relevant fields
// TODO: call login(email, password) from useAuth() on submit
// TODO: show a clear error message if login fails
// TODO: redirect to the event list on success

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div className="content-width">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="david@email.com"
            />
          </div>

          <div>
            <label>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>

          {error && <p role="alert">{error}</p>}

          <button type="submit" disabled={submitting}>
            {"submitting" ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
          No account yet? <Link to="register">Register</Link>
        </p>
      </div>
    </div>
  );
}
