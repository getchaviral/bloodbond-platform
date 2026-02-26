import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

function BloodbankDashboard() {
  const [profile, setProfile] = useState({
    name: "",
    state: "",
    district: "",
    city: "",
    address: "",
    phone: "",
  });
  const [profileReady, setProfileReady] = useState(false);
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [units, setUnits] = useState("");
  const [stocks, setStocks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionId, setActionId] = useState("");

  const fetchProfile = async () => {
    const res = await api.get("/bloodbank/profile");
    const data = res.data;
    if (data) {
      setProfile({
        name: data.name || "",
        state: data.state || "",
        district: data.district || "",
        city: data.city || "",
        address: data.address || "",
        phone: data.phone || "",
      });
      setProfileReady(true);
    } else {
      setProfileReady(false);
    }
  };

  const fetchStock = async () => {
    const res = await api.get("/bloodbank/stock");
    setStocks(res.data);
  };

  const fetchRequests = async () => {
    const res = await api.get("/bloodbank/requests");
    setRequests(res.data);
  };

  const loadDashboard = async () => {
    try {
      setError("");
      await Promise.all([fetchProfile(), fetchStock(), fetchRequests()]);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.put("/bloodbank/profile", profile);
      setProfileReady(true);
      setSuccess("Blood bank profile saved");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save profile");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/bloodbank/stock", { bloodGroup, units });
      setUnits("");
      setSuccess("Stock updated successfully");
      await fetchStock();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update stock");
    }
  };

  const fulfillRequest = async (id) => {
    try {
      setError("");
      setSuccess("");
      setActionId(id);
      await api.post(`/bloodbank/fulfill/${id}`);
      setSuccess("Request fulfilled successfully");
      await Promise.all([fetchStock(), fetchRequests()]);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fulfill request");
    } finally {
      setActionId("");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Blood Bank Dashboard</h1>

          {error && (
            <div className="bg-red-100 text-red-700 rounded p-3 mb-6">{error}</div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 rounded p-3 mb-6">{success}</div>
          )}

          <div className="bg-white rounded-xl shadow p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4">Blood Bank Profile</h2>
            <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="border rounded-lg px-4 py-2"
                placeholder="Blood Bank Name"
                required
              />
              <input
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="border rounded-lg px-4 py-2"
                placeholder="State"
                required
              />
              <input
                value={profile.district}
                onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                className="border rounded-lg px-4 py-2"
                placeholder="District"
                required
              />
              <input
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="border rounded-lg px-4 py-2"
                placeholder="City"
                required
              />
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="border rounded-lg px-4 py-2"
                placeholder="Phone"
              />
              <input
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="border rounded-lg px-4 py-2"
                placeholder="Address"
              />
              <button className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 transition md:col-span-3">
                Save Profile
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4">Update Blood Stock</h2>
            {!profileReady && (
              <p className="text-sm text-gray-500 mb-3">
                Save profile first to enable stock updates and public location search.
              </p>
            )}
            <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg}>{bg}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Units Available"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                min="1"
                step="1"
                required
                className="border rounded-lg px-4 py-2"
              />

              <button
                disabled={loading || !profileReady}
                className="bg-red-600 text-white rounded-lg px-6 py-2 hover:bg-red-700 transition disabled:opacity-60"
              >
                Update Stock
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4">Current Blood Stock</h2>

            <table className="w-full text-left">
              <thead className="text-gray-600 border-b">
                <tr>
                  <th className="py-2">Blood Group</th>
                  <th className="py-2">Units</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {stocks.map((s) => {
                  const status = s.units > 5 ? "Available" : s.units > 2 ? "Low" : "Critical";
                  const statusColor =
                    status === "Available"
                      ? "bg-green-100 text-green-700"
                      : status === "Low"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700";

                  return (
                    <tr key={s._id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{s.bloodGroup}</td>
                      <td className="py-3 font-semibold">{s.units}</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Approved Blood Requests</h2>

            {loading ? (
              <p className="text-gray-500">Loading requests...</p>
            ) : requests.length === 0 ? (
              <p className="text-gray-500">No approved requests at the moment.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="text-gray-600 border-b">
                  <tr>
                    <th className="py-2">Blood Group</th>
                    <th className="py-2">Units</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((r) => (
                    <tr key={r._id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{r.bloodGroup}</td>
                      <td className="py-3 font-semibold">{r.units}</td>
                      <td className="py-3">
                        <button
                          onClick={() => fulfillRequest(r._id)}
                          disabled={actionId === r._id || !profileReady}
                          className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700 transition disabled:opacity-60"
                        >
                          Fulfill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BloodbankDashboard;
