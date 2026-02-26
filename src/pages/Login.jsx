import { useState, useEffect } from "react";
import { loginUser } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔐 Redirect logged-in users away from /login
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "bloodbank") navigate("/bloodbank", { replace: true });
      else navigate("/user", { replace: true });
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // ✅ Use replace to remove /login from history
      if (data.role === "admin") navigate("/admin", { replace: true });
      else if (data.role === "bloodbank")
        navigate("/bloodbank", { replace: true });
      else navigate("/user", { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Demo autofill (matches seeded DB users)
  const fillDemo = (role) => {
    if (role === "admin") {
      setEmail("admin@demo.com");
      setPassword("admin123");
    }
    if (role === "bloodbank") {
      setEmail("bank@demo.com");
      setPassword("bank123");
    }
    if (role === "user") {
      setEmail("user@demo.com");
      setPassword("user123");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">

        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-red-500 mb-4"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <h1 className="text-3xl font-extrabold text-center text-red-600">
          BloodBond
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Login to continue saving lives
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mt-4">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={submitHandler} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              autoComplete="email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              autoComplete="current-password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          New user?{" "}
          <Link to="/register" className="text-red-600 font-semibold hover:underline">
            Create account
          </Link>
        </p>

        {/* Demo Credentials */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-600 text-center mb-4">
            Demo Credentials (for reviewers)
          </h3>

          <div className="space-y-3 text-sm">
            <DemoRow
              label="Admin"
              email="admin@demo.com"
              password="admin123"
              onClick={() => fillDemo("admin")}
            />

            <DemoRow
              label="Blood Bank"
              email="bank@demo.com"
              password="bank123"
              onClick={() => fillDemo("bloodbank")}
            />

            <DemoRow
              label="User"
              email="user@demo.com"
              password="user123"
              onClick={() => fillDemo("user")}
            />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Admin • Blood Bank • User
        </p>
      </div>
    </div>
  );
}

function DemoRow({ label, email, password, onClick }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-gray-500">{email}</p>
        <p className="text-gray-500">{password}</p>
      </div>
      <button
        onClick={onClick}
        className="text-red-600 font-semibold hover:underline"
      >
        Use
      </button>
    </div>
  );
}

export default Login;
