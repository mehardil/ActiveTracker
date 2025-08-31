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
  BarChart4,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState, useEffect } from "react";

// Main navigation links
const navLinks = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/dashboard" }, // ✅ Added
  { name: "Productivity", icon: BarChart4, to: "/workinghours" },
  { name: "Activity Log", icon: Activity, to: "/activitylog" },
  { name: "Impact", icon: Zap, to: "/impact" },
  { name: "Productivity Graph", icon: BarChart3, to: "/productivitygraph" },
  { name: "Coach", icon: BrainCircuit, to: "/coach" },
  { name: "Insights", icon: BarChart3, to: "/insight" },
  { name: "Activation", icon: MonitorSmartphone, to: "/activation" },
  { name: "API & Integrations", icon: Plug, to: "/api-integrations" },
  { name: "Alarms", icon: Bell, to: "/alarms" },
  { name: "Help", icon: HelpCircle, to: "/help" },
  { name: "Logout", icon: LogOut, to: "/logout" },
];

// Settings sub-navigation links with icons
const settingsSubLinks = [
  { name: "Classification", to: "/classification", icon: LayoutDashboard },
  { name: "App Access", to: "/app-access", icon: Plug },
  { name: "Role Access", to: "/role-access", icon: BrainCircuit },
  { name: "Teams", to: "/teams", icon: Activity }, // ✅ Added Teams
];

export default function Sidebar() {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Auto-expand settings if on settings route
  useEffect(() => {
    if (location.pathname.startsWith("/settings")) {
      setSettingsOpen(true);
    }
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="bg-gray-900 text-white h-screen w-60 fixed left-0 top-0 flex flex-col shadow-xl z-20">
      {/* Logo/Header */}
      <div className="bg-gray-800 px-6 py-4 text-xl font-semibold border-b border-gray-700">
        ⏱️ TrackMate
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {/* Main links */}
          {navLinks.map(({ name, icon: Icon, to }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive(to)
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {name}
              </Link>
            </li>
          ))}

          {/* Settings section */}
          <li>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                location.pathname.startsWith("/settings")
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Settings className="w-5 h-5" />
                Settings
              </span>
              {settingsOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Sub-links under Settings */}
            {settingsOpen && (
              <ul className="pl-4 mt-2 space-y-1 border-l border-gray-700">
                {settingsSubLinks.map(({ name, to, icon: Icon }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group ${
                        isActive(to)
                          ? "bg-orange-600/20 text-orange-400 border-l-4 border-orange-500 pl-2"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/70"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <footer className="text-xs text-gray-500 px-4 py-3 border-t border-gray-700">
        © 2025 TrackMate Inc.
      </footer>
    </aside>
  );
}
