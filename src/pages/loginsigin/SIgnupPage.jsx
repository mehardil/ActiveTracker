import React from 'react';
import { Link } from 'react-router-dom';

const InputField = ({ label, type, id, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7BE5] focus:border-transparent"
      placeholder={placeholder}
    />
  </div>
);

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFC] py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-6 text-center">
            Create your account
          </h1>
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="First Name" type="text" id="firstName" placeholder="John" />
              <InputField label="Last Name" type="text" id="lastName" placeholder="Doe" />
            </div>
            <InputField label="Work Email" type="email" id="email" placeholder="you@company.com" />
            <InputField label="Password" type="password" id="password" placeholder="••••••••" />
            <InputField label="Company Name" type="text" id="company" placeholder="Acme Inc." />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-[#2C7BE5] focus:ring-[#2C7BE5] border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-[#2C7BE5] hover:text-[#1A68D4]">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#2C7BE5] hover:text-[#1A68D4]">
                  Privacy Policy
                </a>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-[#2C7BE5] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#1A68D4] transition-colors"
            >
              Create Account
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2C7BE5] hover:text-[#1A68D4] font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}