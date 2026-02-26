import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { jsPDF } from "jspdf";
import api from "../../services/api";

function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        setError("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const generatePDF = () => {
    if (!stats) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("BloodBond - Admin System Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.line(20, 35, 190, 35);

    let y = 45;
    doc.text("System Overview", 20, y);
    y += 10;
    doc.text(`Total Users: ${stats.totalUsers}`, 20, y);
    y += 8;
    doc.text(`Total Donors: ${stats.totalDonors}`, 20, y);
    y += 8;
    doc.text(`Total Blood Requests: ${stats.totalRequests}`, 20, y);
    y += 8;
    doc.text(`Pending Requests: ${stats.pendingRequests}`, 20, y);
    y += 8;
    doc.text(`Fulfilled Requests: ${stats.fulfilledRequests}`, 20, y);
    y += 8;
    doc.text(`Total Blood Units Available: ${stats.totalUnits}`, 20, y);
    y += 12;

    doc.line(20, y, 190, y);
    y += 10;
    doc.text("Blood Group Summary", 20, y);
    y += 10;

    const groups = Object.entries(stats.stockByGroup || {});
    if (groups.length === 0) {
      doc.text("No stock data available", 20, y);
      y += 8;
    } else {
      groups.forEach(([group, units]) => {
        doc.text(`${group}: ${units} units`, 20, y);
        y += 8;
      });
    }

    y += 10;
    doc.line(20, y, 190, y);
    y += 10;
    doc.text("Beneficiaries Summary", 20, y);
    y += 10;
    doc.text(`Total Beneficiaries Served: ${stats.fulfilledRequests}`, 20, y);
    y += 20;
    doc.setFontSize(10);
    doc.text("This is a system-generated report from BloodBond Admin Dashboard.", 20, y);

    doc.save("BloodBond_Admin_Report.pdf");
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">System Reports</h1>

          <button
            onClick={generatePDF}
            disabled={!stats}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-60"
          >
            Download PDF Report
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 rounded p-3 mb-6">{error}</div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading reports...</p>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ReportCard title="Total Users" value={stats.totalUsers} />
            <ReportCard title="Total Donors" value={stats.totalDonors} />
            <ReportCard title="Blood Requests" value={stats.totalRequests} />
            <ReportCard title="Blood Units" value={stats.totalUnits} />
          </div>
        ) : null}
      </div>
    </>
  );
}

function ReportCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 text-center hover:-translate-y-1 transition">
      <h2 className="text-gray-600">{title}</h2>
      <p className="text-3xl font-bold text-red-600 mt-2">{value}</p>
    </div>
  );
}

export default Reports;
