import React from "react";
import {
  Mail,
  Facebook,
  Linkedin,
  Youtube,
  Instagram,
  X as TwitterX,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-10">
      {/* Top Bar: Email and Social Icons */}
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 text-sm text-gray-600">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <Mail className="w-4 h-4 text-teal-500" />
          <a href="mailto:info@trackmate.com" className="hover:underline">
            info@trackmate.com
          </a>
        </div>

        <div className="flex items-center space-x-4 text-gray-500">
          <TwitterX className="w-4 h-4 hover:text-gray-800 cursor-pointer" />
          <Facebook className="w-4 h-4 hover:text-gray-800 cursor-pointer" />
          <Linkedin className="w-4 h-4 hover:text-gray-800 cursor-pointer" />
          <Youtube className="w-4 h-4 hover:text-gray-800 cursor-pointer" />
          <Instagram className="w-4 h-4 hover:text-gray-800 cursor-pointer" />
        </div>
      </div>

      {/* Bottom Bar: Legal Links */}
      <div className="bg-blue-50 text-center text-sm text-gray-700 px-4 py-3 flex flex-col md:flex-row items-center justify-center gap-4 flex-wrap border-t">
        <span>© {new Date().getFullYear()}, TrackMate</span>
        <span className="hidden md:inline">|</span>
        <a href="#" className="hover:underline">
          Cookies Settings
        </a>
        <span className="hidden md:inline">|</span>
        <a href="#" className="hover:underline">
          US State Privacy Notice
        </a>
        <span className="hidden md:inline">|</span>
        <a href="#" className="hover:underline">
          Website Terms of Use
        </a>
        <span className="hidden md:inline">|</span>
        <a href="#" className="hover:underline">
          Privacy Statement
        </a>
        <span className="hidden md:inline">|</span>
        <a href="#" className="hover:underline">
          Legal Information
        </a>
      </div>
    </footer>
  );
}
