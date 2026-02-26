import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import api from "../../services/api";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function EventDetails() {
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
      <AdminNavbar />

      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>

          <p className="text-gray-600 mb-6">
            {event.location}, {event.city} - {formatDate(event.date)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <HighlightCard label="Organizer" value={event.organizer} />
            <HighlightCard
              label="Expected Donors"
              value={event.donorsExpected ?? 0}
            />
            <HighlightCard label="Timing" value={event.timing || "N/A"} />
            <HighlightCard
              label="Created On"
              value={formatDate(event.createdAt)}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Event Summary</h2>
            <p className="text-gray-700">
              {event.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function HighlightCard({ label, value }) {
  return (
    <div className="bg-red-50 rounded-xl p-6 text-center">
      <p className="text-gray-600">{label}</p>
      <p className="text-xl font-bold text-red-600 mt-2">{value}</p>
    </div>
  );
}

export default EventDetails;
