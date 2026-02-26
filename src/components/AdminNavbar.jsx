import { Link, useLocation } from "react-router-dom";

function AdminNavbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `relative font-medium transition ${
      location.pathname === path
        ? "text-red-600"
        : "text-gray-600 hover:text-red-500"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* BRAND → HOME */}
        <Link
          to="/"
          className="text-xl font-extrabold text-red-600 tracking-wide hover:text-red-700 transition"
        >
          BloodBond <span className="text-gray-500 text-sm">Admin</span>
        </Link>

        {/* NAV LINKS */}
        <div className="flex gap-8 items-center">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>

          <Link to="/admin" className={linkClass("/admin")}>
            Dashboard
          </Link>

          <Link to="/admin/requests" className={linkClass("/admin/requests")}>
            Requests
          </Link>

          <Link to="/admin/benefit" className={linkClass("/admin/benefit")}>
            Beneficiary
          </Link>

          <Link to="/admin/donors" className={linkClass("/admin/donors")}>
            Donors
          </Link>

          <Link to="/admin/users" className={linkClass("/admin/users")}>
            Users
          </Link>

          <Link to="/admin/events" className={linkClass("/admin/events")}>
            Events
          </Link>

          <Link to="/admin/reports" className={linkClass("/admin/reports")}>
            Reports
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
