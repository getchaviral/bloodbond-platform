import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import bloodImg from "../assets/b14.png";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [count, setCount] = useState({ d: 0, s: 0, n: 0 });

useEffect(() => {
  let d = 0,
    s = 0,
    n = 10; // start higher for emotional drop

  const interval = setInterval(() => {
    if (d < 1200) d += 20;
    if (s < 5000) s += 50;
    if (n > 1) n -= 0.1; // decrease toward 1%

    if (n < 1) n = 1;

    setCount({
      d,
      s,
      n: Number(n.toFixed(1)),
    });

    if (d >= 1200 && s >= 5000 && n <= 1) {
      clearInterval(interval);
    }
  }, 30);

  return () => clearInterval(interval);
}, []);

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-[#fff5f5] via-[#fffafa] to-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-10 py-24 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div>
            <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
              Be the reason <br />
              <span className="text-red-700">someone lives.</span>
            </h1>

            <p className="text-lg text-gray-700 mt-6 max-w-xl">
              Every drop of blood is a gift of life. Join BloodBond to connect
              donors, blood banks, and patients when it matters most.
            </p>

            <div className="mt-10 flex gap-4 flex-wrap">
              <Link to="/login">
                <button className="bg-red-700 text-white px-7 py-3 rounded-full hover:bg-red-800 transition shadow-lg">
                  Donate / Request Blood
                </button>
              </Link>

              <Link to="/findblood">
                <button className="border border-red-700 text-red-700 px-7 py-3 rounded-full hover:bg-red-100 transition">
                  Find Blood
                </button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src={bloodImg}
              alt="Blood Donation"
              className="w-72 drop-shadow-2xl animate-pulse"
            />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-[#f1f5f9] py-20">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              value={count.d}
              label="People die daily due to blood shortage"
            />
            <StatCard value={count.s} label="Lives saved through donations" />
            <StatCard value={count.n} label=" percent of our population does blood donation." ispercent />
            
          </div>
        </div>
      </section>

      {/* WHY BLOODBOND */}
      <section className="bg-gradient-to-br from-[#fff1f2] via-[#fef2f2] to-[#f8fafc] py-24">
        <div className="max-w-6xl mx-auto px-10 text-center">
          <h2 className="text-4xl font-extrabold mb-6 text-gray-900">
            Why BloodBond?
          </h2>

          <p className="text-gray-700 mb-16 max-w-3xl mx-auto">
            A unified platform connecting donors, blood banks, and patients with
            transparency, speed, and trust.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              title="Fast Requests"
              text="Instant blood requests routed to nearby blood banks."
            />
            <FeatureCard
              title="Verified Blood Banks"
              text="Only trusted and admin-approved blood banks."
            />
            <FeatureCard
              title="Admin Monitoring"
              text="Live dashboards tracking availability and fulfillment."
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function StatCard({ value, label, isPercent }) {
  return (
    <div className="bg-gradient-to-br from-[#fffafa] to-[#fff1f2] rounded-2xl shadow-lg p-10 text-center hover:-translate-y-2 transition">
      <h2 className="text-4xl font-extrabold text-red-700">
        {value}
        {isPercent ? "%" : "+"}
      </h2>
      <p className="mt-4 text-gray-700">{label}</p>
    </div>
  );
}

function FeatureCard({ title, text }) {
  return (
    <div className="bg-gradient-to-br from-[#ffffff] to-[#f8fafc] p-8 rounded-2xl shadow-md hover:shadow-xl transition">
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-700">{text}</p>
    </div>
  );
}

export default Home;
