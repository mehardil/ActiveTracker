import React, { useState } from "react";
import { BarChart3, Users, RefreshCw, Calendar } from "lucide-react";
import Sidebar from "../../../components/common/Sidebar";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";

export default function ImpactPage() {
  const [selectedDate, setSelectedDate] = useState("03/17/2025 - 03/17/2025");

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-60 fixed h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Header */}
        <Header title="Impact" userInitial="M" />

        {/* Main Section */}
        <main className="flex-1 p-6 bg-white">
          {/* Title Section */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Team Impact Metrics</h1>
          <p className="text-gray-600 mb-6">
            Analyze how technology usage impacts your team’s productivity, focus, and well-being.
          </p>

          {/* Highlights Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-800">⏱ Time Saved</h4>
              <p className="text-lg text-green-700 font-bold mt-2">48 hours</p>
              <p className="text-sm text-gray-600">in the past week</p>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-800">🚀 Productivity Gain</h4>
              <p className="text-lg text-blue-700 font-bold mt-2">18%</p>
              <p className="text-sm text-gray-600">compared to last month</p>
            </div>

            <div className="bg-yellow-100 p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-800">📉 Distraction Reduction</h4>
              <p className="text-lg text-yellow-700 font-bold mt-2">32%</p>
              <p className="text-sm text-gray-600">across all users</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            {/* Date Picker */}
            <div className="flex items-center space-x-2 border p-2 rounded-lg">
              <Calendar className="w-5 h-5" />
              <input
                type="text"
                value={selectedDate}
                className="outline-none bg-transparent"
                readOnly
              />
            </div>

            {/* User Filter */}
            <div className="flex items-center space-x-2 border p-2 rounded-lg">
              <Users className="w-5 h-5" />
              <select className="outline-none bg-transparent">
                <option>All Users</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button className="flex items-center space-x-2 bg-gray-300 p-2 rounded-lg hover:bg-gray-400 transition">
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Description */}
          <div className="bg-gray-100 p-4 rounded-lg text-gray-700">
            <p className="mb-2">
              This section helps you understand how digital tools affect your team’s outcomes.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Monitor usage trends to discover bottlenecks</li>
              <li>Identify tools that improve or hinder productivity</li>
              <li>Enable healthier tech habits across your teams</li>
            </ul>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
