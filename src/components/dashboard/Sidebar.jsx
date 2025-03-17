import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <ul className="p-4 bg-gray-900 text-white h-screen w-60">
      <li className="p-2 hover:bg-gray-700 rounded">
        <Link to="/productivity">Productivity</Link>
      </li>
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
        <Link to="/live-reports">Live Reports</Link>
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
  );
};

export default Sidebar;
