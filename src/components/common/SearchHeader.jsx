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

  // Format date helper
  const formatDate = (date) => date.toISOString().split("T")[0];

  // Clear opposite filter when switching search type
  useEffect(() => {
    if (searchBy === "user") {
      setSelectedTeam("");
    } else {
      setSelectedUser("");
    }
  }, [searchBy]);

  // Auto date range based on filter type
  useEffect(() => {
    const today = new Date();
    let start, end;

    switch (filterType) {
      case "today":
        start = end = formatDate(today);
        break;
      case "yesterday": {
        const y = new Date(today);
        y.setDate(today.getDate() - 1);
        start = end = formatDate(y);
        break;
      }
      case "week": {
        const currentDay = today.getDay();
        const lastSunday = new Date(today);
        lastSunday.setDate(today.getDate() - currentDay);
        const lastMonday = new Date(lastSunday);
        lastMonday.setDate(lastSunday.getDate() - 6);
        start = formatDate(lastMonday);
        end = formatDate(lastSunday);
        break;
      }
      case "month": {
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

  // Load users & teams
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

  // Apply Filters (only user_id or team_id)
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

      if (searchBy === "user" && selectedUser) params.append("user_id", selectedUser);
      if (searchBy === "team" && selectedTeam) params.append("team_id", selectedTeam);

      const res = await fetch(`${API_BASE_URL}/filter/activities_logs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      const activities = json.activities || [];

      onDataUpdate(activities, users, teams, json.total || 0);
    } catch (err) {
      console.error("Error applying filters:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Filter Type */}
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm"
      >
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="week">Previous Week</option>
        <option value="month">Previous Month</option>
        <option value="custom">Custom</option>
      </select>

      {/* Search By */}
      <select
        value={searchBy}
        onChange={(e) => setSearchBy(e.target.value)}
        className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm"
      >
        <option value="team">Search by Team</option>
        <option value="user">Search by User</option>
      </select>

      {/* Team Dropdown */}
      {searchBy === "team" && (
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm"
        >
          <option value="">All Teams</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      )}

      {/* User Dropdown */}
      {searchBy === "user" && (
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm"
        >
          <option value="">All Users</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      )}

      {/* Custom Dates */}
      {filterType === "custom" && (
        <>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 bg-gray-100 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 bg-gray-100 rounded-lg px-3 py-2 text-sm"
          />
        </>
      )}

      {/* Refresh */}
      <button
        onClick={applyFilters}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
      >
        {loading ? "Loading..." : "Refresh"}
      </button>
    </div>
  );
}
