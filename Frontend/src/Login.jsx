import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from './components/Toast';
import { authAPI } from './services/api';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loggingEnabled] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Helpers for logging input activity. Passwords are masked.
  function maskPassword(value){
    return '*'.repeat(value.length) + ` (${value.length})`;
  }

  function logInput(field, value){
    if(!loggingEnabled) return;
    if(field.toLowerCase().includes('pass')){
      console.log(`[INPUT] ${field}:`, maskPassword(value));
    } else {
      console.log(`[INPUT] ${field}:`, value);
    }
  }

  function logClear(field, prev){
    if(!loggingEnabled) return;
    if(field.toLowerCase().includes('pass')){
      console.log(`[CLEARED] ${field}:`, maskPassword(prev));
    } else {
      console.log(`[CLEARED] ${field}:`, prev);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    // final validation before submit
    const err = validatePasswordLogin(password);
    if (err) {
      setPasswordError(err);
      return;
    }
    
    // Call login API
    authAPI.login(email, password)
      .then(response => {
        // Store token and user info
        localStorage.setItem('token', response.token);
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userFirstName', response.user.firstName || '');
        localStorage.setItem('userLastName', response.user.lastName || '');
        localStorage.setItem('userPhone', response.user.phone || '');
        localStorage.setItem('userLocation', response.user.location || '');
        
        setIsLoggedIn(true);
        setToast({ message: 'Login Successful! Redirecting...', type: 'success' });
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      })
      .catch(error => {
        setToast({ message: error.message || 'Login failed. Please try again.', type: 'error' });
        console.error('Login error:', error);
      });
  }

  function validatePasswordLogin(pw) {
    if (!pw || pw.length < 6) return 'Password must be at least 6 characters.';
    return '';
  }

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-1 items-center justify-center bg-[#faf8f6] animate-[slideInLeft_0.8s_ease-out]">
        <div className="w-[360px] p-9 pl-8 border-l-8 border-[#e6e6e6] bg-white shadow-lg animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
          <h2 className="text-[20px] font-bold text-left mb-6 text-cleanWarm animate-[fadeInUp_0.7s_ease-out_0.3s_both]">Login to Your Account</h2>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="block mt-3 mb-1 text-[#666] text-[13px]">Email*</label>
            <input
              type="email"
              className="w-full p-2.5 border border-[#ddd] rounded-md bg-white text-[14px] focus:outline-cleanBrown animate-[fadeInUp_0.6s_ease-out_0.4s_both]"
              value={email}
              onChange={e => {
                const v = e.target.value;
                if(v === '' && email !== '') logClear('Email', email);
                else logInput('Email', v);
                setEmail(v);
              }}
              required
            />
            <label className="block mt-3 mb-1 text-[#666] text-[13px]">Password*</label>
            <div className="flex gap-2 items-center mb-1 animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
              <input
                type={show ? 'text' : 'password'}
                className={`flex-1 p-2.5 border rounded-md bg-white text-[14px] focus:outline-cleanBrown ${passwordError ? 'border-red-500' : 'border-[#ddd]'}`}
                value={password}
                onChange={e => {
                  const v = e.target.value;
                  if (v === '' && password !== '') logClear('Password', password);
                  else logInput('Password', v);
                  setPassword(v);
                  const err = validatePasswordLogin(v);
                  setPasswordError(err);
                }}
                required
              />
              <button 
                type="button"
                onClick={() => setShow(!show)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            <div className="flex justify-between items-center mt-2 mb-4 text-[13px] animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
              <label className="flex items-center gap-2 text-[#666]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a className="text-[#777] hover:underline" href="#">Forgot Password?</a>
            </div>
            <button
              className="w-full bg-cleanBrown text-white p-2.5 rounded-md mt-1 font-semibold cursor-pointer animate-[fadeInUp_0.7s_ease-out_0.6s_both] shadow-md hover:bg-[#a05e2e] transition-colors"
              type="submit"
            >
              Log In
            </button>
          </form>
          <p className="text-[#777] text-center mt-5 text-[13px] animate-[fadeInUp_0.7s_ease-out_0.6s_both]">
            Don't Have an Account?{' '}
            <Link
              to="/signup"
              className="text-[#6b6b6b] hover:underline"
            >
              Sign Up
            </Link>
          </p>
          <p className="text-center mt-4">
            <Link to="/dashboard" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
      <div className="flex-1 bg-right-image bg-cover bg-center animate-[slideInRight_0.8s_ease-out]" aria-hidden="true"></div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Login;
