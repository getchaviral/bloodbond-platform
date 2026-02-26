import { useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

function DonateBlood() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/user/donate", {
        name,
        age,
        bloodGroup,
        city,
      });
      setSuccess("Donor profile saved successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save donor profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
          <h1 className="text-3xl font-bold text-center mb-6">Donate Blood</h1>

          <p className="text-gray-600 text-center mb-8">
            Fill in your details and become a registered blood donor.
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 text-sm p-3 rounded mb-4 text-center">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
              required
            />

            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
              min="18"
              max="65"
              required
            />

            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg}>{bg}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
              required
            />

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Register as Donor"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default DonateBlood;
