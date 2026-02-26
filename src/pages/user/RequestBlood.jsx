import { useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

function RequestBlood() {
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [units, setUnits] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      await api.post("/user/request", { bloodGroup, units });
      setUnits("");
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow">
          <h2 className="text-3xl font-bold text-center mb-2">
            Request Blood
          </h2>

          <p className="text-center text-gray-600 mb-6">
            Submit a request and we will notify nearby blood banks
          </p>

          {success && (
            <div className="bg-green-100 text-green-700 text-sm p-3 rounded mb-4 text-center">
              Blood request submitted successfully!
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                  <option key={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Units Required
              </label>
              <input
                type="number"
                min="1"
                placeholder="Enter number of units"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default RequestBlood;
