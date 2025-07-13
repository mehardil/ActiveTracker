import { Download, Link as LinkIcon } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const ActivationPage = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-60 fixed h-screen">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Header */}
        <Header title="Activation" userInitial="M" />

        {/* Main Section */}
        <main className="flex-1 p-8 bg-white">
          <h2 className="text-3xl font-semibold text-gray-800">
            Deploy your first agent to get started!
          </h2>
          <p className="text-gray-600 mt-2">
            Start collecting activity data and unlock access to reports and dashboards.
          </p>

          <div className="mt-6 flex gap-6 flex-col md:flex-row">
            {/* Download Agent */}
            <div className="border p-6 rounded-lg shadow-lg w-full md:w-1/2 text-center bg-gray-50">
              <div className="text-gray-700 text-xl font-bold mb-4">Install on your device</div>
              <p className="text-gray-600 mb-4">
                Modifying the name of this installer will prevent the agent from being properly installed on any computer.
              </p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center mx-auto">
                <Download className="mr-2 w-5 h-5" /> Download Agent
              </button>
            </div>

            {/* Share Installation File */}
            <div className="border p-6 rounded-lg shadow-lg w-full md:w-1/2 text-center bg-gray-50">
              <div className="text-gray-700 text-xl font-bold mb-4">Share the installation file</div>
              <p className="text-gray-600 mb-4">Send the installation file to others.</p>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded flex items-center mx-auto cursor-not-allowed"
                disabled
              >
                <LinkIcon className="mr-2 w-5 h-5" /> Copy Link
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default ActivationPage;
