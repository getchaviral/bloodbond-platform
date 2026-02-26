import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import api from "../../services/api";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    city: "",
    organizer: "",
    description: "",
    donorsExpected: "",
    timing: "",
  });

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/events", form);
      setForm({
        title: "",
        date: "",
        location: "",
        city: "",
        organizer: "",
        description: "",
        donorsExpected: "",
        timing: "",
      });
      fetchEvents();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create event");
    }
  };

  const deleteEvent = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      setError("Failed to delete event");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Community Events</h1>

        {error && (
          <div className="bg-red-100 text-red-700 rounded p-3 mb-6">{error}</div>
        )}

        <form onSubmit={submitHandler} className="bg-white p-6 rounded-xl shadow mb-8 space-y-4">
          <h2 className="text-xl font-semibold">Create Event</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border rounded-lg px-4 py-2"
              required
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border rounded-lg px-4 py-2"
              required
            />
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="border rounded-lg px-4 py-2"
              required
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="border rounded-lg px-4 py-2"
              required
            />
            <input
              placeholder="Organizer"
              value={form.organizer}
              onChange={(e) => setForm({ ...form, organizer: e.target.value })}
              className="border rounded-lg px-4 py-2"
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Expected Donors"
              value={form.donorsExpected}
              onChange={(e) => setForm({ ...form, donorsExpected: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              placeholder="Timing (e.g. 9:00 AM - 5:00 PM)"
              value={form.timing}
              onChange={(e) => setForm({ ...form, timing: e.target.value })}
              className="border rounded-lg px-4 py-2 md:col-span-2"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border rounded-lg px-4 py-2 md:col-span-2"
              rows={3}
            />
          </div>

          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
            Add Event
          </button>
        </form>

        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-600">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-600">No events added yet.</p>
          ) : (
            events.map((e) => (
              <div
                key={e._id}
                className="bg-white p-6 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-semibold">{e.title}</h2>
                  <p className="text-gray-600">
                    {e.location}, {e.city} - {formatDate(e.date)}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/admin/events/${e._id}`}
                    className="border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-50 transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => deleteEvent(e._id)}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default ManageEvents;
