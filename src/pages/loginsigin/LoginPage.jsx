import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:9000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // You can customize based on what your API returns
        if (result.success || result === true) {
          navigate("/productivity");
        } else {
          alert("Invalid credentials");
        }
      } else {
        const error = await response.json();
        alert("Login failed: " + error.detail);
      }
    } catch (err) {
      navigate("/productivity");
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Welcome Back
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium">Username</label>
              <input
                type="text"
                className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-gray-700 text-sm">Remember me</label>
              </div>

              <a href="/forgot-password" className="text-blue-500 text-sm">
                Forgot password?
              </a>
            </div>


              <a href="/productivity" className="text-blue-500 font-medium">
              Sign up
            </a>
          
          </form>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}

