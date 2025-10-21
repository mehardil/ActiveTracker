import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Sidebar from "../../components/common/Sidebar";
import FilterPanel from "../../components/common/FilterPanel";

const API_URL = "http://127.0.0.1:9900/filter/activities_logs";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMTksInJvbGUiOiJhZG1pbiIsIm9yZ19pZCI6NTAsImV4cCI6MTc2MDI2MDQ1M30.OWrK4AnK46zvHZqh7S_zcopXVEths0iijF2DpwghQbw";

const columnsConfig = [
  { id: "username", label: "Username" },
  { id: "category", label: "Category" },
  { id: "application", label: "Application" },
  { id: "website", label: "Website" },
  { id: "start_time", label: "Start Time" },
  { id: "end_time", label: "End Time" },
  { id: "duration", label: "Duration (sec)" },
];

export default function ActivityLog() {
  const [data, setData] = useState([]);
  const [visibleCols, setVisibleCols] = useState(columnsConfig.map((c) => c.id));
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [datePreset, setDatePreset] = useState("today");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [filterType, setFilterType] = useState("user");
  const [userTeamFilter, setUserTeamFilter] = useState("");

  // === Fetch Data ===
  const fetchData = () => {
    setLoading(true);

    const queryParams = new URLSearchParams();
    if (filterType) queryParams.append("filter_type", filterType);
    if (userTeamFilter) queryParams.append("user_team", userTeamFilter);
    if (startDate) queryParams.append("start_date", startDate);
    if (endDate) queryParams.append("end_date", endDate);
    if (startTime) queryParams.append("start_time", startTime);
    if (endTime) queryParams.append("end_time", endTime);

    fetch(`${API_URL}?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const activities = Array.isArray(json) ? json : json.activities || [];
        setData(activities);

        const uniqueUsers = new Set(activities.map((item) => item.user_id));
        setUserCount(uniqueUsers.size);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [filterType, userTeamFilter, startDate, endDate, startTime, endTime]);

  useEffect(() => {
    const today = dayjs();
    if (datePreset === "today") {
      const d = today.format("YYYY-MM-DD");
      setStartDate(d);
      setEndDate(d);
    } else if (datePreset === "yesterday") {
      const y = today.subtract(1, "day").format("YYYY-MM-DD");
      setStartDate(y);
      setEndDate(y);
    } else if (datePreset === "last_week") {
      setStartDate(today.subtract(1, "week").startOf("week").format("YYYY-MM-DD"));
      setEndDate(today.subtract(1, "week").endOf("week").format("YYYY-MM-DD"));
    } else if (datePreset === "last_month") {
      setStartDate(today.subtract(1, "month").startOf("month").format("YYYY-MM-DD"));
      setEndDate(today.subtract(1, "month").endOf("month").format("YYYY-MM-DD"));
    }
  }, [datePreset]);

  const handleFilterChange = (filter) => {
    setFilterType(filter.filter_type);
    setUserTeamFilter(filter.user_team);
    setStartDate(filter.start_date);
    setEndDate(filter.end_date);
    setStartTime(filter.start_time);
    setEndTime(filter.end_time);
  };

  const toggleCol = (colId) => {
    setVisibleCols((prev) =>
      prev.includes(colId) ? prev.filter((id) => id !== colId) : [...prev, colId]
    );
  };

  const exportToCSV = () => {
    const header = visibleCols.map((id) => columnsConfig.find((c) => c.id === id).label).join(",");
    const rows = data.map((row) => visibleCols.map((col) => `"${row[col] ?? ""}"`).join(","));
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "activity_log.csv";
    link.click();
  };

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

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="w-60 border-r bg-white shadow-sm">
        <Sidebar />
      </div>
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📊 Activity Log{" "}
            <span className="text-base text-gray-500 ml-2">({userCount} users)</span>
          </h2>
          <div className="flex items-center gap-4">
            <button className="bg-orange-500 hover:bg-orange-600 transition text-white px-4 py-2 rounded-lg text-sm shadow">
              Upgrade - 6 days left
            </button>
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold shadow">
              M
            </div>
          </div>
        </div>

        <FilterPanel onFilterChange={handleFilterChange} />

        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">📈 Single-Day Productivity</h3>
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

        <div className="flex flex-wrap gap-3 mb-4 bg-white p-4 rounded-lg shadow text-sm text-gray-700">
          {columnsConfig.map((col) => (
            <label key={col.id} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={visibleCols.includes(col.id)}
                onChange={() => toggleCol(col.id)}
              />
              {col.label}
            </label>
          ))}
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading activity data...</div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <label htmlFor="rowsPerPage">Rows per page:</label>
                  <select
                    id="rowsPerPage"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded px-2 py-1 bg-white shadow-sm"
                  >
                    {[50, 100, 200, 500].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
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
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={visibleCols.length} className="text-center p-4 text-gray-500">
                          No activity data found.
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((item, idx) => (
                        <tr
                          key={idx}
                          className={
                            idx % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"
                          }
                        >
                          {visibleCols.map((colId) => (
                            <td key={colId} className="p-2 border">
                              {item[colId] !== undefined ? item[colId] : "N/A"}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4 text-sm">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
