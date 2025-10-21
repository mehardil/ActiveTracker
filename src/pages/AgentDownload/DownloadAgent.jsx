import React, { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { Mail } from "lucide-react";

export default function DownloadAgent() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState(""); // ✅ State for generated link

  const baseUrl =
    process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:9900/";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Send Email API
  const handleShareEmail = async () => {
    if (!email) return alert("Please enter an email address!");
    if (!selectedAgent) return alert("Please select an agent platform!");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ User not authenticated.");
        return;
      }

      const response = await fetch(
        `${baseUrl}downloadagent/download-agent-email/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            source: selectedAgent.toLowerCase(),
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("✅ Email sent successfully!");
        setEmail("");
        setSelectedAgent("");
      } else {
        alert(
          `❌ Failed: ${data.detail || data.message || "Something went wrong"}`
        );
      }
    } catch (error) {
      console.error("Email API Error:", error);
      alert("❌ Unable to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Download Agent
  const handleDownload = async (platform) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ User not authenticated.");
        return;
      }

      const res = await fetch(`${baseUrl}downloadagent/download-agent-click/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ source: platform.toLowerCase() }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Download failed:", err);
        alert(`❌ Failed: ${err.detail || "Something went wrong"}`);
        return;
      }

      const blob = await res.blob();
      const filename =
        platform.toLowerCase() === "windows"
          ? "activtrak-agent-installer.exe"
          : platform.toLowerCase() === "macs"
          ? "activtrak-agent-macos.pkg"
          : "activtrak-agent-linux.deb";

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download Error:", error);
      alert("❌ Failed to download the agent.");
    }
  };

  // ✅ Generate Click Link & Show in Input
  const handleGenerateClick = async (platform) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ User not authenticated.");
        return;
      }

      const res = await fetch(`${baseUrl}downloadagent/generate_agent_link/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ source: platform.toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Generate click failed:", data);
        alert(`❌ Failed: ${data.detail || "Something went wrong"}`);
        return;
      }

      const link = data.url;
      setGeneratedLink(link);

      // Auto copy
      await navigator.clipboard.writeText(link);
      alert(`✅ Link generated & copied to clipboard!`);
    } catch (error) {
      console.error("Generate Click Error:", error);
      alert("❌ Failed to generate link.");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-60 fixed top-0 left-0 h-screen z-10">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 ml-60 min-h-screen flex flex-col bg-gray-50">
        <Header
          title="Download Agent"
          userInitial={user?.username?.[0]?.toUpperCase() || "U"}
        />

        {/* Main Section */}
        <main className="flex-1 p-10 text-gray-800 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-10 space-y-8 border border-gray-100">
            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-indigo-600">
                🚀 Ready to see your data? Download the Agent
              </h1>
              <p className="text-gray-600">
                Choose your platform below to install the agent and start
                tracking workforce activity efficiently.
              </p>
            </div>

            {/* ✅ Download Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <button
                onClick={() => handleDownload("windows")}
                className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold shadow transition"
              >
                🪟 Download for Windows
              </button>

              <button
                onClick={() => handleDownload("macs")}
                className="bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-xl font-semibold shadow transition"
              >
                🍎 Download for macOS
              </button>

              <button
                onClick={() => handleDownload("linux")}
                className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold shadow transition"
              >
                🐧 Download for Linux
              </button>
            </div>

            {/* ✅ Generate Link */}
            <div className="mt-10 border-t pt-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                🔗 Generate Download Link
              </h2>

              {/* Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <button
                  onClick={() => handleGenerateClick("windows")}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold shadow transition"
                >
                  🪟 Generate Windows Link
                </button>
                <button
                  onClick={() => handleGenerateClick("macs")}
                  className="bg-gray-700 hover:bg-gray-800 text-white py-4 rounded-xl font-semibold shadow transition"
                >
                  🍎 Generate macOS Link
                </button>
                <button
                  onClick={() => handleGenerateClick("linux")}
                  className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold shadow transition"
                >
                  🐧 Generate Linux Link
                </button>
              </div>

              {/* Show Generated Link */}
              {generatedLink && (
                <div className="flex items-center gap-3 mt-4">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="flex-1 border border-indigo-300 rounded-lg px-4 py-3 text-gray-700 bg-indigo-50 font-mono text-sm focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLink);
                      alert("✅ Link copied to clipboard!");
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                  >
                    Copy
                  </button>
                </div>
              )}

              <p className="text-sm text-gray-500">
                ⚡ A one-time download link will be generated and shown here. You can copy it to share.
              </p>
            </div>

            {/* ✅ Share by Email */}
            <div className="mt-10 border-t pt-6 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                <Mail size={22} /> Share via Email
              </h2>

              {/* Agent Selection */}
              <div className="flex flex-wrap gap-4">
                {["Windows", "macs", "Linux"].map((platform) => (
                  <label
                    key={platform}
                    className={`cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-lg transition ${
                      selectedAgent === platform
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-300 hover:border-indigo-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="agent"
                      value={platform}
                      checked={selectedAgent === platform}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      className="accent-indigo-600"
                    />
                    <span className="font-medium">{platform}</span>
                  </label>
                ))}
              </div>

              {/* Email Input */}
              <div className="flex gap-3 mt-4">
                <input
                  type="email"
                  placeholder="Enter recipient email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleShareEmail}
                  disabled={loading}
                  className={`${
                    loading
                      ? "bg-indigo-400"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white px-8 py-3 rounded-lg font-semibold transition`}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>

              <p className="text-sm text-gray-500">
                📩 The recipient will receive a download link for the selected agent.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
