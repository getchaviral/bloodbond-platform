import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-10 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-bold text-white">BloodBond</h2>
          <p className="mt-4 text-sm">
            A life-saving platform connecting blood donors, banks, and patients.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/findblood" className="hover:text-red-400 transition">
                Find Blood
              </Link>
            </li>

            <li>
              <Link to="/login" className="hover:text-red-400 transition">
                Donate Blood
              </Link>
            </li>

            <li>
              <Link to="/community" className="hover:text-red-400 transition">
                Community
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Contact</h3>
          <p className="text-sm">info@bloodbond.com</p>
          <p className="text-sm">+91 8791478177</p>
        </div>
      </div>

      <div className="text-center text-sm py-4 border-t border-gray-700">
        © 2026 BloodBond. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
