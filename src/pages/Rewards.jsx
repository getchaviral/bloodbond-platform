import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const rewards = [
  { title: "Bronze Donor", desc: "1–3 donations", color: "bg-yellow-100" },
  { title: "Silver Donor", desc: "4–7 donations", color: "bg-gray-100" },
  { title: "Gold Donor", desc: "8+ donations", color: "bg-yellow-200" },
];

function Rewards() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Rewards & Recognition</h1>
          <p className="text-gray-600 mb-12">
            Celebrate heroes who save lives through blood donation
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rewards.map((r, i) => (
              <div
                key={i}
                className={`${r.color} p-8 rounded-xl shadow hover:-translate-y-2 transition`}
              >
                <h2 className="text-2xl font-bold mb-2">{r.title}</h2>
                <p className="text-gray-700">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Rewards;
