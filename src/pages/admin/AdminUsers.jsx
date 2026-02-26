import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import api from "../../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <AdminNavbar />

      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">All Users</h1>

        {error && (
          <div className="bg-red-100 text-red-700 rounded p-3 mb-6">{error}</div>
        )}

        <div className="bg-white rounded-xl shadow p-6">
          {loading ? (
            <p className="text-gray-500">Loading users...</p>
          ) : (
            <table className="w-full">
              <thead className="border-b text-gray-600">
                <tr>
                  <th className="py-2 text-left">Name</th>
                  <th className="py-2 text-left">Email</th>
                  <th className="py-2 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{u.name}</td>
                    <td className="py-3">{u.email}</td>
                    <td className="py-3 font-semibold capitalize">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminUsers;
