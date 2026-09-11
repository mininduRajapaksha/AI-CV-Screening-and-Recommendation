// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SidePanel from '../components/SidePanel';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './AuthPages.css'; 

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-container">
      <SidePanel />
      <div className="form-section">
        <div className="form-card">
          <div className="form-header">
            <img src="/path-to-small-logo.png" alt="Logo" className="small-logo" />
            <h2>Welcome Back</h2>
            <p>Access your recruitment and talent workspace</p>
          </div>

          <form>
            <div className="input-group">
              <label>Work Email Address <span>*</span></label>
              <input type="email" placeholder="minindu.r@claritydental.com" required />
            </div>

            <div className="input-group">
              <label>Password <span>*</span></label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••" 
                  required 
                />
                <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember this device
              </label>
              <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
            </div>

            <button type="submit" className="btn-primary">Sign In</button>

            <div className="divider">or continue with</div>

            <button type="button" className="btn-secondary">
              <span>G</span> Single Sign-On (SSO)
            </button>
          </form>

          <p className="bottom-text">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;