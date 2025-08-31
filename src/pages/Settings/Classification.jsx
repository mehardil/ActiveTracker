import React, { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const sampleData = [
  { name: "tamashaprime.ecnstg.com", classificationType: "Pending Category", category: "", status: "Productive", duration: "108h 43m" },
  { name: "aistudio.google.com", classificationType: "Pending Category", category: "", status: "Productive", duration: "80h 53m" },
  { name: "Cursor (Cursor.exe)", classificationType: "Pending Category", category: "", status: "Productive", duration: "76h 3m" },
  { name: "Url Unavailable", classificationType: "Pending Category", category: "", status: "Productive", duration: "51h 35m" },
  { name: "grok.com", classificationType: "Pending Category", category: "", status: "Productive", duration: "27h 46m" },
  { name: "ShellHost (ShellHost.exe)", classificationType: "Pending Category", category: "", status: "Productive", duration: "25h 46m" },
];

const Classification = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [search, setSearch] = useState("");

  const filteredData = sampleData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-60 bg-white border-r shadow-sm">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">🔖 Classifications</h1>

          {/* Tabs */}
          <div className="flex flex-wrap md:flex-row gap-2 mb-6">
            {["Pending", "Classified", "Categories"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md border ${
                  activeTab === tab
                    ? "bg-blue-100 text-blue-700 border-blue-400"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                } transition`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <input
              type="text"
              placeholder="🔍 Search..."
              className="w-full md:w-1/3 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="space-x-2">
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition">
                📁 Assign Category
              </button>
              <button className="px-4 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition">
                ✅ Assign Status
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
            <table className="min-w-full text-sm text-left text-gray-800">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">
                    <input type="checkbox" className="h-4 w-4" />
                  </th>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Type</th>
                  <th className="p-3 font-medium">Category</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <input type="checkbox" className="h-4 w-4" />
                    </td>
                    <td className="p-3 text-blue-600 underline cursor-pointer">{item.name}</td>
                    <td className="p-3 text-sm text-gray-600">{item.classificationType}</td>
                    <td className="p-3">
                      <select className="w-full px-2 py-1 border rounded-md text-sm focus:ring-blue-500 focus:outline-none">
                        <option>Select</option>
                        <option>HR</option>
                        <option>IT</option>
                        <option>Engineering</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select className="w-full px-2 py-1 border rounded-md text-sm bg-white focus:ring-blue-500 focus:outline-none">
                        <option>Productive</option>
                        <option>Unproductive</option>
                        <option>Neutral</option>
                      </select>
                    </td>
                    <td className="p-3">{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Count */}
          <p className="text-sm text-gray-600 mt-4">
            Total Pending: <span className="font-semibold">{filteredData.length}</span>
          </p>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Classification;
