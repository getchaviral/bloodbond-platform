import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isLoggedIn = !!localStorage.getItem("token");

  const [open, setOpen] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
        {/* BRAND */}
        <h1 className="text-2xl font-extrabold text-red-600 tracking-wide">
          <Link to="/">BloodBond</Link>
        </h1>

        {/* NAV LINKS */}
        <ul className="flex gap-8 items-center text-gray-700 font-medium">
          <li>
            <Link to="/" className="hover:text-red-500">
              Home
            </Link>
          </li>
          <li>
            <Link to="/findblood" className="hover:text-red-500">
              Find Blood
            </Link>
          </li>
          <li>
            <Link to="/community" className="hover:text-red-500">
              Community
            </Link>
          </li>
          <li>
            <Link to="/rewards" className="hover:text-red-500">
              Rewards
            </Link>
          </li>
          <li>
            <Link to="/events" className="hover:text-red-500">
              Events
            </Link>
          </li>

          {/* AUTH SECTION */}
          {!isLoggedIn ? (
            <li>
              <Link to="/login">
                <button className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition">
                  Login
                </button>
              </Link>
            </li>
          ) : (
            <li className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition"
              >
                <span className="font-semibold capitalize">{role}</span>
                <span>▼</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg overflow-hidden">
                  <button
                    onClick={() => {
                      if (role === "admin") navigate("/admin");
                      else if (role === "bloodbank") navigate("/bloodbank");
                      else navigate("/user");
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
