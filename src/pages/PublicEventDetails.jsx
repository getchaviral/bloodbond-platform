import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

function PublicEventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        setError("Event not found");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p className="p-8">Loading event...</p>;
  if (!event) return <p className="p-8">{error || "Event not found"}</p>;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
          <Link to="/events" className="text-red-600 hover:underline">
            Back to Events
          </Link>

          <h1 className="text-4xl font-bold mt-4 mb-2">{event.title}</h1>

          <p className="text-gray-600 mb-6">
            {event.location}, {event.city} - {formatDate(event.date)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <InfoCard label="Organizer" value={event.organizer} />
            <InfoCard label="Timing" value={event.timing || "N/A"} />
            <InfoCard
              label="Expected Donors"
              value={event.donorsExpected ?? 0}
            />
          </div>

          <h2 className="text-xl font-semibold mb-2">About This Event</h2>
          <p className="text-gray-700 mb-8">
            {event.description || "No description available."}
          </p>

          <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition">
            I Want to Participate
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-red-50 rounded-xl p-6 text-center">
      <p className="text-gray-600">{label}</p>
      <p className="text-lg font-bold text-red-600 mt-2">{value}</p>
    </div>
  );
}

export default PublicEventDetails;
