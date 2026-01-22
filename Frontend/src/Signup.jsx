import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from './components/Toast';
import { authAPI } from './services/api';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState(''); 
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [loggingEnabled] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Logging helpers
  function logInput(label, value) {
    if (loggingEnabled) {
      if (label.toLowerCase().includes('password')) {
        console.log(`${label}:`, '*'.repeat(value.length));
      } else {
        console.log(`${label}:`, value);
      }
    }
  }
  function logClear(label, value) {
    if (loggingEnabled) {
      console.log(`${label} cleared (was: ${label.toLowerCase().includes('password') ? '*'.repeat(value.length) : value})`);
    }
  }

  function validatePasswordSignup(pw) {
    if (!pw || pw.length < 8) return 'Password must be at least 8 characters.';
    if (!/[a-z]/.test(pw)) return 'Password must include a lowercase letter.';
    if (!/[A-Z]/.test(pw)) return 'Password must include an uppercase letter.';
    if (!/[0-9]/.test(pw)) return 'Password must include a number.';
    if (!/[!@#\$%\^&\*(),.?":{}|<>]/.test(pw)) return 'Password must include a special character.';
    return '';
  }

  function handleSubmit(e) {
    e.preventDefault();
    // final validations
    const pErr = validatePasswordSignup(password);
    const cErr = password === confirm ? '' : 'Passwords do not match.';
    setPasswordError(pErr);
    setConfirmError(cErr);
    if (pErr || cErr) return;

    // Call signup API
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role
    };

    authAPI.signup(userData)
      .then(response => {
        setToast({ message: 'Account Created Successfully! Redirecting to login...', type: 'success' });
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      })
      .catch(error => {
        setToast({ message: error.message || 'Signup failed. Please try again.', type: 'error' });
        console.error('Signup error:', error);
      });
  }

  return (
    <div className="flex h-screen w-full">
      {/* Image on left */}
      <div className="flex-1 bg-right-image bg-cover bg-center animate-fadeIn" aria-hidden="true"></div>
      {/* Form on right with pop-up animation */}
      <div className="flex flex-1 items-center justify-center bg-[#faf8f6] animate-fadeIn">
        <div className="w-[360px] p-9 pl-8 border-l-8 border-[#e6e6e6] bg-white shadow-lg animate-popUp">
          <h2 className="text-[20px] font-bold text-left mb-6 text-cleanWarm animate-fadeIn">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* First + Last name row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mt-3 mb-1 text-[#666] text-[13px]">First Name*</label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-[#ddd] rounded-md bg-white text-[14px] focus:outline-cleanBrown animate-[fadeInUp_0.6s_ease-out_0.4s_both]"
                  value={firstName}
                  onChange={e => {
                    const v = e.target.value;
                    if (v === '' && firstName !== '') logClear('First Name', firstName);
                    else logInput('First Name', v);
                    setFirstName(v);
                  }}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block mt-3 mb-1 text-[#666] text-[13px]">Last Name*</label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-[#ddd] rounded-md bg-white text-[14px] focus:outline-cleanBrown animate-[fadeInUp_0.6s_ease-out_0.4s_both]"
                  value={lastName}
                  onChange={e => {
                    const v = e.target.value;
                    if (v === '' && lastName !== '') logClear('Last Name', lastName);
                    else logInput('Last Name', v);
                    setLastName(v);
                  }}
                  required
                />
              </div>
            </div>

            <label className="block mt-3 mb-1 text-[#666] text-[13px]">Email*</label>
            <input
              type="email"
              className="w-full p-2.5 border border-[#ddd] rounded-md bg-white text-[14px] focus:outline-cleanBrown animate-[fadeInUp_0.6s_ease-out_0.4s_both]"
              value={email}
              onChange={e => {
                const v = e.target.value;
                if (v === '' && email !== '') logClear('Email', email);
                else logInput('Email', v);
                setEmail(v);
              }}
              required
            />

            {/* Role Dropdown */}
            <label className="block mt-3 mb-1 text-[#666] text-[13px]">Role*</label>
            <select
              className="w-full p-2.5 border border-[#ddd] rounded-md bg-white text-[14px] focus:outline-cleanBrown animate-[fadeInUp_0.6s_ease-out_0.4s_both]"  
              value={role}
              onChange={e => {
                const v = e.target.value;
                logInput('Role', v);
                setRole(v);
              }}
              required
            >
              <option value="">Select Role</option>
              <option value="User">User</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Admin">Admin</option>
            </select>

            <label className="block mt-3 mb-1 text-[#666] text-[13px]">Password*</label>
            <input
              type="password"
              className={`w-full p-2.5 border rounded-md bg-white text-[14px] focus:outline-cleanBrown animate-[fadeInUp_0.6s_ease-out_0.4s_both] ${passwordError ? 'border-red-500' : 'border-[#ddd]'}`}
              value={password}
              onChange={e => {
                const v = e.target.value;
                if (v === '' && password !== '') logClear('Password', password);
                else logInput('Password', v);
                setPassword(v);
                const err = validatePasswordSignup(v);
                setPasswordError(err);
                if (confirm) setConfirmError(v === confirm ? '' : 'Passwords do not match.');
              }}
              required
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            <label className="block mt-3 mb-1 text-[#666] text-[13px]">Confirm Password*</label>
            <input
              type="password"
              className={`w-full p-2.5 border rounded-md bg-white text-[14px] focus:outline-cleanBrown animate-[fadeInUp_0.6s_ease-out_0.4s_both] ${confirmError ? 'border-red-500' : 'border-[#ddd]'}`}
              value={confirm}
              onChange={e => {
                const v = e.target.value;
                if (v === '' && confirm !== '') logClear('Confirm Password', confirm);
                else logInput('Confirm Password', v);
                setConfirm(v);
                setConfirmError(v === password ? '' : 'Passwords do not match.');
              }}
              required
            />
            {confirmError && <p className="text-red-500 text-sm mt-1">{confirmError}</p>}
            <button
              className="w-full bg-cleanBrown text-white p-2.5 rounded-md mt-4 font-semibold cursor-pointer  shadow-md hover:bg-[#a05e2e] transition-colors"
              type="submit"
            >
              Sign Up
            </button>
          </form>
          <p className="text-[#777] text-center mt-5 text-[13px] animate-[fadeInUp_0.7s_ease-out_0.6s_both]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#6b6b6b] hover:underline"
            >
              Log In
            </Link>
          </p>
          <p className="text-center mt-4">
            <Link to="/dashboard" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Signup;
