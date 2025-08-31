import React, { useState } from "react";
import {
  HelpCircle,
  Mail,
  MessageSquare,
  Info,
  Send,
} from "lucide-react";

import Sidebar from "../../../components/common/Sidebar";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";

export default function HelpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    alert("Issue submitted successfully!");
    setFormData({ name: "", email: "", issue: "" });
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-60 fixed h-screen z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <Header title="Help & Support" userInitial="M" />

        <main className="flex-1 p-6">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <HelpCircle className="w-7 h-7 text-blue-500" />
              Help & Support Center
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Need assistance? Find instructions, answers, or submit an issue below.
            </p>
          </div>

          {/* Instructions */}
          <section className="mb-10 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
              <Info className="w-5 h-5 text-blue-600" /> Getting Started
            </h2>
            <ul className="list-disc space-y-2 text-gray-700 pl-6">
              <li>Download and install the tracker from the dashboard.</li>
              <li>Log in with your assigned team credentials.</li>
              <li>Ensure the app is running in the background.</li>
              <li>View reports under “Productivity” or “Activity Log”.</li>
              <li>Use filters for team, user, and time-based insights.</li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="mb-10 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
              <MessageSquare className="w-5 h-5 text-blue-600" /> Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800">🔐 Is user data private?</h4>
                <p className="text-gray-600 text-sm ml-2">Yes, data is securely encrypted and only visible to admins.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">🔑 How do I reset my password?</h4>
                <p className="text-gray-600 text-sm ml-2">Navigate to Settings → Profile → Reset Password or contact your admin.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">⚠️ Why isn’t activity being recorded?</h4>
                <p className="text-gray-600 text-sm ml-2">Ensure the app is running and connected to the internet. Restart if needed.</p>
              </div>
            </div>
          </section>

          {/* Support Form */}
          <section className="mb-10 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
              <Mail className="w-5 h-5 text-blue-600" /> Contact Support
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-blue-400 focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-blue-400 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Describe your issue</label>
                <textarea
                  name="issue"
                  rows={4}
                  value={formData.issue}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-blue-400 focus:outline-none"
                  placeholder="Describe the issue you are facing..."
                />
              </div>
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Helpful Resources</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>
                    📄 <a href="/docs/getting-started" className="text-blue-600 hover:underline">Getting Started Guide</a>
                    </li>
                    <li>
                    🎥 <a href="https://www.youtube.com/@ActiveTrackSupport" className="text-blue-600 hover:underline" target="_blank">Watch Video Tutorials</a>
                    </li>
                    <li>
                    💬 <a href="https://chat.active-track.com" className="text-blue-600 hover:underline" target="_blank">Join our Community Chat</a>
                    </li>
                    <li>
                    ❓ <a href="/docs/faq" className="text-blue-600 hover:underline">Explore the FAQ Center</a>
                    </li>
                </ul>
                </div>

              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Send className="w-4 h-4" />
                Submit Issue
              </button>
            </form>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
