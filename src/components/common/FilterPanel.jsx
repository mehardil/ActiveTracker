import React, { useState, useEffect } from "react";

const getDateRange = (preset) => {
  const today = new Date();
  const format = (d) => d.toISOString().split("T")[0];

  switch (preset) {
    case "today":
      return [format(today), format(today)];
    case "yesterday":
      const yest = new Date(today);
      yest.setDate(yest.getDate() - 1);
      return [format(yest), format(yest)];
    case "last_week":
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - 7);
      return [format(lastWeekStart), format(today)];
    case "last_month":
      const lastMonthStart = new Date(today);
      lastMonthStart.setMonth(today.getMonth() - 1);
      return [format(lastMonthStart), format(today)];
    default:
      return ["", ""];
  }
};

const FilterPanel = ({ onFilterChange }) => {
  const [userTeams, setUserTeams] = useState([]);
  const [filterType, setFilterType] = useState("user");
  const [selectedUserOrTeam, setSelectedUserOrTeam] = useState("");

  const [preset, setPreset] = useState("today");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");

  // Set today's date on mount
  useEffect(() => {
    const [start, end] = getDateRange("today");
    setStartDate(start);
    setEndDate(end);
  }, []);

  // Fetch user or team data
useEffect(() => {
  const fetchUserOrTeamData = async () => {
    try {
      const res = await fetch(`http://localhost:9900/user/user/?filter_type=${filterType}`);
      const data = await res.json();
      console.log("Fetched data:", data); // 👈 Log response here
      setUserTeams(data);
    } catch (error) {
      console.error("Failed to load user/teams", error);
      setUserTeams([]);
    }
  };

  fetchUserOrTeamData();
}, [filterType]);


  // Update date if preset changes
  useEffect(() => {
    if (preset !== "custom") {
      const [start, end] = getDateRange(preset);
      setStartDate(start);
      setEndDate(end);
    }
  }, [preset]);

  const handleApply = () => {
    onFilterChange({
      filter_type: filterType,
      user_team: selectedUserOrTeam,
      start_date,
      end_date,
      start_time,
      end_time,
    });
  };

const filteredOptions = () => {
  if (filterType === "user") {
    return (
      <>
        <option value="">All Users</option>
        {userTeams.map((u) => (
          <option key={u.id} value={u.id}>
            {u.username}
          </option>
        ))}
      </>
    );
  } else {
    return (
      <>
        <option value="">All Teams</option>
        {userTeams.map((team) => (
          <option key={team.id} value={team.name}>
            {team.name}
          </option>
        ))}
      </>
    );
  }
};


  return (
    <div className="p-4 bg-gray-100 rounded shadow">
      <div className="flex flex-wrap items-end gap-4">
        {/* Filter Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Filter Type</label>
          <select
            className="border rounded p-2"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setSelectedUserOrTeam("");
            }}
          >
            <option value="user">User</option>
            <option value="team">Team</option>
          </select>
        </div>

        {/* User or Team Selector */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {filterType === "user" ? "User" : "Team"}
          </label>
          <select
            className="border rounded p-2"
            value={selectedUserOrTeam}
            onChange={(e) => setSelectedUserOrTeam(e.target.value)}
          >
            {filteredOptions()}
          </select>
        </div>

        {/* Preset */}
        <div>
          <label className="block text-sm font-medium mb-1">📅 Preset</label>
          <select
            className="border rounded p-2"
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
          >
            <option value="custom">Custom</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last_week">Last Week</option>
            <option value="last_month">Last Month</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            className="border rounded p-2"
            value={start_date}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            className="border rounded p-2"
            value={end_date}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input
            type="time"
            className="border rounded p-2"
            value={start_time}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <input
            type="time"
            className="border rounded p-2"
            value={end_time}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        {/* Apply Button */}
        <div>
          <button
            onClick={handleApply}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🔍 Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
