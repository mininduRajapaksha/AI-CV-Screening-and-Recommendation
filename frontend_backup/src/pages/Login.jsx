import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SidePanel from '../components/SidePanel';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex w-full max-w-6xl h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl mx-auto my-auto">
      <SidePanel />

      {/* Form Section */}
      <div className="flex-1 flex justify-center items-center bg-gray-50 p-6">
        <div className="bg-white p-10 rounded-2xl w-full max-w-md shadow-lg">

          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src="/logo-small.png" 
              alt="Logo" 
              className="w-16 h-16 mx-auto mb-4 object-contain"
            />
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-1">
              Access your recruitment and talent workspace
            </p>
          </div>

          <form>
            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="minindu.r@claritydental.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Options */}
            <div className="flex justify-between items-center mb-6 text-sm">
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input type="checkbox" className="accent-primary" />
                Remember this device
              </label>
              <Link to="/forgot-password" className="text-red-500 font-medium hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-3 bg-dark text-white rounded-lg font-semibold hover:bg-black transition"
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="flex items-center my-5">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-xs text-gray-400">or continue with</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* SSO Button */}
            <button
              type="button"
              className="w-full py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <span className="font-bold">G</span> Single Sign-On (SSO)
            </button>
          </form>

          {/* Bottom Text */}
          <p className="text-center mt-6 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-500 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;