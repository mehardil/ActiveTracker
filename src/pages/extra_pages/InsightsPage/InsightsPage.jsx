import React, { useState } from "react";
import { PlayCircle, RefreshCw, Calendar, Users } from "lucide-react";
import Sidebar from "../../../components/common/Sidebar";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";

export default function InsightsPage() {
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
        <Header title="Insights" userInitial="M" />

        {/* Main Section */}
        <main className="flex-1 p-6 bg-white">
          {/* Top Section */}
  

          {/* Features Section */}
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Identify burnout risk</li>
              <li>Set and track productivity goals</li>
              <li>Get AI-driven coaching recommendations</li>
              <li>Assess workforce capacity</li>
              <li>Reduce workforce technology costs</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-4">
            <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition">
              Upgrade now
            </button>
            <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition">
              Request a quote
            </button>
          </div>

          {/* Demo Section */}
          <div className="mt-6 text-center">
            <h3 className="font-semibold text-lg">Watch the demo to see Insights in action</h3>
            <div className="mt-4 flex justify-center">
              <div className="relative w-96 h-56 bg-gray-200 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-blue-500 cursor-pointer" />
                <span className="absolute bottom-2 text-gray-600 text-sm">
                  Demo: Insights Dashboards
                </span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 mt-6">
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
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
