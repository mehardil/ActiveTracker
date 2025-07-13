import { BarChart3 } from "lucide-react";

export default function Header({ title = "Activity Log", userInitial = "M" }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
      {/* Left Side: Logo + Page Title */}
      <div className="flex items-center space-x-6">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-2 text-gray-900 font-semibold text-lg">
          <span className="text-xl">⏱️</span>
          <span className="font-bold">TrackMate</span>
        </div>

        {/* Page Title */}
        <div className="flex items-center space-x-2 text-gray-800 font-semibold text-lg">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <span>{title}</span>
        </div>
      </div>

      {/* Right Side: Upgrade Button + User Initial */}
      <div className="flex items-center space-x-4">
        <button className="bg-orange-500 text-white text-sm px-4 py-2 rounded-full hover:bg-orange-600 transition-all">
          Upgrade - 6 days left
        </button>

        <div className="w-9 h-9 rounded-full bg-gray-700 text-white flex items-center justify-center font-semibold">
          {userInitial}
        </div>
      </div>
    </header>
  );
}
