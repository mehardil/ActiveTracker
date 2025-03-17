import React, { useState } from "react";
import { LayoutDashboard, Users, RefreshCw, Calendar, Clock } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";

export default function ProductivityPage() {
  const [selectedDate, setSelectedDate] = useState("02/18/2025 - 02/18/2025");
  const [startTime, setStartTime] = useState("08:00 AM");
  const [endTime, setEndTime] = useState("05:00 PM");

  return (
    <Sidebar>
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-semibold">PRODUCTIVITY</h2>
          <div className="flex items-center space-x-4">
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">Upgrade - 6 days left</button>
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
              M
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2 border p-2 rounded-lg">
            <Calendar className="w-5 h-5" />
            <input type="text" value={selectedDate} className="outline-none bg-transparent" readOnly />
          </div>

          <div className="flex items-center space-x-2 border p-2 rounded-lg">
            <Users className="w-5 h-5" />
            <select className="outline-none bg-transparent">
              <option>All Users</option>
            </select>
          </div>

          <button className="flex items-center space-x-2 bg-gray-300 p-2 rounded-lg">
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Report Section */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg">SINGLE-DAY REPORT</h3>
          <div className="flex items-center space-x-4 mt-2">
            <span>Previous</span>
            <strong>02/18/2025</strong>
            <span>Next</span>

            <div className="flex items-center space-x-2 border p-2 rounded-lg">
              <Clock className="w-5 h-5" />
              <input type="text" value={startTime} className="outline-none bg-transparent" readOnly />
            </div>

            <div className="flex items-center space-x-2 border p-2 rounded-lg">
              <Clock className="w-5 h-5" />
              <input type="text" value={endTime} className="outline-none bg-transparent" readOnly />
            </div>

            <select className="border p-2 rounded-lg">
              <option>30 min</option>
            </select>

            <select className="border p-2 rounded-lg">
              <option>Total</option>
            </select>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="strict-mode" />
              <label htmlFor="strict-mode">Strict Mode</label>
            </div>
          </div>

          {/* No Data Message */}
          <div className="mt-4 text-gray-500 text-center">No data for 02/18/2025</div>
        </div>
      </div>
    </Sidebar>
  );
}
