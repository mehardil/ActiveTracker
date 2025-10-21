import React, { useState, useEffect } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

// 🔹 Centralized fetch helper
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);

    // Handle non-2xx responses
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || "Unexpected server error");
    }

    const data = await res.json();

    // Handle backend custom success flag
    if (data.success === false) {
      throw new Error(data.message || "Operation failed");
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Network error");
  }
};

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [modal, setModal] = useState(null); // "create" | "update" | "assign" | "view" | null
  const [editTeam, setEditTeam] = useState(null);

  // Form states
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");

  // Users state
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [teamUsers, setTeamUsers] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const showBanner = (type, message) => {
    setBanner({ type, message });
    setTimeout(() => setBanner(null), 3000);
  };

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await fetchWithErrorHandling(
        "http://127.0.0.1:9900/team/list_teams",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeams(data.teams || []);
    } catch (err) {
      showBanner("error", err.message);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);



  const handleSaveTeam = async () => {
  if (!teamName || !teamDescription)
    return showBanner("error", "All fields required");

  const token = localStorage.getItem("token");
  setLoading(true);

  try {
    const url = editTeam
      ? `http://127.0.0.1:9900/team/update_team/${editTeam.id}` // ✅ attach team id here
      : "http://127.0.0.1:9900/team/create_team";

    const body = {
      team_name: teamName,
      description: teamDescription,
    };

    await fetchWithErrorHandling(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    showBanner("success", "✅ Saved");
    await fetchTeams();
    setModal(null);
  } catch (err) {
    showBanner("error", err.message);
  } finally {
    setLoading(false);
  }
};



  const handleDeleteTeam = async (name) => {
    if (!window.confirm(`Delete team "${name}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      await fetchWithErrorHandling(
        `http://127.0.0.1:9900/team/delete_team/${encodeURIComponent(name)}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      showBanner("success", "✅ Deleted");
      fetchTeams();
    } catch (err) {
      showBanner("error", err.message);
    }
  };

  const handleAssignModal = async (team) => {
    setSelectedTeamId(team.id);
    setEditTeam(team);
    setModal("assign");
    try {
      const token = localStorage.getItem("token");
      const usersData = await fetchWithErrorHandling(
        "http://127.0.0.1:9900/user/list_agent_organization",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const membersData = await fetchWithErrorHandling(
        `http://127.0.0.1:9900/team/team_members/${team.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(usersData.users || []);
      setSelectedUsers(membersData.members.map((m) => m.email));
    } catch (err) {
      showBanner("error", err.message);
    }
  };

  const handleAssignUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetchWithErrorHandling("http://127.0.0.1:9900/team/assign_teams", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ team_id: selectedTeamId, user_emails: selectedUsers }),
      });
      showBanner("success", "✅ Users assigned");
      setModal(null);
    } catch (err) {
      showBanner("error", err.message);
    }
  };

  const handleViewUsers = async (team) => {
    setSelectedTeamId(team.id);
    try {
      const token = localStorage.getItem("token");
      const data = await fetchWithErrorHandling(
        `http://127.0.0.1:9900/team/team_members/${team.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeamUsers(data.members || []);
      setModal("view");
    } catch (err) {
      showBanner("error", err.message);
    }
  };

const handleRemoveUser = async (email) => {
  if (!window.confirm(`Remove ${email} from this team?`)) return;

  try {
    const token = localStorage.getItem("token");
    await fetchWithErrorHandling("http://127.0.0.1:9900/team/remove_user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        team_id: selectedTeamId,
        email: [email], // ✅ wrap in array
      }),
    });

    showBanner("success", "✅ User removed");
    handleViewUsers({ id: selectedTeamId });
  } catch (err) {
    showBanner("error", err.message);
  }
};


  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 bg-white border-r">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1">
        <Header />

        {banner && (
          <div
            className={`mx-6 mt-4 px-4 py-2 rounded-lg text-center text-sm font-medium ${
              banner.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {banner.message}
          </div>
        )}

        {/* --- MAIN --- */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">👥 Teams</h1>
            <div className="flex gap-2">
              <button
                onClick={fetchTeams}
                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => {
                  setModal("create");
                  setEditTeam(null);
                  setTeamName("");
                  setTeamDescription("");
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ➕ New Team
              </button>
            </div>
          </div>

          {teams.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-white rounded-xl shadow p-5 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {team.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {team.description}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleAssignModal(team)}
                      className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => handleViewUsers(team)}
                      className="px-3 py-1 text-xs bg-green-50 text-green-600 rounded-lg"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setEditTeam(team);
                        setTeamName(team.name);
                        setTeamDescription(team.description);
                        setModal("update");
                      }}
                      className="px-3 py-1 text-xs bg-yellow-50 text-yellow-600 rounded-lg"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.name)}
                      className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-10 italic">
              No teams found 🚀
            </p>
          )}
        </main>

        <Footer />
      </div>

      {/* --- MODALS --- */}
      {modal && (
        <Modal
          onClose={() => setModal(null)}
          title={
            modal === "create"
              ? "➕ Create Team"
              : modal === "update"
              ? "✏️ Update Team"
              : modal === "assign"
              ? "👤 Assign Users"
              : "👥 Team Members"
          }
        >
          {modal === "create" || modal === "update" ? (
            // --- Create / Update ---
            <div className="space-y-3">
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Team Name"
                className="w-full border rounded-lg px-3 py-2"
              />
              <textarea
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                placeholder="Description"
                className="w-full border rounded-lg px-3 py-2"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setModal(null)}
                  className="px-4 py-2 text-sm text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTeam}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : modal === "assign" ? (
            // --- Assign Users ---
            <div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {users.map((u) => (
                  <label
                    key={u.email}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(u.email)}
                      onChange={() =>
                        setSelectedUsers((prev) =>
                          prev.includes(u.email)
                            ? prev.filter((x) => x !== u.email)
                            : [...prev, u.email]
                        )
                      }
                    />
                    {u.name} <span className="text-gray-500">({u.email})</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setModal(null)}
                  className="px-4 py-2 text-sm text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignUsers}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            // --- View Users + Remove ---
            <div>
              {teamUsers.length ? (
                teamUsers.map((u) => (
                  <div
                    key={u.email}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{u.name}</p>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(u.email)}
                      className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 py-4 text-center">No members</p>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setModal(null)}
                  className="px-4 py-2 bg-gray-100 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    </div>
  </div>
);

export default TeamsPage;
