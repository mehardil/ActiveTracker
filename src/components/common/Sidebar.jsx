import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  BrainCircuit,
  BarChart3,
  Zap,
  Plug,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  MonitorSmartphone,
  BarChart4 // 👈 You can use another icon for Productivity Graph (or any you prefer)
} from "lucide-react";

const navLinks = [
  { name: "Productivity", icon: LayoutDashboard, to: "/workinghours" },
  { name: "Activity Log", icon: Activity, to: "/activitylog" },
  { name: "Coach", icon: BrainCircuit, to: "/coach" },
  { name: "Insights", icon: BarChart3, to: "/insight" },
  { name: "Impact", icon: Zap, to: "/impact" },
  { name: "API & Integrations", icon: Plug, to: "/api-integrations" },
  { name: "Alarms", icon: Bell, to: "/alarms" },
  { name: "Activation", icon: MonitorSmartphone, to: "/activation" },
  { name: "Productivity Graph", icon: BarChart4, to: "/productivitygraph" }, // 👈 Newly added
  { name: "Settings", icon: Settings, to: "/settings" },
  { name: "Help", icon: HelpCircle, to: "/help" },
  { name: "Logout", icon: LogOut, to: "/logout" },
];


export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="bg-gray-900 text-white h-screen w-60 fixed left-0 top-0 flex flex-col shadow-xl z-20">
      {/* Sidebar Header / Logo */}
      <div className="bg-gray-800 px-6 py-4 text-xl font-semibold border-b border-gray-700">
        ⏱️ TrackMate
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navLinks.map(({ name, icon: Icon, to }) => {
            const isActive = location.pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <footer className="text-xs text-gray-500 px-4 py-3 border-t border-gray-700">
        © 2025 TrackMate Inc.
      </footer>
    </aside>
  );
}
