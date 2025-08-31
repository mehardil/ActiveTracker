import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/Layout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:9900/login/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert("Login failed: " + (errorData.detail || response.statusText));
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (result.success) {
        // Save token & user details
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // ✅ Redirect with user data available in localStorage
        navigate("/productivity");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
      alert("Unable to reach server. Please check backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 py-8 px-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-2xl rounded-3xl border border-gray-100">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Log in to your account to continue
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Username
              </label>
              <input
                type="text"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
                placeholder="Enter your username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  id="remember"
                />
                <label htmlFor="remember" className="ml-2 text-gray-700">
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-blue-500 hover:text-blue-700 transition font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white font-bold rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 mt-2`}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="flex flex-col items-center gap-2 mt-4">
            <span className="text-gray-500 text-sm">
              Don't have an account?
            </span>
            <Link
              to="/signup"
              className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
