import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import indiaStates from "../data/indiaStates";

function FindBlood() {
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const districts = state ? indiaStates[state] || [] : [];

  const searchHandler = async () => {
    setLoading(true);
    setError("");
    setSearched(false);

    try {
      const res = await api.get("/public/blood-stock", {
        params: {
          bloodGroup,
          ...(state ? { state } : {}),
          ...(district ? { district } : {}),
        },
      });
      setResults(res.data);
      setSearched(true);
    } catch (err) {
      setError("Unable to fetch blood availability");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
          <h1 className="text-3xl font-bold text-center mb-6">
            Find Blood Availability
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="border px-4 py-2 rounded-lg"
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg}>{bg}</option>
              ))}
            </select>

            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setDistrict("");
              }}
              className="border px-4 py-2 rounded-lg"
            >
              <option value="">All States</option>
              {Object.keys(indiaStates).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!state}
              className="border px-4 py-2 rounded-lg disabled:bg-gray-100"
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={searchHandler}
            disabled={loading}
            className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search Blood Banks"}
          </button>
        </div>

        {error && <p className="text-center text-red-600 mt-6">{error}</p>}

        {searched && (
          <div className="max-w-4xl mx-auto mt-10">
            {results.length === 0 ? (
              <p className="text-center text-gray-600">
                No blood availability found for the selected criteria.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((stock) => (
                  <BloodStockCard key={stock._id} stock={stock} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

function BloodStockCard({ stock }) {
  const status =
    stock.units > 5 ? "Available" : stock.units > 2 ? "Low" : "Critical";

  const statusColor =
    status === "Available"
      ? "bg-green-100 text-green-700"
      : status === "Low"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <h2 className="text-xl font-bold">{stock.bankName}</h2>
      <p className="text-gray-600 mt-1">
        {stock.district}, {stock.state}
      </p>
      <p className="text-gray-500 text-sm mt-1">Blood Group: {stock.bloodGroup}</p>

      <div className="flex justify-between items-center mt-4">
        <span className="font-semibold">Units: {stock.units}</span>
        <span className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>
          {status}
        </span>
      </div>

      <Link
        to="/user/request"
        className="block text-center w-full mt-4 border border-red-600 text-red-600 py-2 rounded-lg hover:bg-red-50 transition"
      >
        Request Blood
      </Link>
    </div>
  );
}

export default FindBlood;
