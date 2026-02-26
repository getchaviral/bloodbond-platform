import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function UserDashboard() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to BloodBond
          </h1>
          <p className="text-gray-600 mb-12">
            Choose how you would like to contribute
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* REQUEST BLOOD */}
            <ActionCard
              title="Request Blood"
              desc="Need blood urgently? Raise a request and get help fast."
              btnText="Request Now"
              link="/user/request"
              color="red"
              emoji="🩸"
            />

            {/* DONATE BLOOD */}
            <ActionCard
              title="Donate Blood"
              desc="Become a hero. Register yourself as a blood donor."
              btnText="Donate Now"
              link="/user/donate"
              color="green"
              emoji="❤️"
            />

          </div>
        </div>
      </div>
    </>
  );
}

function ActionCard({ title, desc, btnText, link, color, emoji }) {
  const colorMap = {
    red: "bg-red-600 hover:bg-red-700",
    green: "bg-green-600 hover:bg-green-700",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 hover:-translate-y-2 transition">
      <div className="text-5xl mb-4">{emoji}</div>
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <p className="text-gray-600 mb-6">{desc}</p>

      <Link to={link}>
        <button
          className={`${colorMap[color]} text-white px-6 py-3 rounded-full font-semibold transition`}
        >
          {btnText}
        </button>
      </Link>
    </div>
  );
}

export default UserDashboard;
