import AdminNavbar from "../../components/AdminNavbar";

const beneficiaries = [
  {
    name: "Ramesh Kumar",
    bloodGroup: "A+",
    units: 2,
    date: "10 Jan 2026",
    hospital: "City Civil Hospital",
  },
  {
    name: "Neha Sharma",
    bloodGroup: "B-",
    units: 1,
    date: "11 Jan 2026",
    hospital: "AIIMS Delhi",
  },
  {
    name: "Arjun Verma",
    bloodGroup: "O+",
    units: 3,
    date: "12 Jan 2026",
    hospital: "District Hospital Lucknow",
  },
];

function AdminBenefit() {
  return (
    <>
      <AdminNavbar />

      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Beneficiaries
            </h1>
            <p className="text-gray-600 mt-1">
              People who successfully received blood through the system
            </p>
          </div>

          {/* SUMMARY CARD */}
          <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-600">
                Total Beneficiaries
              </h2>
              <p className="text-4xl font-bold text-red-600 mt-2">
                {beneficiaries.length}
              </p>
            </div>

            <div className="text-5xl">
              🩸
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow p-6">
            {beneficiaries.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                No beneficiaries recorded yet.
              </p>
            ) : (
              <table className="w-full text-left">
                <thead className="border-b text-gray-600">
                  <tr>
                    <th className="py-3">Name</th>
                    <th className="py-3">Blood Group</th>
                    <th className="py-3">Units</th>
                    <th className="py-3">Hospital / Blood Bank</th>
                    <th className="py-3">Date</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {beneficiaries.map((b, i) => (
                    <tr
                      key={i}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-4 font-medium">{b.name}</td>
                      <td className="py-4">{b.bloodGroup}</td>
                      <td className="py-4">{b.units}</td>
                      <td className="py-4">{b.hospital}</td>
                      <td className="py-4">{b.date}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                          Fulfilled
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default AdminBenefit;
