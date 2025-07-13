import React, { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Users,
  RefreshCw,
  Calendar,
  Clock,
} from "lucide-react";

import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

export default function ProductivityPage() {
  const [selectedDate, setSelectedDate] = useState("02/18/2025");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("19:00");
  const [duration, setDuration] = useState("30 min");
  const [reportType, setReportType] = useState("Total");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState(1);
  const [userCount, setUserCount] = useState(0);

  const fetchData = () => {
    setLoading(true);
    fetch(`http://127.0.0.1:9000/team/teams/${teamId}/activities`)
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setData(json);
          const uniqueUsers = new Set(json.map((item) => item.user_id));
          setUserCount(uniqueUsers.size);
        } else {
          setData([]);
          setUserCount(0);
        }
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setUserCount(0);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [teamId]);

  const handleRefresh = () => {
    fetchData();
  };

  const groupedByUser = Array.isArray(data)
    ? data.reduce((acc, item) => {
        const key = item.user_id;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item.duration);
        return acc;
      }, {})
    : {};

  const chartData = Object.keys(groupedByUser).map((userId) => ({
    user_id: userId,
    total_duration:
      groupedByUser[userId].reduce((acc, duration) => acc + duration, 0) / 60,
  }));

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`${userCount > 5 ? "w-72" : "w-60"} transition-all duration-300 fixed top-0 left-0 h-screen`}>
        <Sidebar />
      </div>

      {/* Main content wrapper (margin-left to avoid sidebar overlap) */}
      <div className="flex-1 ml-60 min-h-screen flex flex-col">
        <Header title="Productivity" userInitial="M" />

        <main className="flex-1 p-6">
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2 border p-2 rounded-lg">
              <Calendar className="w-5 h-5" />
              <ReactDatePicker
                selected={new Date(selectedDate)}
                onChange={(date) => setSelectedDate(date.toLocaleDateString())}
                dateFormat="MM/dd/yyyy"
                className="outline-none bg-transparent text-gray-700"
              />
            </div>

            <div className="flex items-center space-x-2 border p-2 rounded-lg">
              <Users className="w-5 h-5" />
              <select
                className="outline-none bg-transparent"
                value={teamId}
                onChange={(e) => setTeamId(Number(e.target.value))}
              >
                <option value="1">Team 1</option>
                <option value="2">Team 2</option>
              </select>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 bg-gray-300 p-2 rounded-lg"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* SINGLE-DAY PRODUCTIVITY Filters */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">SINGLE-DAY PRODUCTIVITY</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 border p-2 rounded-lg">
                <Clock className="w-5 h-5" />
                <input
                  type="time"
                  value={startTime}
                  className="outline-none bg-transparent"
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2 border p-2 rounded-lg">
                <Clock className="w-5 h-5" />
                <input
                  type="time"
                  value={endTime}
                  className="outline-none bg-transparent"
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>

              <select
                className="border p-2 rounded-lg"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option>30 min</option>
                <option>15 min</option>
                <option>1 hour</option>
              </select>

              <select
                className="border p-2 rounded-lg"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option>Total</option>
                <option>Detailed</option>
              </select>
            </div>
          </div>

          {/* Render API Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray(data) &&
              data.map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 p-6 rounded-2xl shadow-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {item.username}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {item.category || "Uncategorized"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-sm text-gray-700">
                    <div>
                      <p><span className="font-medium">Application:</span> {item.application || "N/A"}</p>
                      <p><span className="font-medium">Website:</span> {item.website || "N/A"}</p>
                      <p><span className="font-medium">Title:</span> {item.title || "N/A"}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Start Time:</span> {item.start_time}</p>
                      <p><span className="font-medium">End Time:</span> {item.end_time}</p>
                      <p><span className="font-medium">Duration:</span> {item.duration} sec</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
