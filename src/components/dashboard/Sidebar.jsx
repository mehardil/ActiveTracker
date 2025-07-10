import { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isProductivityOpen, setIsProductivityOpen] = useState(false);

  return (
    <div className="bg-gray-900 text-white h-screen w-60 fixed left-0 top-0 overflow-y-auto shadow-lg z-10">
      <ul className="p-4 space-y-2">
        {/* Productivity with Submenu */}
        <li className="hover:bg-gray-700 rounded">
          <div
            className="cursor-pointer flex justify-between items-center p-2"
            onClick={() => setIsProductivityOpen(!isProductivityOpen)}
          >
            <span>Productivity</span>
            <span>{isProductivityOpen ? "▾" : "▸"}</span>
          </div>
          {isProductivityOpen && (
            <ul className="ml-4 mt-1 space-y-1 text-sm">
              <li className="hover:bg-gray-700 p-1 rounded">
                <Link to="/productivity/live">Live</Link>
              </li>
              <li className="hover:bg-gray-700 p-1 rounded">
                <Link to="/productivity/daily">Daily</Link>
              </li>
              <li className="hover:bg-gray-700 p-1 rounded">
                <Link to="/productivity/monthly">Monthly</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Other Main Links */}
        <li className="p-2 hover:bg-gray-700 rounded bg-gray-800">
          <Link to="/activation">Activation</Link>
        </li>
        <li className="p-2 hover:bg-gray-700 rounded">
          <Link to="/coach">Coach</Link>
        </li>
        <li className="p-2 hover:bg-gray-700 rounded">
          <Link to="/insights">Insights</Link>
        </li>
        <li className="p-2 hover:bg-gray-700 rounded">
          <Link to="/impact">Impact</Link>
        </li>
        <li className="p-2 hover:bg-gray-700 rounded">
          <Link to="/api-integrations">API & Integrations</Link>
        </li>
        <li className="p-2 hover:bg-gray-700 rounded">
          <Link to="/alarms">Alarms</Link>
        </li>
        <li className="p-2 hover:bg-gray-700 rounded">
          <Link to="/settings">Settings</Link>
        </li>
        <li className="p-2 hover:bg-gray-700 rounded">
          <Link to="/help">Help</Link>
        </li>
        <li className="p-2 hover:bg-gray-700 rounded">
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
