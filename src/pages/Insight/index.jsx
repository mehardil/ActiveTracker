import React, { useState } from "react";
import { PlayCircle, RefreshCw, Calendar, Users } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";

export default function InsightsPage() {
  const [selectedDate, setSelectedDate] = useState("03/17/2025 - 03/17/2025");

  return (
    <Sidebar>
      <div className="flex-1 p-6">
        {/* Top Section */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-semibold">INSIGHTS</h2>
          <div className="flex items-center space-x-4">
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">Upgrade</button>
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
              M
            </div>
          </div>
        </div>

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
          <button className="bg-teal-500 text-white px-4 py-2 rounded-lg">Upgrade now</button>
          <button className="bg-teal-500 text-white px-4 py-2 rounded-lg">Request a quote</button>
        </div>

        {/* Demo Section */}
        <div className="mt-6 text-center">
          <h3 className="font-semibold text-lg">Watch the demo to see Insights in action</h3>
          <div className="mt-4 flex justify-center">
            <div className="relative w-96 h-56 bg-gray-200 rounded-lg flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-blue-500 cursor-pointer" />
              <span className="absolute bottom-2 text-gray-600 text-sm">Demo: Insights Dashboards</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mt-6">
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
      </div>
    </Sidebar>
  );
}
