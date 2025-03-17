import { Download, Link } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";


const ActivationPage = () => {
  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-semibold">Deploy your first agent to get started!</h2>
        <p className="text-gray-600 mt-2">Start collecting activity data and unlock access to reports and dashboards.</p>
        <div className="mt-6 flex gap-6">
          <div className="border p-6 rounded-lg shadow-lg w-1/2 text-center">
            <div className="text-gray-700 text-xl font-bold mb-4">Install on your device</div>
            <p className="text-gray-600 mb-4">
              Modifying the name of this installer will prevent the agent from being properly installed on any computer.
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center mx-auto">
              <Download className="mr-2" /> Download Agent
            </button>
          </div>
          <div className="border p-6 rounded-lg shadow-lg w-1/2 text-center">
            <div className="text-gray-700 text-xl font-bold mb-4">Share the installation file</div>
            <p className="text-gray-600 mb-4">Send the installation file to others.</p>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded flex items-center mx-auto cursor-not-allowed"
              disabled
            >
              <Link className="mr-2" /> Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationPage;
