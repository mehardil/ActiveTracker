import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Sidebar from "../../components/dashboard/Sidebar";

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
  const [teamId, setTeamId] = useState(12);
  const [userCount, setUserCount] = useState(0);
  const [startDate, setStartDate] = useState("2025-02-18");
  const [endDate, setEndDate] = useState("2025-02-18");
  const [datePreset, setDatePreset] = useState("custom");
  const [startTime, setStartTime] = useState("00:00");
  
  
  const [endTime, setEndTime] = useState("12:00");


  const fetchData = () => {
    setLoading(true);
    fetch(`http://127.0.0.1:9000/team/teams/${teamId}/activities`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        console.log("this is updated json")
        console.log(json)
        const uniqueUsers = new Set(json.map((item) => item.user_id));
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
  }, [teamId]);

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

  const toggleCol = (colId) => {
    setVisibleCols((prev) =>
      prev.includes(colId) ? prev.filter((id) => id !== colId) : [...prev, colId]
    );
  };

  const exportToCSV = () => {
    const header = visibleCols.map((id) => columnsConfig.find((c) => c.id === id).label).join(",");
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
        {/* Top Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📊 Activity Log</h2>
          <div className="flex items-center gap-4">
            <button className="bg-orange-500 hover:bg-orange-600 transition text-white px-4 py-2 rounded-lg text-sm shadow">
              Upgrade - 6 days left
            </button>
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold shadow">
              M
            </div>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Preset Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm">📅 Preset:</span>
            <select
              value={datePreset}
              onChange={(e) => setDatePreset(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 shadow-sm bg-white"
            >
              <option value="custom">Custom Range</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last_week">Last Week</option>
              <option value="last_month">Last Month</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="flex items-center gap-2">
            <span className="text-sm">📅 Start:</span>
            <input
              type="date"
              disabled={datePreset !== "custom"}
              className="border border-gray-300 rounded px-3 py-1 bg-white shadow-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="flex items-center gap-2">
            <span className="text-sm">📅 End:</span>
            <input
              type="date"
              disabled={datePreset !== "custom"}
              className="border border-gray-300 rounded px-3 py-1 bg-white shadow-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Team Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm">👥</span>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 shadow-sm bg-white"
            >
              <option value="12">Team 1</option>
              <option value="15">Team 2</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchData}
            className="bg-gray-500 hover:bg-gray-600 transition text-white px-3 py-1 rounded shadow flex items-center gap-1"
          >
            🔄 Refresh
          </button>
        </div>




        <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h3 className="font-semibold text-lg mb-3 text-gray-700">📈 Single-Day Productivity</h3>
        <div className="flex flex-wrap items-center gap-4">
          {/* Start Time */}
          {/* Start Time */}
          <div className="flex items-center gap-2">
            <span className="text-sm">⏰</span>
            <input
              type="time"
              className="border rounded px-2 py-1 bg-white shadow-sm"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          {/* End Time */}
          <input
            type="time"
            className="border rounded px-2 py-1 bg-white shadow-sm"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
 
 


          {/* Export CSV Button */}
          <button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 transition text-white px-3 py-1 rounded shadow"
          >
            📤 Export CSV
          </button>
        </div>
      </div>


        {/* Column Toggle */}
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

        {/* Table */}
        <div className="bg-white p-4 rounded-xl shadow">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading activity data...</div>
          ) : (
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
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={visibleCols.length} className="text-center p-4 text-gray-500">
                        No activity data found.
                      </td>
                    </tr>
                  ) : (
                    data.map((item, idx) => (
                      <tr
                        key={idx}
                        className={
                          idx % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"
                        }
                      >
                        {visibleCols.map((colId) => (
                          <td key={colId} className="p-2 border">
                            {item[colId] ?? "N/A"}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
