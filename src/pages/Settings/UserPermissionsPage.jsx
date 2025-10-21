// // src/pages/access/UserPermissionsPage.jsx
// import React, { useState, useEffect } from "react";
// import Sidebar from "../../components/common/Sidebar";
// import Header from "../../components/common/Header";
// import Footer from "../../components/common/Footer";

// const API_BASE_URL = "http://127.0.0.1:9900";

// // --- API Helper ---
// class UserPermissionsAPI {
//   constructor(token, organizationId) {
//     this.token = token;
//     this.organizationId = organizationId;
//     this.headers = {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     };
//   }

//   async getUsers() {
//     const res = await fetch(
//       `${API_BASE_URL}/access/user-permissions/${this.organizationId}/users`,
//       { headers: this.headers }
//     );
//     if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//     return res.json();
//   }

//   async getUserPermissions(userId) {
//     const res = await fetch(
//       `${API_BASE_URL}/access/user-permissions/${this.organizationId}/${userId}`,
//       { headers: this.headers }
//     );
//     if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//     return res.json();
//   }

//   async updateUserPermission(userId, permissionId, hasAccess) {
//     const res = await fetch(
//       `${API_BASE_URL}/access/user-permissions/${this.organizationId}/permission`,
//       {
//         method: "PATCH",
//         headers: this.headers,
//         body: JSON.stringify({
//           user_id: userId,
//           permission_id: permissionId,
//           has_access: hasAccess,
//         }),
//       }
//     );
//     if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//     return res.json();
//   }
// }

// const UserPermissionsPage = () => {
//   const [api, setApi] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [permissions, setPermissions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");
//   const [error, setError] = useState("");

//   // Initialize API helper on mount
//   useEffect(() => {
//     const token = localStorage.getItem("authToken") || localStorage.getItem("token");
//     const organizationId = localStorage.getItem("organizationId") || "50";
//     if (token && organizationId) {
//       setApi(new UserPermissionsAPI(token, organizationId));
//     } else {
//       setError("Missing authentication token or organization ID");
//     }
//   }, []);

//   // Load all users once API is ready
//   useEffect(() => {
//     if (api) loadUsers();
//   }, [api]);

//   const loadUsers = async () => {
//     try {
//       const res = await api.getUsers();
//       if (res.success) {
//         setUsers(res.data);
//       } else {
//         setError(res.message || "Failed to load users");
//       }
//     } catch (err) {
//       setError("Failed to load users");
//     }
//   };

//   const loadUserPermissions = async (userId) => {
//     if (!userId) return;
//     try {
//       setLoading(true);
//       const res = await api.getUserPermissions(userId);
//       if (res.success) {
//         setPermissions(res.data);
//         setSelectedUser(userId);
//       } else {
//         setError(res.message || "Failed to load user permissions");
//       }
//     } catch (err) {
//       setError("Failed to load user permissions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const togglePermission = async (permissionId, currentAccess) => {
//     try {
//       const hasAccess = !currentAccess;
//       // Optimistic UI update
//       setPermissions((prev) =>
//         prev.map((p) =>
//           p.id === permissionId ? { ...p, has_access: hasAccess } : p
//         )
//       );
//       const result = await api.updateUserPermission(
//         selectedUser,
//         permissionId,
//         hasAccess
//       );
//       if (result.success) {
//         setSuccessMsg("✅ Permission updated");
//         setTimeout(() => setSuccessMsg(""), 3000);
//       } else {
//         throw new Error(result.message || "Update failed");
//       }
//     } catch (err) {
//       setError("Failed to update permission");
//       // revert UI
//       setPermissions((prev) =>
//         prev.map((p) =>
//           p.id === permissionId ? { ...p, has_access: currentAccess } : p
//         )
//       );
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <div className="w-60 bg-white border-r shadow-sm">
//         <Sidebar />
//       </div>

//       <div className="flex flex-col flex-1">
//         <Header />

//         {successMsg && (
//           <div className="bg-green-500 text-white px-4 py-2">{successMsg}</div>
//         )}
//         {error && (
//           <div className="bg-red-500 text-white px-4 py-2">❌ {error}</div>
//         )}

//         <main className="flex-1 p-6">
//           <h1 className="text-3xl font-semibold mb-6">👤 User Permissions</h1>

//           {/* User Selector */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700">
//               Select User
//             </label>
//             <select
//               onChange={(e) => loadUserPermissions(e.target.value)}
//               className="mt-2 p-2 border rounded w-72"
//               value={selectedUser}
//             >
//               <option value="">-- Choose User --</option>
//               {users.map((u) => (
//                 <option key={u.id} value={u.id}>
//                   {u.name} ({u.role})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Permissions Table */}
//           {loading && <p>Loading permissions...</p>}
//           {!loading && selectedUser && permissions.length > 0 && (
//             <div className="overflow-auto rounded-lg border bg-white shadow">
//               <table className="min-w-full text-sm text-left">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="p-4 font-semibold">Permission</th>
//                     <th className="p-4 font-semibold">Module</th>
//                     <th className="p-4 font-semibold text-center">Access</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {permissions.map((p) => (
//                     <tr key={p.id} className="border-t hover:bg-gray-50">
//                       <td className="p-4">{p.code}</td>
//                       <td className="p-4 text-gray-600">{p.module}</td>
//                       <td className="p-4 text-center">
//                         <button
//                           onClick={() => togglePermission(p.id, p.has_access)}
//                           className={`h-6 w-6 rounded-sm border transition-all ${
//                             p.has_access
//                               ? "bg-teal-400 border-teal-400"
//                               : "bg-white border-gray-300"
//                           } hover:ring-2 hover:ring-blue-300`}
//                         >
//                           {p.has_access ? "✔️" : ""}
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {!loading && selectedUser && permissions.length === 0 && (
//             <p className="text-gray-600">No permissions for this user.</p>
//           )}
//         </main>

//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default UserPermissionsPage;
