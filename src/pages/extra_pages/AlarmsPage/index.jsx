import React from "react";
import Sidebar from "../../../components/common/Sidebar";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";

const AlarmsPage = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-60 fixed h-screen">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Header */}
        <Header title="Alarms" userInitial="M" />

        {/* Main Section */}
        <main className="flex-1 p-6 bg-white">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Alarms Page</h1>
          <p className="text-gray-600">Here you can manage alarms and alerts.</p>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AlarmsPage;
