import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import apiClient from '../api/client';
import { 
  User, 
  Lock, 
  Palette, 
  ShieldAlert, 
  Camera, 
  Eye, 
  EyeOff, 
  LogOut,
  Sparkles,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Trash2,
  Bell,
  Check,
  Laptop,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Settings = () => {
  const { currentUser, updateProfile, logout } = useAuth();
  
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile Form state
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email] = useState(currentUser?.email || '');
  const [grade, setGrade] = useState(currentUser?.studentClass?.grade || '8');
  
  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  // Appearance state (persisted locally)
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Sync theme changes to localStorage and document class
  React.useEffect(() => {
    localStorage.setItem('theme', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // Privacy & Security state
  const [mfaEnabled, setMfaEnabled] = useState(false);
  
  // Loading & status states
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingSecurity, setLoadingSecurity] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Confirmation Modals State
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showClearCacheModal, setShowClearCacheModal] = useState(false);

  // Sync form states when currentUser updates dynamically
  React.useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setGrade(currentUser.studentClass?.grade || '8');
    }
  }, [currentUser]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoadingProfile(true);
    try {
      await updateProfile(fullName);
      setSuccessMsg('Profile updated successfully.');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to update profile settings.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setLoadingPassword(true);
    try {
      const res = await apiClient.post('/api/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      setSuccessMsg(res.data.message || 'Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.response?.data?.error || 'Wrong current password.');
    } finally {
      setLoadingPassword(false);
    }
  };



  const handleMfaToggle = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoadingSecurity(true);
    setTimeout(() => {
      setMfaEnabled(!mfaEnabled);
      setSuccessMsg(`Multi-Factor Authentication has been ${!mfaEnabled ? 'enabled' : 'disabled'} successfully.`);
      setLoadingSecurity(false);
    }, 600);
  };

  const handleLogoutClick = async () => {
    await logout();
    window.location.href = '/login';
  };

  const confirmDeactivate = () => {
    setShowDeactivateModal(false);
    setErrorMsg('Demo: Account deactivation successfully initialized.');
  };

  const confirmClearCache = () => {
    setShowClearCacheModal(false);
    localStorage.clear();
    setSuccessMsg('Application local storage cache cleared.');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'privacy', label: 'Privacy & Security', icon: ShieldAlert },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 overflow-y-auto p-8 bg-slate-50 relative transition-colors duration-200"
    >
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-400 text-xs mt-1 font-semibold">Manage your account and preferences</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 mb-8 select-none relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`relative flex items-center gap-2 px-1 py-3.5 text-sm font-bold cursor-pointer transition-all duration-200 outline-none pb-4 ${
                isActive
                  ? 'text-[#0d9488]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeSettingsTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0d9488]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Alert Banners */}
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

      {/* 1. PROFILE TAB LAYOUT */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          
          {/* Column 1: Profile Information */}
          <Card className="lg:col-span-7 p-6 flex flex-col gap-6">
            <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">
              Profile Information
            </h3>
            
            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
              {/* Avatar Uploader Placeholder */}
              <div className="flex items-center justify-center py-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-brand-light text-brand-primary font-bold text-3xl flex items-center justify-center border border-brand-primary/10 shadow-sm">
                    {getInitials(fullName)}
                  </div>
                  <button 
                    type="button" 
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white flex items-center justify-center shadow-md cursor-pointer border-2 border-white transition-colors duration-150"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-brand-primary focus:bg-white rounded-2xl text-sm font-semibold transition-all duration-200 outline-none text-slate-700"
                />
              </div>

              {/* Email Address (Read-Only) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                />
              </div>

              {/* Class Selection Input (Read-Only) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Class</label>
                <input
                  type="text"
                  disabled
                  value={`Class ${grade}`}
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loadingProfile}
                className="self-start px-6 bg-brand-primary hover:bg-brand-primary-hover disabled:bg-indigo-300 text-white font-bold py-3 rounded-2xl text-xs shadow-lg shadow-brand-primary/10 transition-all duration-200 cursor-pointer"
              >
                {loadingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </Card>

          {/* Column 2: Account Actions & Preferences */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Action Card A: Change Password */}
            <Card className="p-6">
              <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-primary" />
                Change Password
              </h3>

              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                {/* Current Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Current Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      required
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-100 focus:border-brand-primary focus:bg-white rounded-xl text-sm font-semibold transition-all duration-200 outline-none text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">New Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showNewPass ? "text" : "password"}
                      required
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-100 focus:border-brand-primary focus:bg-white rounded-xl text-sm font-semibold transition-all duration-200 outline-none text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Confirm New Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      required
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-100 focus:border-brand-primary focus:bg-white rounded-xl text-sm font-semibold transition-all duration-200 outline-none text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingPassword}
                  className="w-full bg-brand-primary hover:bg-brand-primary-hover disabled:bg-indigo-300 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-brand-primary/10 transition-all duration-200 cursor-pointer"
                >
                  {loadingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </Card>

            {/* Action Card B: Appearance */}
            <Card className="p-6">
              <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Palette className="w-4 h-4 text-brand-primary" />
                Appearance
              </h3>
              <p className="text-xs text-slate-400 font-semibold mb-4">Choose your preferred theme</p>
              
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={themeMode === 'light'}
                    onChange={() => setThemeMode('light')}
                    className="w-4 h-4 text-brand-primary border-slate-300 focus:ring-brand-primary cursor-pointer"
                  />
                  Light Mode
                </label>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={themeMode === 'dark'}
                    onChange={() => setThemeMode('dark')}
                    className="w-4 h-4 text-brand-primary border-slate-300 focus:ring-brand-primary cursor-pointer"
                  />
                  Dark Mode
                </label>
              </div>
            </Card>

            {/* Action Card C: Logout */}
            <Card className="p-6 border-red-100 bg-red-50/20">
              <h3 className="text-sm font-extrabold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </h3>
              <p className="text-xs text-slate-400 font-semibold mb-4">Sign out from your account on this device</p>
              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-full bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-2.5 rounded-xl text-xs transition-colors duration-200 shadow-sm cursor-pointer"
              >
                Logout
              </button>
            </Card>

          </div>

        </div>
      )}

      {/* 2. ACCOUNT CATEGORY TAB */}
      {activeTab === 'account' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          <Card className="lg:col-span-8 p-6 flex flex-col gap-6">
            <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-primary" />
              Account Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Role</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-brand-light text-brand-primary font-bold text-xs px-2.5 py-1 rounded-full capitalize">
                    {currentUser?.role || 'Student'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Status</span>
                <div className="flex items-center gap-1.5 mt-1 text-emerald-600 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Email Verified</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unique Account ID</span>
                <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl mt-1 select-all truncate">
                  {currentUser?.id || '654a9fdfc437170012a9e5db'}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Member Since</span>
                <span className="text-xs font-semibold text-slate-600 mt-2">
                  September 2025 (Academic session 2025-26)
                </span>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2" />

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-600">Static Account Fields (Managed by Admin)</h4>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400">Registered Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full max-w-md px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="p-6 border-red-100 bg-red-50/20">
              <h3 className="text-sm font-extrabold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Trash2 className="w-4.5 h-4.5" />
                Danger Zone
              </h3>
              <p className="text-xs text-slate-400 font-semibold mb-4 leading-relaxed">
                Deactivating your account will restrict login access. All student chat session logs and cached answers will remain protected.
              </p>
              <button
                type="button"
                onClick={() => setShowDeactivateModal(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors duration-200 shadow-md shadow-red-200 cursor-pointer"
              >
                Deactivate Account
              </button>
            </Card>
          </div>
        </div>
      )}



      {/* 4. PRIVACY & SECURITY CATEGORY TAB */}
      {activeTab === 'privacy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          <Card className="lg:col-span-8 p-6 flex flex-col gap-6">
            <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-brand-primary" />
              Security Checkup
            </h3>
            
            {/* MFA selection */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-600">Multi-Factor Authentication (MFA)</span>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                Add an extra layer of defense by prompting for a code upon logging in from a new workstation.
              </p>
              
              <button
                type="button"
                onClick={handleMfaToggle}
                disabled={loadingSecurity}
                className={`self-start mt-2 px-5 py-2.5 rounded-xl font-bold text-xs border transition-all duration-200 flex items-center gap-2 ${
                  mfaEnabled
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {loadingSecurity ? 'Processing...' : mfaEnabled ? 'Disable MFA' : 'Enable MFA'}
              </button>
            </div>

            <div className="h-px bg-slate-100 my-2" />

            {/* Active Sessions */}
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-xs font-bold text-slate-600">Active Workstation Sessions</span>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-relaxed">
                  List of devices recently authorized to access your Nobeth study portal.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">Chrome on Windows</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">IP Address: 192.168.1.45</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                    Active Now
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">Safari on iPhone</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">IP Address: 192.168.1.101</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold px-2">
                    3 hours ago
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* System cache controls */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="p-6 border-red-100 bg-red-50/20">
              <h3 className="text-sm font-extrabold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Trash2 className="w-4.5 h-4.5" />
                System Cache
              </h3>
              <p className="text-xs text-slate-400 font-semibold mb-4 leading-relaxed">
                Clear all locally cached authorization credentials and force an immediate reload of the application context.
              </p>
              <button
                type="button"
                onClick={() => setShowClearCacheModal(true)}
                className="w-full bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-2.5 rounded-xl text-xs transition-colors duration-200 shadow-sm cursor-pointer"
              >
                Clear Local Data
              </button>
            </Card>
          </div>
        </div>
      )}

      {/* FOOTER INFO BAR (About Nobeth AI Tutor) */}
      <div className="bg-slate-100/50 border border-slate-200/60 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between select-none">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/50 flex items-center justify-center shrink-0 shadow-sm">
            <svg className="w-6 h-6 text-brand-primary" viewBox="0 0 24 24" strokeWidth="2.5" fill="none" stroke="currentColor">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700">About Nobeth AI Tutor</h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5 max-w-sm md:max-w-md lg:max-w-lg leading-relaxed">
              Nobeth AI Tutor is your intelligent learning companion built for NCERT students. Ask questions, get accurate answers, and learn better every day.
            </p>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-500">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/60 px-3.5 py-2 rounded-xl">
            <GraduationCap className="w-3.5 h-3.5 text-brand-primary" />
            <span>NCERT Focused</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/60 px-3.5 py-2 rounded-xl">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>AI Powered</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/60 px-3.5 py-2 rounded-xl">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Safe & Secure</span>
          </div>
        </div>
      </div>

      {/* ── CONFIRMATION MODALS ─────────────────────────────────────── */}
      
      {/* Deactivate Account Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 w-[360px] max-w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-red-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-base font-bold">Deactivate Account?</h3>
            </div>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              This action will temporarily block access to your student study account. To reactivate it, you must contact admin support.
            </p>
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-3 rounded-2xl text-xs transition-colors duration-250 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeactivate}
                className="flex-1 bg-red-600 hover:bg-red-750 text-white font-bold py-3 rounded-2xl text-xs transition-colors duration-250 cursor-pointer"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Cache Confirmation Modal */}
      {showClearCacheModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 w-[360px] max-w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-slate-800">
              <ShieldAlert className="w-6 h-6 text-brand-primary" />
              <h3 className="text-base font-bold">Clear Application Data?</h3>
            </div>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              This will clear your local JWT tokens, preferences, and cache. You will be redirected to the Login page.
            </p>
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowClearCacheModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-3 rounded-2xl text-xs transition-colors duration-250 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmClearCache}
                className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 rounded-2xl text-xs transition-colors duration-250 cursor-pointer"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default Settings;
export const SettingsPage = Settings;
