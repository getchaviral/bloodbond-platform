import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";

import api from "../../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats")
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  }, []);

  if (!stats) return <p className="p-8">Loading stats...</p>;

 return (
  <>
    <AdminNavbar />   {/* 👈 THIS WAS MISSING */}

    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Total Requests" value={stats.totalRequests} />
        <StatCard title="Pending Requests" value={stats.pendingRequests} />
        <StatCard title="Blood Units Available" value={stats.totalUnits} />
      </div>
    </div>
  </>
);

}

function StatCard({ title, value }) {
  return (
    <div className="bg-white shadow-md rounded p-6 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-3xl font-bold text-red-600 mt-2">{value}</p>
    </div>
  );
}

export default AdminDashboard;
