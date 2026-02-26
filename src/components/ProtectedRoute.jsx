import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but wrong role
  if (role && role !== userRole) {
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized
  return children;
}

export default ProtectedRoute;
