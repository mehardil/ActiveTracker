import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Sidebar from "../../components/common/Sidebar";

const columnsConfig = [
  { id: "username", label: "Username" },
  { id: "category", label: "Category" },
  { id: "application", label: "Application" },
  { id: "website", label: "Website" },
  { id: "start_time", label: "Start Time" },
  { id: "end_time", label: "End Time" },
  { id: "duration", label: "Duration (sec)" },
];

// ✅ Inline FilterPanel component (fully integrated)
const FilterPanel = ({ onFilterChange, userTeams = [] }) => {
  const [filterType, setFilterType] = useState("user");
  const [userTeamFilter, setUserTeamFilter] = useState("");
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");

  useEffect(() => {
    onFilterChange({
      filter_type: filterType,
      user_team: userTeamFilter,
      start_date: startDate,
      end_date: endDate,
      start_time: startTime,
      end_time: endTime,
    });
  }, [filterType, userTeamFilter, startDate, endDate, startTime, endTime, onFilterChange]);

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h3 className="font-semibold text-lg mb-3 text-gray-700">🔍 Filters</h3>

      <div className="flex flex-wrap items-center gap-4">
        {/* Filter Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter Type</label>
          <select
            className="border rounded px-2 py-1 shadow-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="user">User</option>
            <option value="team">Team</option>
          </select>
        </div>

        {/* Team Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Team</label>
          <select
            className="border rounded px-2 py-1 shadow-sm"
            value={userTeamFilter}
            onChange={(e) => setUserTeamFilter(e.target.value)}
          >
            <option value="">All Teams</option>
            {Array.isArray(userTeams) &&
              userTeams.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            className="border rounded px-2 py-1 shadow-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            className="border rounded px-2 py-1 shadow-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Team List Preview */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-700 mb-2">🧑‍💻 Available Teams</h4>
        {Array.isArray(userTeams) && userTeams.length > 0 ? (
          <ul className="space-y-2">
            {userTeams.map((team) => (
              <li
                key={team.id}
                className="p-2 bg-gray-50 rounded-lg border hover:bg-gray-100 transition"
              >
                <p className="font-medium text-gray-800">{team.name}</p>
                <p className="text-sm text-gray-500">{team.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No teams available.</p>
        )}
      </div>
    </div>
  );
};

// === Main ActivityLog Page ===
export default function ActivityLog() {
  const [data, setData] = useState([]);
  const [visibleCols, setVisibleCols] = useState(columnsConfig.map((c) => c.id));
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);

  // Filters
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const [filterType, setFilterType] = useState("user");
  const [userTeamFilter, setUserTeamFilter] = useState("");

  const [teams, setTeams] = useState([
    { id: 19, name: "backend", description: "Handles API and DB logic" },
    { id: 29, name: "frontend react", description: "Works on UI and frontend" },
    { id: 33, name: "qa", description: "Ensures product quality" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  // === Fetch Demo Data ===
  const fetchDemoData = () => {
    setLoading(true);
    const demoActivities = [
      {
        username: "john_doe",
        category: "Development",
        application: "VS Code",
        website: "github.com",
        start_time: "09:00",
        end_time: "11:30",
        duration: 9000,
        user_id: 1,
        team_name: "backend",
      },
      {
        username: "jane_smith",
        category: "Design",
        application: "Figma",
        website: "figma.com",
        start_time: "10:00",
        end_time: "12:00",
        duration: 7200,
        user_id: 2,
        team_name: "frontend react",
      },
      {
        username: "ali_ahmed",
        category: "Testing",
        application: "Postman",
        website: "api.test.io",
        start_time: "14:00",
        end_time: "16:00",
        duration: 7200,
        user_id: 3,
        team_name: "qa",
      },
    ];

    setTimeout(() => {
      setData(demoActivities);
      setUserCount(new Set(demoActivities.map((d) => d.user_id)).size);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchDemoData();
  }, []);

  // Handle filter change from FilterPanel
  const handleFilterChange = (filter) => {
    setFilterType(filter.filter_type);
    setUserTeamFilter(filter.user_team);
    setStartDate(filter.start_date);
    setEndDate(filter.end_date);
    setStartTime(filter.start_time);
    setEndTime(filter.end_time);
  };

  // === Apply Filters ===
  const filteredData = data.filter((item) => {
    const isWithinTime =
      (!startTime || item.start_time >= startTime) &&
      (!endTime || item.end_time <= endTime);

    if (filterType === "user") {
      return (userTeamFilter ? item.user_id === Number(userTeamFilter) : true) && isWithinTime;
    } else if (filterType === "team") {
      return (userTeamFilter ? item.team_name === userTeamFilter : true) && isWithinTime;
    }

    return isWithinTime;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const exportToCSV = () => {
    const header = visibleCols
      .map((id) => columnsConfig.find((c) => c.id === id).label)
      .join(",");
    const rows = data.map((row) =>
      visibleCols.map((col) => `"${row[col] ?? ""}"`).join(",")
    );
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "activity_log.csv";
    link.click();
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="w-60 border-r bg-white shadow-sm">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📊 Activity Log{" "}
            <span className="text-base text-gray-500 ml-2">
              ({userCount} users)
            </span>
          </h2>
        </div>

        {/* ✅ Inline FilterPanel */}
        <FilterPanel onFilterChange={handleFilterChange} userTeams={teams} />

        {/* Time Range + Export */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">
            📈 Single-Day Productivity
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="time"
              className="border rounded px-2 py-1 bg-white shadow-sm"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <input
              type="time"
              className="border rounded px-2 py-1 bg-white shadow-sm"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            <button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 transition text-white px-3 py-1 rounded shadow"
            >
              📤 Export CSV
            </button>
          </div>
        </div>

        {/* Column Selector */}
        <div className="flex flex-wrap gap-3 mb-4 bg-white p-4 rounded-lg shadow text-sm text-gray-700">
          {columnsConfig.map((col) => (
            <label key={col.id} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={visibleCols.includes(col.id)}
                onChange={() =>
                  setVisibleCols((prev) =>
                    prev.includes(col.id)
                      ? prev.filter((id) => id !== col.id)
                      : [...prev, col.id]
                  )
                }
              />
              {col.label}
            </label>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white p-4 rounded-xl shadow">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading demo data...
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-3 text-sm">
                <div className="text-gray-500">
                  Showing {paginatedData.length} of {filteredData.length} rows
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      {visibleCols.map((colId) => (
                        <th key={colId} className="p-3 border">
                          {columnsConfig.find((c) => c.id === colId).label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item, idx) => (
                      <tr
                        key={idx}
                        className={
                          idx % 2 === 0
                            ? "bg-white hover:bg-gray-50"
                            : "bg-gray-50 hover:bg-gray-100"
                        }
                      >
                        {visibleCols.map((colId) => (
                          <td key={colId} className="p-2 border">
                            {item[colId] ?? "N/A"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
