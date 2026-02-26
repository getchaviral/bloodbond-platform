import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({ name, email, password });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-red-500 mb-4"
        >
          Back to Home
        </Link>

        <h1 className="text-3xl font-extrabold text-center text-red-600">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Register as a BloodBond user
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mt-4">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              autoComplete="name"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Minimum 6 characters"
              value={password}
              autoComplete="new-password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
