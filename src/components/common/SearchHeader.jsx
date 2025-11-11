import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config/apiConfig";

export default function SearchHeader({
  filterType,
  setFilterType,
  selectedUser,
  setSelectedUser,
  selectedTeam,
  setSelectedTeam,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onDataUpdate,
  currentPage,
  rowsPerPage,
}) {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchBy, setSearchBy] = useState("team");
  const token = localStorage.getItem("token");

  // ✅ Format date helper
  const formatDate = (date) => date.toISOString().split("T")[0];

  // ✅ Auto date range based on filter type
  useEffect(() => {
    const today = new Date();
    let start, end;

    switch (filterType) {
      case "today": {
        start = end = formatDate(today);
        break;
      }
      case "yesterday": {
        const y = new Date(today);
        y.setDate(today.getDate() - 1);
        start = end = formatDate(y);
        break;
      }
      case "week": {
        // ✅ Previous Week (Monday → Sunday)
        const currentDay = today.getDay(); // 0=Sun
        const lastSunday = new Date(today);
        lastSunday.setDate(today.getDate() - currentDay);
        const lastMonday = new Date(lastSunday);
        lastMonday.setDate(lastSunday.getDate() - 6);
        start = formatDate(lastMonday);
        end = formatDate(lastSunday);
        break;
      }
      case "month": {
        // ✅ Previous Month (1st → last day)
        const firstDayPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        start = formatDate(firstDayPrevMonth);
        end = formatDate(lastDayPrevMonth);
        break;
      }
      case "custom":
        return;
      default:
        start = end = "";
    }

    setStartDate(start);
    setEndDate(end);
  }, [filterType]);

  // ✅ Load users & teams
  useEffect(() => {
    if (!token) return;
    const fetchLists = async () => {
      try {
        const [userRes, teamRes] = await Promise.all([
          fetch(`${API_BASE_URL}/user/list_agent_organization`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/team/list_teams`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const [userJson, teamJson] = await Promise.all([userRes.json(), teamRes.json()]);
        setUsers(userJson.users || []);
        setTeams(teamJson.teams || []);
      } catch (err) {
        console.error("Error loading users/teams:", err);
      }
    };
    fetchLists();
  }, [token]);

  // ✅ Apply Filters (with limit + offset)
  const applyFilters = async () => {
    try {
      setLoading(true);

      const offset = (currentPage - 1) * rowsPerPage;
      const limit = rowsPerPage;

      const params = new URLSearchParams({
        filter_type: filterType,
        start_date: startDate,
        end_date: endDate,
        limit,
        offset,
      });

      if (searchBy === "user" && selectedUser) params.append("user_name", selectedUser);
      if (searchBy === "team" && selectedTeam) params.append("team_name", selectedTeam);

      const res = await fetch(`${API_BASE_URL}/filter/activities_logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      const activities = Array.isArray(json.activities) ? json.activities : json;
      onDataUpdate(activities, users, teams, json.total_count || 0);
    } catch (err) {
      console.error("Error applying filters:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* 🔹 Filter Type */}
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="week">Previous Week</option>
        <option value="month">Previous Month</option>
        <option value="custom">Custom</option>
      </select>

      {/* 🔹 Search By */}
      <select
        value={searchBy}
        onChange={(e) => setSearchBy(e.target.value)}
        className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="team">Search by Team</option>
        <option value="user">Search by User</option>
      </select>

      {/* 🔹 Conditional User/Team Dropdown */}
      {searchBy === "team" ? (
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Teams</option>
          {teams.map((t, i) => (
            <option key={i} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      ) : (
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Users</option>
          {users.map((u, i) => (
            <option key={i} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>
      )}

      {/* 🔹 Custom Dates */}
      {filterType === "custom" && (
        <>
          <label className="text-sm font-medium text-gray-600 ml-2">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 bg-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
          />
          <label className="text-sm font-medium text-gray-600 ml-2">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 bg-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
          />
        </>
      )}

      {/* 🔹 Refresh */}
      <button
        onClick={applyFilters}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md font-medium"
      >
        {loading ? "Loading..." : "Refresh"}
      </button>
    </div>
  );
}
