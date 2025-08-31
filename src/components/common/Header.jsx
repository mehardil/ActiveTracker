import { BarChart3, Settings, LogOut, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header({
  title = "Activity Log",
  user = { name: "Mehar Dil", role: "Data Engineer", email: "mehar@example.com" },
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b relative shadow-sm">
      {/* Left Side: Logo + Title */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-gray-900 font-semibold text-lg">
          <span className="text-xl">⏱️</span>
          <span className="font-bold">TrackMate</span>
        </div>

      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <button className="bg-orange-500 text-white text-sm px-4 py-2 rounded-full hover:bg-orange-600 transition-all shadow-md">
          Upgrade - 6 days left
        </button>

        {/* Profile Icon (instead of Initial) */}
        <div
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 text-white flex items-center justify-center cursor-pointer hover:opacity-90 transition"
        >
          <User className="w-5 h-5" />
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-14 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
            {/* User Info */}
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 border-b">
              <div className="w-12 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-base">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            </div>

            {/* Email */}
            <div className="px-4 py-3 text-sm text-gray-700 border-b">
              <p className="truncate">
                <span className="font-medium text-gray-600">Email: </span>
                {user.email}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col text-sm">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700 transition">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 transition">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
