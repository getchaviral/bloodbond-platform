import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PublicEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (err) {
        setError("Unable to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">
              Upcoming Blood Donation Drives
            </h1>
            <p className="text-gray-600">
              Participate, donate blood, and save lives
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading events...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-600">No events available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.map((e) => (
                <div
                  key={e._id}
                  className="bg-white rounded-xl shadow p-6 hover:-translate-y-1 transition"
                >
                  <h2 className="text-xl font-bold mb-2">{e.title}</h2>

                  <p className="text-gray-600 mb-1">
                    {e.location}, {e.city}
                  </p>

                  <p className="text-gray-600 mb-1">{formatDate(e.date)}</p>

                  <p className="text-gray-500 text-sm mb-4">
                    Organized by {e.organizer}
                  </p>

                  <Link
                    to={`/events/${e._id}`}
                    className="block text-center border border-red-600 text-red-600 py-2 rounded-lg hover:bg-red-50 transition"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default PublicEvents;
