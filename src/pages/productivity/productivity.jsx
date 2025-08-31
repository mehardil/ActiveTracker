import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const barData = [
  { name: "Mon", productivity: 65 },
  { name: "Tue", productivity: 80 },
  { name: "Wed", productivity: 70 },
  { name: "Thu", productivity: 85 },
  { name: "Fri", productivity: 60 },
];

const pieData = [
  { name: "Active", value: 400 },
  { name: "Idle", value: 300 },
  { name: "Break", value: 100 },
];

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-60 fixed top-0 left-0 h-screen z-10">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 ml-60 min-h-screen flex flex-col">
        {/* Header */}
        <Header
          title="Dashboard"
          userInitial={user?.username?.[0]?.toUpperCase() || "U"}
        />

        {/* Main Section */}
        <main className="flex-1 p-6 space-y-6 bg-gray-100 text-gray-800">
          {/* User Info */}
          {user && (
            <div className="bg-white shadow rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Welcome, {user.name}
              </h2>
              <p className="text-gray-600">
                Username: <span className="font-medium">{user.username}</span>
              </p>
              <p className="text-gray-600">
                Role: <span className="font-medium">{user.role}</span>
              </p>
              <p className="text-gray-600">
                Organization:{" "}
                <span className="font-medium">{user.organization?.name}</span>
              </p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-2xl p-6">
              <h3 className="text-sm text-gray-500">Total Users</h3>
              <p className="text-2xl font-bold">1,200</p>
            </div>
            <div className="bg-white shadow rounded-2xl p-6">
              <h3 className="text-sm text-gray-500">Active Today</h3>
              <p className="text-2xl font-bold">874</p>
            </div>
            <div className="bg-white shadow rounded-2xl p-6">
              <h3 className="text-sm text-gray-500">Average Productivity</h3>
              <p className="text-2xl font-bold">76%</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white shadow rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">
                Weekly Productivity
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="productivity"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white shadow rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">User Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
