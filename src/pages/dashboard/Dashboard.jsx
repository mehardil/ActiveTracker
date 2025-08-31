import React, { useState, useEffect } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FilterPanel from "../../components/common/FilterPanel";

const Dashboard = () => {
  const [filters, setFilters] = useState({
    selectedUser: "",
    selectedTeam: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  const fetchData = () => {
    const { selectedUser, selectedTeam, startDate, endDate, startTime, endTime } = filters;

    const queryParams = new URLSearchParams();

    if (selectedUser) queryParams.append("user", selectedUser);
    if (selectedTeam) queryParams.append("team", selectedTeam);
    if (startDate) queryParams.append("start_date", startDate);
    if (endDate) queryParams.append("end_date", endDate);
    if (startTime) queryParams.append("start_time", startTime);
    if (endTime) queryParams.append("end_time", endTime);

    fetch(`http://127.0.0.1:9900/data/fetch?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Data:", data);
        // setData(data); // Store it in state if needed
      })
      .catch((err) => console.error("Error fetching data:", err));
  };

  // ✅ Log filter values whenever they change
  useEffect(() => {
    console.log("🔁 Filter values updated:", filters);
  }, [filters]);

  return (
    <div>
      <Header />
      <FilterPanel
        selectedUser={filters.selectedUser}
        selectedTeam={filters.selectedTeam}
        startDate={filters.startDate}
        endDate={filters.endDate}
        startTime={filters.startTime}
        endTime={filters.endTime}
        onFilterChange={handleFilterChange}
        fetchData={fetchData}
      />
      <Footer />
    </div>
  );
};

export default Dashboard;
