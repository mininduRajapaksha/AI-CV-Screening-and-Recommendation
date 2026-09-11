// src/pages/ForgotPassword.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import SidePanel from '../components/SidePanel';
import './AuthPages.css';

const ForgotPassword = () => {
  return (
    <div className="auth-container">
      <SidePanel />
      <div className="form-section">
        <div className="form-card" style={{ textAlign: 'center' }}>
          <div className="form-header">
            <h2>Forgot Password?</h2>
            <p>No worries! Enter your work email and we will send you a reset link.</p>
          </div>

          <form>
            <div className="input-group" style={{ textAlign: 'left' }}>
              <label>Work Email Address <span>*</span></label>
              <input type="email" placeholder="e.g. minindu.r@claritydental.com" required />
            </div>

            <button type="submit" className="btn-primary">Send Reset Link</button>
          </form>

          <p className="bottom-text" style={{ marginTop: '20px' }}>
            <Link to="/" style={{ color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              ← Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;