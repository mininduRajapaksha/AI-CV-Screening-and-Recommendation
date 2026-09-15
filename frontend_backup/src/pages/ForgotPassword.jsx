import React from 'react';
import { Link } from 'react-router-dom';
import SidePanel from '../components/SidePanel';

const ForgotPassword = () => {
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
            <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              No worries! Enter your work email and we will send you a reset link.
            </p>
          </div>

          <form>
            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. minindu.r@claritydental.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-dark text-white rounded-lg font-semibold hover:bg-black transition"
            >
              Send Reset Link
            </button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-red-500 font-medium text-sm inline-flex items-center gap-1 hover:underline"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;