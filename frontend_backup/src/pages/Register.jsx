import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SidePanel from '../components/SidePanel';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex w-full max-w-6xl h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl mx-auto my-auto">
      <SidePanel />

      {/* Form Section */}
      <div className="flex-1 flex justify-center items-center bg-gray-50 p-6 overflow-y-auto">
        <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-lg my-4">

          {/* Header */}
          <div className="text-center mb-6">
            <img 
              src="/logo-small.png" 
              alt="Logo" 
              className="w-16 h-16 mx-auto mb-3 object-contain"
            />
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-sm text-gray-500 mt-1">
              Join TalentFlow to start managing active candidates
            </p>
          </div>

          <form>
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Minindu Ratnayake"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Choose password"
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 text-xs"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat password"
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  />
                  <span
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 text-xs"
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Primary Workspace Role <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition bg-white"
              >
                <option value="">Select Role</option>
                <option value="hr">HR Manager</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Terms */}
            <div className="mb-5">
              <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" required className="mt-0.5 accent-primary" />
                <span>
                  I agree to TalentFlow's{' '}
                  <span className="text-primary font-medium">Terms of Service</span> and{' '}
                  <span className="text-primary font-medium">Privacy Policy</span>
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-dark text-white rounded-lg font-semibold hover:bg-black transition"
            >
              Create Account
            </button>
          </form>

          {/* Bottom Text */}
          <p className="text-center mt-5 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-red-500 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;