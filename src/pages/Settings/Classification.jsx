import React, { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const Classification = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://127.0.0.1:9900/categories/web_categories_list",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`API error: ${text}`);
        }

        const result = await response.json();
        console.log(result,"page loading value")
        if (result.success) setData(result.categories);
        else console.error(result.message);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  // Update row (type/category)
  const handleUpdate = async (row, field, value) => {
    try {
      const payload = {
        website_url: row.website || row.pattern,
        type: field === "type" ? value : row.type,
        category: field === "category" ? value : row.category,
        status: row.status, // keep status as is
        application: row.application,
      };

      const response = await fetch(
        "http://127.0.0.1:9900/categories/update_categories",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {

        const text = await response.text();
        throw new Error(`API error: ${text}`);
      }

      const result = await response.json();
      console.log(result,"what is value of result")
      if (result.success) {
        setData((prev) =>
          prev.map((item) =>
            item.category_id === row.category_id
              ? { ...item, type: payload.type, category: payload.category }
              : item
          )
        );
        alert("Updated successfully!");
      } else {
        alert("Update failed: " + result.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating: " + error.message);
    }
  };

  // Filtered data by website
  const filteredData = data.filter((item) =>
    item.website?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-60 bg-white border-r shadow-sm">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            🔖 Classifications
          </h1>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["Pending", "Classified", "Categories"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md border ${
                  activeTab === tab
                    ? "bg-blue-100 text-blue-700 border-blue-400"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <input
              type="text"
              placeholder="🔍 Search by website..."
              className="w-full md:w-1/3 px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg shadow border bg-white">
            <table className="min-w-full text-sm text-left text-gray-800">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">
                    <input type="checkbox" />
                  </th>
                  <th className="p-3">Website</th>
                  <th className="p-3">Pattern</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Application</th>
                  <th className="p-3">Category</th>
                 
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.category_id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-3">
                        <input type="checkbox" />
                      </td>
                      <td className="p-3 text-blue-600 underline cursor-pointer">
                        {item.website || "-"}
                      </td>
                      <td className="p-3">{item.pattern || "-"}</td>
                      <td className="p-3">
                        <select
                          className="w-full px-2 py-1 border rounded-md text-sm focus:ring-blue-500 focus:outline-none"
                          value={item.type || ""}
                          onChange={(e) =>
                            handleUpdate(item, "type", e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            <option value="HR">HR</option>
                            <option value="Developer">Developer</option>
                            <option value="Other">Other</option>
                            <option value="Account">Account</option>
                            <option value="QA">QA</option>
                          </select>
                        </td>
                        <td className="p-3">{item.application || "-"}</td>
                      <td className="p-3">
                        <select
                          className="w-full px-2 py-1 border rounded-md text-sm focus:ring-blue-500 focus:outline-none"
                          value={item.category || "uncategorized"}
                          onChange={(e) =>
                            handleUpdate(item, "category", e.target.value)
                          }
                        >
                          <option value="uncategorized">Uncategorized</option>
                          <option value="productive">Productive</option>
                          <option value="unproductive">Unproductive</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <p className="text-sm text-gray-600 mt-4">
            Total Records:{" "}
            <span className="font-semibold">{filteredData.length}</span>
          </p>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Classification;
