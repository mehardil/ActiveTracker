import React, { useState, useEffect } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const API_BASE_URL = "http://127.0.0.1:9900"; // backend URL

const RoleAccess = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // banners
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ───────── Load permissions ─────────
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const res = await fetch(`${API_BASE_URL}/access/role-matrix/org`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || `HTTP error! status: ${res.status}`);
        }

        setPermissions(data.data);
      } catch (err) {
        console.error(err);
        setLoadError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // ───────── Toggle Access ─────────
  const togglePermission = async (sectionIndex, role) => {
    const currentRow = permissions[sectionIndex];
    const current = currentRow.permissions[role];

    if (current === "always") return; // Admin fixed

    const newVal = current === "access" ? "none" : "access";
    const hasAccess = newVal === "access";

    // optimistic update
    setPermissions((prev) =>
      prev.map((row, i) =>
        i === sectionIndex
          ? { ...row, permissions: { ...row.permissions, [role]: newVal } }
          : row
      )
    );

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/access/role-matrix/permission`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          module: currentRow.section,
          role,
          has_access: hasAccess,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      // ✅ success
      setSuccessMessage("✅ Role access updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Update failed:", err);
      setErrorMessage(err.message || "Failed to update permission");
      setTimeout(() => setErrorMessage(""), 3000);

      // revert UI
      setPermissions((prev) =>
        prev.map((row, i) =>
          i === sectionIndex
            ? {
                ...row,
                permissions: {
                  ...row.permissions,
                  [role]: current, // revert back to previous state
                },
              }
            : row
        )
      );
    }
  };

  // ───────── Render states ─────────
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-60 bg-white border-r shadow-sm">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading role access permissions...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-60 bg-white border-r shadow-sm">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-4">❌ Error</div>
              <p className="text-gray-600 mb-4">{loadError}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ───────── Main UI ─────────
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-60 bg-white border-r shadow-sm">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1">
        <Header />

        {/* Notification banners */}
        {successMessage && (
          <div className="bg-green-500 text-white px-6 py-4 text-center text-sm font-medium shadow-sm">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-500 text-white px-6 py-4 text-center text-sm font-medium shadow-sm">
            ❌ {errorMessage}
          </div>
        )}

        <main className="flex-1 p-6 overflow-x-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">🛡️ Role Access</h1>

          <div className="overflow-auto rounded-lg border bg-white shadow">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4 font-semibold">Module</th>
                  <th className="p-4 font-semibold text-center">Admin</th>
                  <th className="p-4 font-semibold text-center">Editor</th>
                  <th className="p-4 font-semibold text-center">Viewer</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((row, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{row.section}</td>

                    {["admin", "editor", "viewer"].map((role) => {
                      const type = row.permissions[role]; // "always" | "access" | "none"
                      const hasAccess = type === "access";
                      return (
                        <td key={role} className="p-4 text-center">
                          <button
                            onClick={() => togglePermission(idx, role)}
                            disabled={type === "always"}
                            className={`h-5 w-5 rounded-sm border transition-all ${
                              hasAccess
                                ? "bg-teal-400 border-teal-400"
                                : "bg-white border-gray-300"
                            } hover:ring-2 hover:ring-blue-300`}
                          >
                            {hasAccess ? "✔️" : ""}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-sm bg-gray-500"></div> Always Access
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-sm bg-teal-400"></div> Access
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-sm border border-gray-400 bg-white"></div> No Access
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default RoleAccess;
