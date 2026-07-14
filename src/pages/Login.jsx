import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  GraduationCap, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  BookOpen, 
  Cpu, 
  TrendingUp, 
  ChevronDown 
} from 'lucide-react';
import apiClient from '../api/client';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Active view: 'login' | 'forgot' | 'reset'
  const [viewState, setViewState] = useState('login');
  
  // Credentials input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP Reset states
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Loading & notification states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle credentials login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password OTP request submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await apiClient.post('/api/auth/forgot-password', { email });
      setSuccessMsg(res.data.message || 'OTP reset code sent to your email.');
      setViewState('reset');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || err.response?.data?.message || 'Failed to request OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password OTP verify submit
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await apiClient.post('/api/auth/reset-password', {
        email,
        code: resetCode,
        new_password: newPassword
      });
      setSuccessMsg(res.data.message || 'Password updated successfully.');
      setViewState('login');
      setPassword('');
      setNewPassword('');
      setResetCode('');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f8fafc] font-sans antialiased">
      
      {/* ──────────────────────────────────────────────────────── */}
      {/* LEFT PANEL: Branding & Checklist (Desktop Only)          */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[48%] flex-col justify-between p-12 bg-gradient-to-tr from-[#f0fdfa] via-[#f8fafc] to-[#ffffff] relative overflow-hidden select-none border-r border-[#e2e8f0]/40">
        
        {/* Top-Left Dot Matrix Decoration */}
        <div className="absolute top-8 left-8 opacity-45">
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 6 }).map((_, c) => (
                <circle key={`${r}-${c}`} cx={5 + c * 10} cy={5 + r * 10} r="1.5" fill="#0d9488" />
              ))
            )}
          </svg>
        </div>

        {/* Logo Header */}
        <div className="flex items-center gap-3.5 mt-4 relative z-10">
          <img src="/nobeth-logo.png" alt="Nobeth AI Tutor" className="w-10 h-10 object-contain shrink-0 rounded-lg shadow-sm border border-slate-100" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800 leading-none">Nobeth</h2>
            <p className="text-xs font-bold text-[#0d9488] mt-1 uppercase tracking-wide">AI Tutor</p>
          </div>
        </div>

        {/* Brand Descriptions */}
        <div className="max-w-md mt-12 mb-6 flex flex-col gap-6 relative z-10 pl-2">
          <h1 className="text-[38px] font-extrabold text-slate-800 leading-[46px] tracking-tight">
            Your AI Learning <br />
            Companion for <span className="text-[#0d9488]">NCERT</span>
          </h1>
          <div className="w-14 h-1 bg-[#0d9488] rounded-full -mt-2" />
          <p className="text-sm text-slate-500 leading-relaxed font-semibold">
            Nobeth AI Tutor helps you learn better with accurate answers, clear explanations, and trusted NCERT content.
          </p>

          {/* Feature List (4 items matching mockup styles) */}
          <div className="flex flex-col gap-5 mt-3">
            {[
              { title: 'NCERT Focused', desc: 'Get answers strictly from NCERT books.', icon: BookOpen },
              { title: 'AI Powered', desc: 'Advanced AI explains concepts in a simple way.', icon: Cpu },
              { title: 'Accurate & Reliable', desc: 'Cited sources with page numbers you can trust.', icon: ShieldCheck },
              { title: 'Track Your Progress', desc: 'Learn consistently and improve every day.', icon: TrendingUp }
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#f0fdfa] text-[#0d9488] shrink-0 flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 leading-snug">{feat.title}</h4>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lower Left Illustration: PNG stack of books */}
        <div className="w-full flex justify-start items-end select-none mt-auto pt-6 z-10">
          <img src="/books-illustration.png" alt="NCERT Books" className="w-[280px] h-auto object-contain" />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-[52%] flex items-center justify-center p-6 md:p-12 lg:p-20 relative"
      >
        
        {/* Main Card */}
        <motion.div 
          layout
          className="w-full max-w-[480px] bg-white border border-[#e2e8f0]/60 rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.015)]"
        >
          
          {/* Banner notification alerts */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold">
              {successMsg}
            </div>
          )}

          <AnimatePresence mode="wait">
            
            {/* VIEW 1: Standard Credentials Login */}
            {viewState === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6"
              >
                
                {/* Header row with Graduation cap illustration */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-[28px] font-extrabold text-slate-800 tracking-tight leading-9">Welcome back!</h2>
                    <p className="text-slate-400 text-xs mt-1.5 font-bold">Login to continue your learning journey.</p>
                  </div>
                  
                  {/* Graduation Book Cap SVG */}
                  <div className="w-20 h-20 rounded-full bg-[#f0fdfa] flex items-center justify-center shrink-0 relative overflow-visible shadow-sm">
                    <svg className="w-12 h-12 relative z-10" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="16" y="38" width="32" height="8" rx="2" fill="#0d9488" opacity="0.8" />
                      <rect x="18" y="44" width="28" height="4" rx="1" fill="#0f766e" />
                      <path d="M18 41H44V44H18V41Z" fill="#ccfbf1" />
                      <path d="M32 16L12 25L32 34L52 25L32 16Z" fill="#0d9488" />
                      <path d="M19 28.5V36C19 39.5 24.8 41 32 41C39.2 41 45 39.5 45 36V28.5" fill="#115e59" />
                      <path d="M42 25.5V33.5C42 34.5 42.5 35 43.5 35C44.5 35 45 34.5 45 33.5V25.5" stroke="#0f766e" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="43.5" cy="35" r="1.5" fill="#ffd700" />
                      <path d="M10 18L11 15L14 14L11 13L10 10L9 13L6 14L9 15L10 18Z" fill="#22c55e" opacity="0.7" />
                      <path d="M54 36L55 33L58 32L55 31L54 28L53 31L50 32L53 33L54 36Z" fill="#38bdf8" opacity="0.8" />
                    </svg>
                  </div>
                </div>

                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5 mt-2">
                  
                  {/* Email address field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                    <div className="relative flex items-center">
                      <Mail className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#cbd5e1]/70 focus:border-[#0d9488] focus:ring-4 focus:ring-[#0d9488]/10 rounded-2xl text-sm font-semibold transition-all duration-200 outline-none text-slate-700 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
                      <button
                        type="button"
                        onClick={() => setViewState('forgot')}
                        className="text-xs font-bold text-[#0d9488] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <Lock className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#cbd5e1]/70 focus:border-[#0d9488] focus:ring-4 focus:ring-[#0d9488]/10 rounded-2xl text-sm font-semibold transition-all duration-200 outline-none text-slate-700 placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submission Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01, boxShadow: '0 10px 25px -8px rgba(13,148,136,0.3)' }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full bg-[#0d9488] hover:bg-[#0f766e] disabled:bg-indigo-300 text-white font-bold py-4 rounded-2xl text-sm shadow-lg shadow-[#0d9488]/20 transition-all duration-200 cursor-pointer text-center mt-3"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* VIEW 2: Forgot Password OTP Request */}
            {viewState === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-[28px] font-extrabold text-slate-800 tracking-tight leading-9">Forgot Password?</h2>
                  <p className="text-slate-400 text-xs mt-1.5 font-bold">Enter your registered email and we will send an OTP code.</p>
                </div>

                <form onSubmit={handleForgotSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                    <div className="relative flex items-center">
                      <Mail className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#cbd5e1]/70 focus:border-[#0d9488] focus:ring-4 focus:ring-[#0d9488]/10 rounded-2xl text-sm font-semibold transition-all duration-200 outline-none text-slate-700 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01, boxShadow: '0 10px 25px -8px rgba(13,148,136,0.3)' }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full bg-[#0d9488] hover:bg-[#0f766e] disabled:bg-indigo-300 text-white font-bold py-4 rounded-2xl text-sm shadow-lg shadow-[#0d9488]/20 transition-all duration-200 cursor-pointer text-center"
                  >
                    {loading ? 'Requesting OTP...' : 'Send Reset Code'}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => setViewState('login')}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors duration-150 py-1 cursor-pointer self-center"
                  >
                    Back to Login
                  </button>
                </form>
              </motion.div>
            )}

            {/* VIEW 3: Reset Password Verification */}
            {viewState === 'reset' && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-[28px] font-extrabold text-slate-800 tracking-tight leading-9">Reset Password</h2>
                  <p className="text-slate-400 text-xs mt-1.5 font-bold">Verify the OTP code sent to your inbox and set a new password.</p>
                </div>

                <form onSubmit={handleResetSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Resetting for</label>
                    <input
                      type="text"
                      disabled
                      value={email}
                      className="w-full px-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-bold text-slate-500 cursor-not-allowed outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">OTP Verification Code</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter 6-digit OTP code"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      className="w-full px-4 py-3.5 bg-white border border-[#cbd5e1]/70 focus:border-[#0d9488] focus:ring-4 focus:ring-[#0d9488]/10 rounded-2xl text-sm font-bold tracking-wider transition-all duration-200 outline-none text-slate-700 text-center"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">New Password</label>
                    <div className="relative flex items-center">
                      <Lock className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#cbd5e1]/70 focus:border-[#0d9488] focus:ring-4 focus:ring-[#0d9488]/10 rounded-2xl text-sm font-semibold transition-all duration-200 outline-none text-slate-700 placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01, boxShadow: '0 10px 25px -8px rgba(13,148,136,0.3)' }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full bg-[#0d9488] hover:bg-[#0f766e] disabled:bg-indigo-300 text-white font-bold py-4 rounded-2xl text-sm shadow-lg shadow-[#0d9488]/20 transition-all duration-200 cursor-pointer text-center"
                  >
                    {loading ? 'Resetting Password...' : 'Verify and Save'}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => setViewState('login')}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors duration-150 py-1 cursor-pointer self-center"
                  >
                    Cancel and Return
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Secure & Private Indicator Dividers */}
          <div className="mt-8 pt-6 border-t border-[#f1f5f9] select-none">
            <div className="flex items-center justify-center gap-3">
              <div className="flex-1 border-t border-[#e2e8f0]/70" />
              <div className="flex items-center gap-1.5 text-slate-400 font-extrabold text-[11px] uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-[#0d9488] stroke-[2.5]" />
                <span>Secure & Private</span>
              </div>
              <div className="flex-1 border-t border-[#e2e8f0]/70" />
            </div>
            
            <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-slate-400 font-semibold text-center">
              <ShieldCheck className="w-4 h-4 text-[#0d9488] stroke-[2]" />
              <span>Your data is safe with us and will never be shared.</span>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
