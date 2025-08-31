import React, { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const accessMatrix = [
  {
    section: "Homepages",
    permissions: { admin: "access", configurator: "access", powerUser: "access", viewer: "access" },
  },
  {
    section: "Team Pulse",
    permissions: { admin: "access", configurator: "none", powerUser: "access", viewer: "access" },
  },
  {
    section: "Coach",
    permissions: { admin: "access", configurator: "access", powerUser: "access", viewer: "access" },
  },
  {
    section: "Insights",
    permissions: { admin: "access", configurator: "access", powerUser: "none", viewer: "none" },
  },
  {
    section: "Impact",
    permissions: { admin: "access", configurator: "access", powerUser: "none", viewer: "none" },
  },
  {
    section: "Live Reports",
    permissions: { admin: "access", configurator: "access", powerUser: "access", viewer: "none" },
  },
  {
    section: "Integrations",
    permissions: { admin: "access", configurator: "access", powerUser: "none", viewer: "none" },
  },
  {
    section: "Settings",
    permissions: { admin: "always", configurator: "access", powerUser: "none", viewer: "none" },
  },
];

const getColorClass = (type) => {
  switch (type) {
    case "always":
      return "bg-gray-500";
    case "access":
      return "bg-teal-400";
    case "none":
      return "bg-white border border-gray-300";
    case "disabled":
      return "bg-gray-200 cursor-not-allowed";
    default:
      return "";
  }
};

const RoleAccess = () => {
  const [permissions, setPermissions] = useState(accessMatrix);
  const [showSuccess, setShowSuccess] = useState(true);

  const togglePermission = (sectionIndex, role) => {
    setPermissions((prev) =>
      prev.map((row, i) => {
        if (i !== sectionIndex) return row;

        const current = row.permissions[role];

        if (current === "always") return row; // can't change "Always Access"
        const newVal = current === "access" ? "none" : "access";

        return {
          ...row,
          permissions: {
            ...row.permissions,
            [role]: newVal,
          },
        };
      })
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-60 bg-white border-r shadow-sm">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1">
        <Header />

        {/* Toast Banner */}
        {showSuccess && (
          <div className="bg-green-500 text-white px-4 py-3 text-sm font-medium shadow-sm">
            ✅ Success! Role Access saved.
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
                  <th className="p-4 font-semibold text-center">Configurator</th>
                  <th className="p-4 font-semibold text-center">Power User</th>
                  <th className="p-4 font-semibold text-center">Viewer</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((row, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{row.section}</td>
                    {["admin", "configurator", "powerUser", "viewer"].map((role) => {
                      const type = row.permissions[role];
                      return (
                        <td key={role} className="p-4 text-center">
                          <button
                            onClick={() => togglePermission(idx, role)}
                            disabled={type === "always"}
                            className={`h-5 w-5 rounded-sm border transition-all ${
                              getColorClass(type)
                            } ${type !== "always" ? "hover:ring-2 hover:ring-blue-300" : ""}`}
                          >
                            {type === "access" || type === "always" ? "✔️" : ""}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Access Legend */}
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
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-sm bg-gray-200"></div> Access Not Available
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default RoleAccess;
