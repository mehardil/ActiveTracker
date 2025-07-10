import React, { useEffect, useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/common/Header"; // Already imported

const productivityColumns = [
  { id: "date", label: "📅 Date" },
  { id: "user", label: "👤 User" },
  { id: "offline_meetings", label: "📞 Offline Meetings" },
  { id: "productive", label: "✅ Productive Time" },
  { id: "screen_time", label: "🖥️ Screen Time" },
  { id: "unproductive", label: "❌ Unproductive Time" },
];

export default function WorkingHours() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("today");
  const [teamId, setTeamId] = useState("1");
  const [userId, setUserId] = useState("all");

  useEffect(() => {
    const demoData = [
      {
        date: "08/07/2025",
        user: "Ali Abid-P",
        offline_meetings: "0s",
        productive: "15m 22s",
        screen_time: "30m 10s",
        unproductive: "14m 48s",
      },
      {
        date: "08/07/2025",
        user: "Amir Zaman",
        offline_meetings: "5m",
        productive: "25m",
        screen_time: "1h 5m",
        unproductive: "35m",
      },
      {
        date: "08/07/2025",
        user: "Amna Zakria-P",
        offline_meetings: "0s",
        productive: "10m",
        screen_time: "20m",
        unproductive: "10m",
      },
    ];

    setData(demoData);
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Global Header */}
      {/* <Header /> */}

      {/* Sidebar + Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 border-r bg-white shadow-md">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center pb-6 mb-6 border-b">
            <h2 className="text-3xl font-semibold text-gray-800">📊 Working Hours Overview</h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm text-sm"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last_week">Last Week</option>
              <option value="last_month">Last Month</option>
            </select>

            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm text-sm"
            >
              <option value="1">Team 1</option>
              <option value="2">Team 2</option>
            </select>

            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm text-sm"
            >
              <option value="all">All Users</option>
              <option value="1">User 1</option>
              <option value="2">User 2</option>
            </select>

            <button
              onClick={() => {}}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow"
            >
              🔄 Refresh
            </button>
          </div>

          {/* Table Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            {loading ? (
              <div className="text-center py-12 text-gray-500 text-base font-medium">
                Loading productivity data...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      {productivityColumns.map((col) => (
                        <th key={col.id} className="p-3 border text-left">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 ? (
                      <tr>
                        <td
                          colSpan={productivityColumns.length}
                          className="text-center p-4 text-gray-500"
                        >
                          No productivity data available.
                        </td>
                      </tr>
                    ) : (
                      data.map((item, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0
                              ? "bg-white hover:bg-gray-50"
                              : "bg-gray-50 hover:bg-gray-100"
                          }
                        >
                          <td className="p-3 border">{item.date || "N/A"}</td>
                          <td className="p-3 border">{item.user || "N/A"}</td>
                          <td className="p-3 border">{item.offline_meetings || "0s"}</td>
                          <td className="p-3 border">{item.productive || "0s"}</td>
                          <td className="p-3 border">{item.screen_time || "0s"}</td>
                          <td className="p-3 border">{item.unproductive || "0s"}</td>
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
    </div>
  );
}
