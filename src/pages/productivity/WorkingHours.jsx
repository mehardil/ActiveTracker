import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import SearchHeader from "../../components/common/SearchHeader";
import API_BASE_URL from "../../config/apiConfig";

const productivityColumns = [
  { id: "date", label: "📅 Date" },
  { id: "user", label: "👤 User" },
  { id: "offline_meetings", label: "📞 Offline Meetings" },
  { id: "productive", label: "✅ Productive Time" },
  { id: "screen_time", label: "🖥️ Screen Time" },
  { id: "unproductive", label: "❌ Unproductive Time" },
];

export default function WorkingHours() {
  /* =======================
     FILTER STATES
  ======================== */
  const [filterType, setFilterType] = useState("today");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* =======================
     DATA STATES
  ======================== */
  const [productivity, setProductivity] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =======================
     FETCH PRODUCTIVITY API
  ======================== */
  const fetchProductivity = useCallback(async () => {
    if (!startDate || !endDate) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // ✅ Build payload correctly
      const payload = {
        start_date: startDate,
        end_date: endDate,
      };

      if (selectedUser) {
        payload.user_id = Number(selectedUser);
      } else if (selectedTeam) {
        payload.team_id = Number(selectedTeam);
      }

    const res = await fetch(
      `${API_BASE_URL}/productivity/productivity`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
      console.log(payload,"here is payload data")
      const json = await res.json();
      const pdata = json?.productivity_data || null;

      setProductivity(pdata);

      if (pdata) {
        setTableData([
          {
            date: `${startDate} → ${endDate}`,
            user: selectedUser
              ? `User ${selectedUser}`
              : selectedTeam
              ? `Team ${selectedTeam}`
              : "All",
            offline_meetings: "0s",
            productive: `${pdata.productive_time_minutes.toFixed(2)} min`,
            screen_time: `${pdata.screen_time_minutes.toFixed(2)} min`,
            unproductive: `${pdata.unproductive_time_minutes.toFixed(2)} min`,
          },
        ]);
      } else {
        setTableData([]);
      }
    } catch (err) {
      console.error("Productivity fetch failed:", err);
      setProductivity(null);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedUser, selectedTeam, startDate, endDate]);

  /* =======================
     AUTO FETCH
  ======================== */
  useEffect(() => {
    fetchProductivity();
  }, [fetchProductivity]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="w-60 border-r bg-white shadow-sm">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Header title="📊 Working Hours Overview" />

        {/* Search / Filters */}
        <SearchHeader
          filterType={filterType}
          setFilterType={setFilterType}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onDataUpdate={fetchProductivity}
          currentPage={1}
          rowsPerPage={10}
        />

        {/* Summary */}
        {productivity && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
            <SummaryCard
              title="🖥️ Screen Time"
              value={`${productivity.screen_time_minutes.toFixed(2)} min`}
            />
            <SummaryCard
              title="✅ Productive Time"
              value={`${productivity.productive_time_minutes.toFixed(2)} min`}
              color="text-green-600"
            />
            <SummaryCard
              title="❌ Unproductive Time"
              value={`${productivity.unproductive_time_minutes.toFixed(2)} min`}
              color="text-red-500"
            />
          </div>
        )}

        {/* Table */}
        <div className="bg-white p-4 rounded-xl shadow">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : tableData.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No productivity data found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    {productivityColumns.map((c) => (
                      <th key={c.id} className="p-3 border">
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr key={idx} className={idx % 2 ? "bg-gray-50" : ""}>
                      {productivityColumns.map((c) => (
                        <td key={c.id} className="p-2 border">
                          {row[c.id]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =======================
   SUMMARY CARD
======================== */
function SummaryCard({ title, value, color = "text-gray-800" }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
