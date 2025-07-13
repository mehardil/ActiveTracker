import React, { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  LayoutDashboard,
  Users,
  RefreshCw,
  Calendar,
  Clock,
} from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ProductivityPage() {
  const [selectedDate, setSelectedDate] = useState("02/18/2025");
  const [startTime, setStartTime] = useState("08:00"); // Default to 08:00 AM
  const [endTime, setEndTime] = useState("19:00"); // Default to 07:00 PM (in 24-hour format)
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
        setData(json);
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

  const handleRefresh = () => {
    fetchData();
  };

  // Group data by user_id and category
  const groupedByUser = data.reduce((acc, item) => {
    const key = item.user_id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item.duration);
    return acc;
  }, {});

  const chartData = Object.keys(groupedByUser).map((userId) => ({
    user_id: userId,
    total_duration: groupedByUser[userId].reduce((acc, duration) => acc + duration, 0) / 60, // total minutes
  }));

  return (
    <div className="flex">
      <div className={`${userCount > 5 ? "w-72" : "w-60"} transition-all duration-300`}>
        <Sidebar />
      </div>

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-semibold">PRODUCTIVITY</h2>
          <div className="flex items-center space-x-4">
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
              Upgrade - 6 days left
            </button>
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
              M
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2 border p-2 rounded-lg">
            <Calendar className="w-5 h-5" />
            <ReactDatePicker
              selected={new Date(selectedDate)} // Convert to Date object
              onChange={(date) => setSelectedDate(date.toLocaleDateString())} // Update selected date
              dateFormat="MM/dd/yyyy" // Format
              className="outline-none bg-transparent text-gray-700"
              placeholderText="Select a date"
            />
          </div>

          <div className="flex items-center space-x-2 border p-2 rounded-lg">
            <Users className="w-5 h-5" />
            <select
              className="outline-none bg-transparent"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
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
        <div className="mt-4">
          <h3 className="font-semibold text-lg">SINGLE-DAY PRODUCTIVITY</h3>
          <div className="flex items-center space-x-4 mt-2">
            {/* Start Time */}
            <div className="flex items-center space-x-2 border p-2 rounded-lg">
              <Clock className="w-5 h-5" />
              <input
                type="time"
                value={startTime}
                className="outline-none bg-transparent"
                onChange={(e) => setStartTime(e.target.value)} // Allow change
              />
            </div>

            {/* End Time */}
            <div className="flex items-center space-x-2 border p-2 rounded-lg">
              <Clock className="w-5 h-5" />
              <input
                type="time"
                value={endTime}
                className="outline-none bg-transparent"
                onChange={(e) => setEndTime(e.target.value)} // Allow change
              />
            </div>

            {/* Duration Interval */}
            <select
              className="border p-2 rounded-lg"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option>30 min</option>
              <option>15 min</option>
              <option>1 hour</option>
            </select>

            {/* Report Type */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {data.map((item, index) => (
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
      </div>
    </div>
  );
}
