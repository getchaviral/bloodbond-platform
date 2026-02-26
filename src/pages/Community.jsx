import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const stories = [
  {
    name: "Rahul Sharma",
    text: "Donating blood was the most fulfilling experience of my life.",
  },
  {
    name: "Anita Verma",
    text: "BloodBond helped me find blood in an emergency within minutes.",
  },
  {
    name: "Blood Bank Delhi",
    text: "Managing requests has never been this smooth.",
  },
];

function Community() {
  return (
    <>
      <Navbar />

      <div className="bg-white px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Community Stories</h1>
          <p className="text-gray-600 mb-12">
            Real stories from donors, recipients, and blood banks
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((s, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <p className="italic text-gray-700">“{s.text}”</p>
                <h3 className="mt-4 font-semibold text-red-600">{s.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Community;
