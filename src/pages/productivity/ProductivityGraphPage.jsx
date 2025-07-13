import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
} from "recharts";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00C49F"];

// Demo data for fallback
const demoData = [
  { username: "Alice", duration: 90 },
  { username: "Bob", duration: 120 },
  { username: "Charlie", duration: 60 },
  { username: "Diana", duration: 75 },
  { username: "Eve", duration: 105 },
];

export default function ProductivityGraphPage() {
  const [data, setData] = useState([]);
  const [teamId, setTeamId] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:9000/team/teams/${teamId}/activities`)
      .then((res) => res.json())
      .then((json) => {
        const grouped = json.reduce((acc, item) => {
          const key = item.username;
          if (!acc[key]) acc[key] = 0;
          acc[key] += item.duration || 0;
          return acc;
        }, {});

        const formatted = Object.entries(grouped).map(([username, duration]) => ({
          username,
          duration: +(duration / 60).toFixed(2),
        }));

        setData(formatted.length ? formatted : demoData); // Use demo if empty
        setLoading(false);
      })
      .catch(() => {
        setData(demoData);
        setLoading(false);
      });
  }, [teamId]);

  return (
    <div className="flex">
      <div className="w-60 fixed top-0 left-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 ml-60 min-h-screen flex flex-col">
        <Header title="Productivity Graph" userInitial="M" />

        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-6">Productivity Overview (minutes)</h2>

          <div className="space-y-12">
            {/* Bar Chart */}
            <div>
              <h3 className="text-lg font-medium mb-2">Bar Chart</h3>
              <BarChart width={800} height={300} data={data} className="bg-white p-4 rounded shadow">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="username" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="duration" fill="#8884d8" />
              </BarChart>
            </div>

            {/* Pie Chart */}
            <div>
              <h3 className="text-lg font-medium mb-2">Pie Chart</h3>
              <PieChart width={800} height={300} className="bg-white p-4 rounded shadow">
                <Pie
                  data={data}
                  dataKey="duration"
                  nameKey="username"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            {/* Line Chart */}
            <div>
              <h3 className="text-lg font-medium mb-2">Line Chart</h3>
              <LineChart
                width={800}
                height={300}
                data={data}
                className="bg-white p-4 rounded shadow"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="username" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="duration" stroke="#82ca9d" />
              </LineChart>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
