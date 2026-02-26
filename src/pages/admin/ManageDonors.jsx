import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import api from "../../services/api";

function ManageDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await api.get("/admin/donors");
        setDonors(res.data);
      } catch (err) {
        setError("Failed to load donors");
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  return (
    <>
      <AdminNavbar />

      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Registered Donors</h1>

        {error && (
          <div className="bg-red-100 text-red-700 rounded p-3 mb-6">{error}</div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading donors...</p>
        ) : donors.length === 0 ? (
          <p className="text-gray-500">No donors registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {donors.map((d) => (
              <div
                key={d._id}
                className="bg-white p-6 rounded-xl shadow hover:-translate-y-1 transition"
              >
                <h2 className="text-xl font-bold">{d.name}</h2>
                <p className="text-gray-600">Blood Group: {d.bloodGroup}</p>
                <p className="text-gray-600">City: {d.city}</p>
                <p className="text-gray-600">Age: {d.age}</p>
                <p className="mt-2 font-semibold text-green-600">
                  Donations: {d.donations}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ManageDonors;
