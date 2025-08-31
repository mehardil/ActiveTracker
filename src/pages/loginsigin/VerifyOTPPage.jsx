import React, { useState } from 'react';

export default function RegisterAndVerify() {
  const [orgName, setOrgName] = useState('');
  const [orgId, setOrgId] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:9900/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgName }),
      });

      const data = await response.json();
      if (response.ok) {
        setOrgId(data.id);
        localStorage.setItem('org_id', data.id);
        setMessage('✅ Organization registered. Enter OTP to verify.');
        setShowOtpInput(true);
      } else {
        setMessage(`❌ Registration failed: ${data.detail}`);
      }
    } catch (error) {
      setMessage('❌ Server error during registration.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:9900/signup/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ org_id: parseInt(orgId), otp: parseInt(otp) }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Organization verified successfully!');
        setShowOtpInput(false);
        localStorage.removeItem('org_id');
      } else {
        setMessage(`❌ OTP verification failed: ${data.detail || 'Invalid OTP'}`);
      }
    } catch (error) {
      setMessage('❌ Server error during OTP verification.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFC] py-20">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#0A2540]">
          Register Organization
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button type="submit" className="w-full bg-[#2C7BE5] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#1A68D4]">
            Register
          </button>
        </form>

        {/* OTP Form after registration */}
        {showOtpInput && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700">
              Verify OTP
            </button>
          </form>
        )}

        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
      </div>
    </div>
  );
}
