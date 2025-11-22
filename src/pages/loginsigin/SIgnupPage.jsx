import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    organization: "",
    business_email: "",
    password: "",
    country: "",
    agreeTerms: false,
  });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [organizationId, setOrganizationId] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/signup/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          organization: formData.organization,
          business_email: formData.business_email,
          password: formData.password,
          country: formData.country,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        // Save organization_id for OTP verification
        const orgId = result.organization_id;
        setOrganizationId(orgId);
        localStorage.setItem("organization_id", orgId);

        setMessage("✅ Signup successful. OTP sent to your email.");
        setShowOtpInput(true);
      } else {
        setMessage(`❌ Signup failed: ${result.detail || "Unexpected error"}`);
      }
    } catch {
      setMessage("❌ Server error. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const orgId =
        organizationId || localStorage.getItem("organization_id");

      const response = await fetch(`${API_BASE_URL}/signup/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_id: parseInt(orgId),
          otp: parseInt(otp),
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessage("✅ Verified successfully!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage(`❌ OTP verification failed: ${data.detail || "Invalid OTP"}`);
      }
    } catch {
      setMessage("❌ Server error during OTP verification.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side info */}
      <div className="w-1/2 bg-[#1A73E8] text-white flex flex-col justify-center p-10">
        <h1 className="text-4xl font-bold mb-4">The Visibility Every Organization Needs</h1>
        <p className="mb-6 text-lg">
          Increase productivity & engagement with insights into how work gets done.
        </p>
        <ul className="space-y-3">
          {[
            "Measure productivity and workload trends across teams",
            "Compare in-office vs. remote productivity",
            "Identify quiet quitting and burnout risk",
            "Understand technology adoption and utilization",
            "Respect privacy — no keystroke logging or video capture",
          ].map((point, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-2 text-green-300">✔</span> {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Right side form */}
      <div className="w-1/2 flex items-center justify-center bg-white p-10">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-2">Create a Free Account</h2>
          <p className="text-center text-gray-500 mb-6">Setup in Minutes | No Credit Card Required</p>

          {!showOtpInput ? (
            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <input
                    id="first_name"
                    type="text"
                    placeholder="First Name *"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <input
                    id="last_name"
                    type="text"
                    placeholder="Last Name *"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <input
                id="phone_number"
                type="text"
                placeholder="Phone Number *"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />

              <input
                id="organization"
                type="text"
                placeholder="Organization *"
                value={formData.organization}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />

              <input
                id="business_email"
                type="email"
                placeholder="Business Email *"
                value={formData.business_email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />

              <input
                id="password"
                type="password"
                placeholder="Password *"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />

              <select
                id="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Country *</option>
                <option value="Pakistan">Pakistan</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
              </select>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="agreeTerms" className="text-sm">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 underline">Terms of Service</a> and{" "}
                  <a href="#" className="text-blue-600 underline">Privacy Policy</a>.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
              >
                Sign Up
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleVerifyOtp}>
              <input
                type="number"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
              >
                Verify OTP
              </button>
            </form>
          )}

          {message && (
            <p className="mt-4 text-center text-sm text-red-600">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
