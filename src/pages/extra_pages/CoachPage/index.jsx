import React from "react";
import Sidebar from "../../../components/common/Sidebar";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";

const CoachPage = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-60 fixed h-screen">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Header */}
        <Header title="Coach" userInitial="M" />


        

        {/* Main Section */}
        <main className="flex-1 p-6 bg-white">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Coach Page</h1>
          <p className="text-gray-600">Personalized guidance and coaching tools will appear here.</p>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default CoachPage;
