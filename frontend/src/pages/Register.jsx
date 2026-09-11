// src/pages/Register.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import SidePanel from '../components/SidePanel';
import './AuthPages.css';

const Register = () => {
  return (
    <div className="auth-container">
      <SidePanel />
      <div className="form-section">
        <div className="form-card">
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Join TalentFlow to start managing active candidates</p>
          </div>

          <form>
            <div className="input-group">
              <label>Full Name <span>*</span></label>
              <input type="text" placeholder="e.g. Minindu Ratnayake" required />
            </div>

            <div className="input-group">
              <label>Work Email Address <span>*</span></label>
              <input type="email" placeholder="name@company.com" required />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Password <span>*</span></label>
                <input type="password" placeholder="Choose password" required />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Confirm Password <span>*</span></label>
                <input type="password" placeholder="Repeat password" required />
              </div>
            </div>

            <div className="input-group">
              <label>Your Primary Workspace Role <span>*</span></label>
              <select required>
                <option value="">Select Role</option>
                <option value="hr">HR Manager</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>

            <div className="form-options" style={{ marginBottom: '20px' }}>
              <label className="remember-me" style={{ fontSize: '12px' }}>
                <input type="checkbox" required /> I agree to TalentFlow's Terms of Service and Privacy Policy
              </label>
            </div>

            <button type="submit" className="btn-primary">Create Account</button>
          </form>

          <p className="bottom-text">
            Already have an account? <Link to="/">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;