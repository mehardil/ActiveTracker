import React, { useState, useEffect } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import API_BASE_URL from "../../config/apiConfig";

const AppAccess = () => {
  const [users, setUsers] = useState([]);
  const [banner, setBanner] = useState({ show: false, type: "", message: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [username, setUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newRole, setNewRole] = useState("editor");



  const showBanner = (type, message) => {
    setBanner({ show: true, type, message });
    setTimeout(() => setBanner({ show: false }), 3000);
  };

  // ✅ Fetch users from API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/user/list_user_organization/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      } else {
        showBanner("error", data.message || "Failed to load users");
      }
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      showBanner("error", "Error loading users");
    }
  };

  // Load users when page opens
  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Add new user
  const handleAddUser = async () => {
    if (!newEmail.trim() || !username.trim() || !newPassword.trim() || !newDepartment.trim()) {
      showBanner("error", "All fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      showBanner("error", "Passwords do not match!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showBanner("error", "You are not authorized. Please login again.");
      return;
    }

    const payload = {
      username,
      business_email: newEmail,
      password: newPassword,
      department: newDepartment,
      userrole: newRole,
      
    };

    setLoading(true);
    try {
      console.log(payload)
      const res = await fetch(`${API_BASE_URL}/user/create_user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
   

      const data = await res.json();
      if (!data.success) {
        showBanner("error", data.message || "Failed to register user.");
        return;
      }

      // ✅ Refresh list after successful add
      await fetchUsers();

      // Reset form
      setUsername("");
      setNewEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setNewDepartment("");
      setNewRole("editor");

      showBanner("success", "✅ User created successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("❌ Error registering user:", error);
      showBanner("error", "Failed to register user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-60 bg-white border-r shadow-sm">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Banner */}
        {banner.show && (
          <div
            className={`px-4 py-2 text-sm font-medium text-center shadow ${
              banner.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {banner.message}
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">👥 App Access</h1>
            <div className="flex gap-2">
              <button
                onClick={fetchUsers}
                className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
              >
                ➕ Add New
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-lg shadow border bg-white overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-800">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 font-semibold">Username</th>
                  <th className="p-3 font-semibold">Email</th>
                  <th className="p-3 font-semibold">User Role</th>
                  <th className="p-3 font-semibold">Department</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3 capitalize">{user.role || user.userrole}</td>
                      <td className="p-3">{user.department || user.groups}</td>
                      <td className="p-3 text-right">
                        <button className="text-gray-400 hover:text-gray-700">⋮</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-3 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>

        <Footer />
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">➕ Add New User</h2>
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="text-sm font-medium text-gray-600">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-600">Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter password"
                  className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-gray-600">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              {/* Department */}
              <div>
                <label className="text-sm font-medium text-gray-600">Department</label>
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="e.g. IT, HR, Sales"
                  className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              {/* Role */}
              <div>
                <label className="text-sm font-medium text-gray-600">User Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={loading}
                className={`px-4 py-2 rounded-md text-sm text-white ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppAccess;
