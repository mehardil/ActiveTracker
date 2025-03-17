import React from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
const AlarmsPage = () => {
  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Alarms Page</h1>
        <p>Here you can manage alarms and alerts.</p>
      </div>
    </div>
  );
};

export default AlarmsPage;
