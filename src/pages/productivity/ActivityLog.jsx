import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Sidebar from "../../components/common/Sidebar";
import SearchHeader from "../../components/common/SearchHeader";

const columnsConfig = [
  { id: "username", label: "Username" },
  { id: "category", label: "Category" },
  { id: "application", label: "Application" },
  { id: "website", label: "Website" },
  { id: "title", label: "title" },
  { id: "start_time", label: "Start Time" },
  { id: "end_time", label: "End Time" },
  { id: "duration", label: "Duration (sec)" },
];

export default function ActivityLog() {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [filterType, setFilterType] = useState("today");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ✅ Handle Data from SearchHeader
  const handleDataUpdate = (activities, fetchedUsers, fetchedTeams, total) => {
    setData(activities || []);
    setUsers(fetchedUsers);
    setTeams(fetchedTeams);
    setTotalCount(total || 0);
    setUserCount(new Set((activities || []).map((i) => i.user_id)).size);
  };

  // ✅ Auto refresh when page or limit changes
  useEffect(() => {
    document.querySelector("button.bg-blue-600")?.click(); // auto re-fetch
  }, [currentPage, rowsPerPage]);

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="w-60 border-r bg-white shadow-sm">
        <Sidebar />
      </div>

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📊 Activity Log{" "}
            <span className="text-base text-gray-500 ml-2">
              ({userCount} users)
            </span>
          </h2>
        </div>

        {/* ✅ Search Header */}
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
          onDataUpdate={handleDataUpdate}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
        />

        {/* ✅ Table */}
        <div className="bg-white p-4 rounded-xl shadow">
          {data.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No activity data found. Please apply filters.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      {columnsConfig.map((col) => (
                        <th key={col.id} className="p-3 border">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`${
                          idx % 2 === 0
                            ? "bg-white hover:bg-gray-50"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        {columnsConfig.map((col) => (
                          <td key={col.id} className="p-2 border">
                            {item[col.id] ?? "N/A"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ✅ Pagination */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  Page <strong>{currentPage}</strong> of{" "}
                  <strong>{totalPages || 1}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md border bg-white hover:bg-gray-100 disabled:bg-gray-200"
                  >
                    ◀ Prev
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md border bg-white hover:bg-gray-100 disabled:bg-gray-200"
                  >
                    Next ▶
                  </button>

                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border rounded-md px-2 py-1 text-sm"
                  >
                    {[10, 20, 50].map((n) => (
                      <option key={n} value={n}>
                        {n} / page
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
