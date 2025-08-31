import React, { useState, useEffect } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [banner, setBanner] = useState({ show: false, type: "", message: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [editTeamId, setEditTeamId] = useState(null);

  // Assign users state
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  // View users state
  const [teamUsers, setTeamUsers] = useState([]);

  const showBanner = (type, message) => {
    setBanner({ show: true, type, message });
    setTimeout(() => setBanner({ show: false }), 3000);
  };

  // ✅ Fetch teams
  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:9900/team/list_teams", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setTeams(data.teams || []);
      } else {
        showBanner("error", data.message || "Failed to load teams");
      }
    } catch (err) {
      console.error("❌ Error fetching teams:", err);
      showBanner("error", "Error loading teams");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // ✅ Add new team
  const handleAddTeam = async () => {
    if (!teamName.trim() || !teamDescription.trim()) {
      showBanner("error", "All fields are required!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showBanner("error", "You are not authorized. Please login again.");
      return;
    }

    const payload = {
      team_name: teamName,
      description: teamDescription,
    };

    setLoading(true);
    try {
      const url = editTeamId
        ? "http://127.0.0.1:9900/team/update_team"
        : "http://127.0.0.1:9900/team/create_team";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editTeamId ? { ...payload, id: editTeamId } : payload),
      });

      const data = await res.json();
      if (!data.success) {
        showBanner("error", data.message || "Failed to save team.");
        return;
      }

      await fetchTeams();

      setTeamName("");
      setTeamDescription("");
      setEditTeamId(null);

      showBanner("success", editTeamId ? "✅ Team updated!" : "✅ Team created!");
      setIsModalOpen(false);
      setUpdateModalOpen(false);
    } catch (error) {
      console.error("❌ Error saving team:", error);
      showBanner("error", "Failed to save team.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove Team
  const handleRemoveTeam = async (teamId) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:9900/team/delete_team", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: teamId }),
      });

      const data = await res.json();
      if (data.success) {
        showBanner("success", "✅ Team deleted successfully!");
        fetchTeams();
      } else {
        showBanner("error", data.message || "Failed to delete team.");
      }
    } catch (err) {
      console.error(err);
      showBanner("error", "Error deleting team.");
    }
  };

  // ✅ Open Assign Modal & fetch users
  const handleOpenAssignModal = async (teamId) => {
    setSelectedTeamId(teamId);
    setAssignModalOpen(true);

    try {
      const token = localStorage.getItem("token");
      // fetch all users
      const res = await fetch("http://127.0.0.1:9900/user/list_agent_organization", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // fetch already assigned
      const membersRes = await fetch(
        `http://127.0.0.1:9900/team/team_members/${teamId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const membersData = await membersRes.json();

      if (data.success) {
        setUsers(data.users || []);
        setAssignedUsers(membersData.success ? membersData.members.map((m) => m.email) : []);
        setSelectedUsers(membersData.success ? membersData.members.map((m) => m.email) : []);
      } else {
        showBanner("error", "Failed to load users.");
      }
    } catch (err) {
      console.error(err);
      showBanner("error", "Error loading users.");
    }
  };

  // ✅ Assign users to team
  const handleAssignUsers = async () => {
    if (!selectedUsers.length) {
      showBanner("error", "Select at least one user!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        team_id: selectedTeamId,
        user_emails: selectedUsers,
      };

      const res = await fetch("http://127.0.0.1:9900/team/assign_teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showBanner("success", "✅ Users assigned successfully!");
        setAssignModalOpen(false);
        setSelectedUsers([]);
        fetchTeams();
      } else {
        showBanner("error", data.message || "Failed to assign users.");
      }
    } catch (err) {
      console.error(err);
      showBanner("error", "Error assigning users.");
    }
  };

  // ✅ View users in a team
  const handleViewUsers = async (teamId) => {
    setSelectedTeamId(teamId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:9900/team/team_members/${teamId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTeamUsers(data.members || []);
        setViewModalOpen(true);
      } else {
        showBanner("error", "Failed to load team members.");
      }
    } catch (err) {
      console.error("❌ Error fetching team members:", err);
      showBanner("error", "Error loading team members.");
    }
  };

  // ✅ Remove user from team
  const handleRemoveUser = async (email) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:9900/team/remove_user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          team_id: selectedTeamId,
          user_emails: [email],
        }),
      });

      const data = await res.json();
      if (data.success) {
        showBanner("success", "✅ User removed successfully!");
        setTeamUsers((prev) => prev.filter((u) => u.email !== email));
      } else {
        showBanner("error", data.message || "Failed to remove user.");
      }
    } catch (err) {
      console.error("❌ Error removing user:", err);
      showBanner("error", "Error removing user.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1">
        <Header />

        {/* Banner */}
        {banner.show && (
          <div
            className={`px-4 py-3 text-sm font-medium text-center shadow-md rounded-md mx-6 mt-4 ${
              banner.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {banner.message}
          </div>
        )}

        {/* Main */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">👥 Teams</h1>
            <div className="flex gap-3">
              <button
                onClick={fetchTeams}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm transition font-medium shadow-sm"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-medium shadow-sm"
              >
                ➕ New Team
              </button>
            </div>
          </div>

          {/* Teams Table */}
          <div className="rounded-xl shadow-lg border bg-white overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-800">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wide">
                <tr>
                  <th className="p-3">Team Name</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <tr key={team.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-semibold">{team.name}</td>
                      <td className="p-3 text-gray-600">{team.description}</td>
                      <td className="p-3 text-right space-x-3">
                        <button
                          onClick={() => handleOpenAssignModal(team.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Assign Users
                        </button>
                        <button
                          onClick={() => handleViewUsers(team.id)}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          View Users
                        </button>
                        <button
                          onClick={() => {
                            setEditTeamId(team.id);
                            setTeamName(team.name);
                            setTeamDescription(team.description);
                            setUpdateModalOpen(true);
                          }}
                          className="text-yellow-600 hover:text-yellow-800 font-medium"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleRemoveTeam(team.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-6 text-center text-gray-500 italic">
                      No teams found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>

        <Footer />
      </div>

      {/* ➕ Add / Update Team Modal */}
      {(isModalOpen || updateModalOpen) && (
        <Modal
          onClose={() => {
            setIsModalOpen(false);
            setUpdateModalOpen(false);
            setEditTeamId(null);
            setTeamName("");
            setTeamDescription("");
          }}
          title={editTeamId ? "✏️ Update Team" : "➕ Create New Team"}
        >
          <div className="space-y-4">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team Name"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <textarea
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              placeholder="Description"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setUpdateModalOpen(false);
                setEditTeamId(null);
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleAddTeam}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm text-white font-medium ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </Modal>
      )}

      {/* 👤 Assign Users Modal */}
      {assignModalOpen && (
        <Modal onClose={() => setAssignModalOpen(false)} title="👤 Assign Users">
          <div className="max-h-60 overflow-y-auto border p-2 rounded-md">
            {users.map((user) => {
              const isAssigned = assignedUsers.includes(user.email);
              return (
                <label
                  key={user.email}
                  className="flex items-center justify-between py-2 hover:bg-gray-50 px-2 rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.email)}
                      onChange={() =>
                        setSelectedUsers((prev) =>
                          prev.includes(user.email)
                            ? prev.filter((u) => u !== user.email)
                            : [...prev, user.email]
                        )
                      }
                    />
                    <span className="text-gray-700">
                      {user.name}{" "}
                      <span className="text-gray-500">({user.email})</span>
                    </span>
                  </div>
                  {isAssigned && (
                    <span className="text-green-600 text-xs font-medium">✅ Assigned</span>
                  )}
                </label>
              );
            })}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setAssignModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignUsers}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {/* 👥 View Users Modal */}
      {viewModalOpen && (
        <Modal onClose={() => setViewModalOpen(false)} title="👥 Team Members">
          <div className="divide-y divide-gray-200">
            {teamUsers.length > 0 ? (
              teamUsers.map((user) => (
                <div
                  key={user.email}
                  className="flex justify-between items-center p-3 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveUser(user.email)}
                    className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No members in this team.</p>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setViewModalOpen(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};


// 🔹 Reusable Modal Component
const Modal = ({ onClose, title, children }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
    <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
      {children}
      <div className="mt-2 flex justify-end">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
);

export default TeamsPage;
