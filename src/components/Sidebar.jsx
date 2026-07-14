import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home,
  LayoutDashboard, 
  MessageSquare, 
  Settings as SettingsIcon, 
  GraduationCap, 
  LogOut, 
  ChevronUp,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';


const BotChatIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21c-1.12 0-2.22-.18-3.26-.52L4 22l1.32-4.68C3.84 15.68 3 13.43 3 11c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9z" />
    <rect x="8.5" y="8.5" width="7" height="5" rx="1.5" strokeWidth="1.8" />
    <circle cx="10.5" cy="11" r="0.6" fill="currentColor" />
    <circle cx="13.5" cy="11" r="0.6" fill="currentColor" />
    <path d="M12 8.5V7.5" strokeWidth="1.8" />
  </svg>
);

export const Sidebar = () => {
  const { currentUser, currentClass, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'AI Chat', path: '/chat', icon: BotChatIcon },
    { name: 'Content Library', path: '/content', icon: BookOpen },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const handleLogoutClick = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 border-r border-slate-100 bg-white h-screen flex flex-col justify-between p-6 select-none shrink-0 relative z-20">
      {/* Brand Header */}
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <img src="/nobeth-logo.png" alt="Nobeth AI Tutor" className="w-11 h-11 object-contain shrink-0 rounded-xl shadow-sm border border-slate-100" />
          <div className="flex flex-col justify-center">
            <h1 className="text-[22px] font-extrabold text-slate-800 leading-[1.1]">Nobeth</h1>
            <p className="text-[11px] font-bold text-brand-primary tracking-wide">AI Tutor</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1.5 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer select-none z-10 ${
                    isActive
                      ? 'text-[#0d9488]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarNav"
                        className="absolute inset-0 bg-[#f0fdfa] rounded-xl -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                    </motion.div>
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Actions */}
      <div className="flex flex-col gap-5">
        {/* Class Selection Info */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary shrink-0">
            <GraduationCap className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Your Class</p>
            <h4 className="text-sm font-bold text-slate-700">Class {currentClass || '8'}</h4>
          </div>
        </div>

        {/* User Account Info Dropdown */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.985 }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200 cursor-pointer text-left outline-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary font-bold text-sm flex items-center justify-center border border-brand-primary/10">
                {getInitials(currentUser?.fullName)}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-slate-800 truncate leading-snug">{currentUser?.fullName || 'Student'}</h4>
                <p className="text-xs text-slate-400 truncate mt-0.5">{currentUser?.email || 'student@gmail.com'}</p>
              </div>
            </div>
            <ChevronUp className={`w-4 h-4 text-slate-400 transition-transform duration-250 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </motion.button>

          {/* Profile Context Dropdown */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 flex flex-col gap-1 z-30"
              >
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-all duration-150 cursor-pointer"
                >
                  Edit Profile
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-red-50 text-red-600 text-sm font-semibold flex items-center gap-2 transition-all duration-150 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Brand Copyright */}
        <p className="text-[10px] text-slate-400 text-center select-none font-medium">
          © 2025 Nobeth AI Tutor
        </p>
      </div>


    </aside>
  );
};

export default Sidebar;
