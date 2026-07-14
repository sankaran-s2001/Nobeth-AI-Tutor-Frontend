import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import { 
  MessageSquare, 
  Clock, 
  HelpCircle, 
  TrendingUp, 
  Play, 
  Calendar,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Bell,
  Flame,
  Check,
  BookOpen,
  Plus,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard = () => {
  const { currentUser, currentClass } = useAuth();
  const navigate = useNavigate();
  
  // Dashboard stats data state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [showLogModal, setShowLogModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [logMinutes, setLogMinutes] = useState('20');
  const [goalHours, setGoalHours] = useState('6');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardStats = async () => {
    try {
      const res = await apiClient.get('/api/dashboard/stats');
      setData(res.data);
      if (res.data?.goals?.targetHours) {
        setGoalHours(String(res.data.goals.targetHours));
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Could not retrieve progress statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [currentClass]);

  const handleLogStudy = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    try {
      await apiClient.post('/api/dashboard/log-study', {
        duration_minutes: parseInt(logMinutes) || 20,
        activity_type: 'chat'
      });
      setShowLogModal(false);
      await fetchDashboardStats();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to log study minutes.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    try {
      await apiClient.post('/api/dashboard/goals', {
        target_weekly_hours: parseFloat(goalHours) || 6
      });
      setShowGoalModal(false);
      await fetchDashboardStats();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update weekly goal hours.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatStudyTime = (mins) => {
    if (!mins) return '0h 0m';
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hrs === 0) return `${remainingMins}m`;
    return `${hrs}h ${remainingMins}m`;
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const isToday = date.toDateString() === today.toDateString();
      const isYesterday = date.toDateString() === yesterday.toDateString();
      
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (isToday) return `Today, ${timeStr}`;
      if (isYesterday) return `Yesterday, ${timeStr}`;
      
      return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
    } catch (e) {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0d9488] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-semibold">Loading your learning workspace...</p>
        </div>
      </div>
    );
  }

  // Calculate goal progress metrics
  const completedMins = data?.goals?.completedMinutes || data?.goals?.completedMins || 0;
  const targetHours = data?.goals?.targetHours || 6;
  const targetMins = targetHours * 60;
  const progressPercent = data?.goals?.percentage !== undefined ? data?.goals?.percentage : Math.min(100, Math.round((completedMins / targetMins) * 100));

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Last chat session mapping for continue learning
  const lastChat = data?.continueLearning || data?.lastChat;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 overflow-y-auto p-8 bg-[#f8fafc] relative"
    >
      
      {/* Alert Error Notification Bar */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* GREETING HEADER ROW                                      */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-800 tracking-tight leading-none">
            Welcome back, {currentUser?.fullName?.split(' ')[0] || 'Sankaran'}! 👋
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 font-bold">Your AI learning journey continues here.</p>
        </div>
        
        {/* Right side utilities: Notification & Profile Info */}
        <div className="flex items-center gap-4">
          {/* Notification icon */}
          <button className="relative w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center bg-white text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors shadow-sm">
            <Bell className="w-5 h-5" />
            <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
          </button>
          
          {/* Profile dropdown tag */}
          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.985 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 bg-white border border-slate-100 rounded-full py-1.5 px-3 shadow-sm hover:bg-slate-50 cursor-pointer transition-all duration-200 outline-none"
            >
              <div className="w-7 h-7 rounded-full bg-[#f0fdfa] text-[#0d9488] font-bold text-xs flex items-center justify-center border border-[#0d9488]/10">
                {getInitials(currentUser?.fullName || 'Sankaran S')}
              </div>
              <span className="font-bold text-slate-700 text-sm">{currentUser?.fullName || 'Sankaran S'}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </motion.button>
            
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 w-48 flex flex-col gap-1 z-30"
                >
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 text-sm font-semibold cursor-pointer"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/settings?tab=account');
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 text-sm font-semibold cursor-pointer"
                  >
                    Account Settings
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* ROW 1: HERO SELECT CLASS BANNER CARD                      */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#e2e8f0]/40 rounded-[28px] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative mb-8">
        
        {/* Left Sub-card: Class Information */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="border border-[#e2e8f0]/70 rounded-2xl p-4 bg-[#f8fafc] flex items-center gap-3 w-52">
            <div className="w-10 h-10 rounded-xl bg-[#f0fdfa] text-[#0d9488] flex items-center justify-center shadow-sm shrink-0">
              <GraduationCap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Class</span>
              <h4 className="text-base font-extrabold text-slate-700">Class {currentClass || '8'}</h4>
              <span className="text-[10px] text-slate-400 font-semibold block">NCERT Books</span>
            </div>
          </div>
        </div>

        {/* Center Illustration: Stack of books + Plant */}
        <div className="hidden md:block relative w-[220px] h-[110px] shrink-0 self-center">
          <img src="/books-illustration.png" alt="NCERT Books" className="w-full h-full object-contain" />
        </div>

        {/* Right side content with New Chat Button */}
        <div className="flex-1 md:pl-6 max-w-lg text-center md:text-left">
          <h2 className="text-xl font-extrabold text-slate-800">Learn better with AI</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1.5 leading-relaxed">
            Ask questions, get clear explanations and learn from your NCERT books.
          </p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.015, y: -1, boxShadow: '0 10px 25px -8px rgba(13,148,136,0.35)' }}
          whileTap={{ scale: 0.985 }}
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition-all duration-200 cursor-pointer shadow-md shadow-[#0d9488]/20 shrink-0 self-stretch md:self-auto justify-center outline-none"
        >
          <Sparkles className="w-4 h-4 fill-white/20" />
          Start a New Chat
          <ChevronRight className="w-4.5 h-4.5" />
        </motion.button>

      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* ROW 2: 4 METRICS CARDS                                    */}
      {/* ──────────────────────────────────────────────────────── */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {[
          { title: 'Total Chats', val: data?.stats?.totalChats || 0, label: 'Across all time', icon: MessageSquare, color: 'bg-emerald-50 text-emerald-600', lblColor: 'text-emerald-500' },
          { title: 'Study Time', val: data?.stats?.studyTime || '0m', label: 'This week', icon: Clock, color: 'bg-indigo-50 text-indigo-600', lblColor: 'text-indigo-500' },
          { title: 'Questions Asked', val: data?.stats?.questionsAsked || 0, label: 'This week', icon: HelpCircle, color: 'bg-orange-50 text-orange-600', lblColor: 'text-orange-500' },
          { title: 'Accuracy', val: data?.stats?.accuracy ? (data.stats.accuracy.endsWith('%') ? data.stats.accuracy : `${data.stats.accuracy}%`) : '96%', label: 'AI Response Accuracy', icon: TrendingUp, color: 'bg-purple-50 text-purple-600', lblColor: 'text-purple-500' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i} 
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
              }}
              whileHover={{ y: -4, boxShadow: '0 12px 30px -10px rgba(88,43,232,0.08)', borderColor: 'rgba(88,43,232,0.15)' }}
              className="bg-white border border-[#e2e8f0]/50 p-5 rounded-2xl flex items-center justify-between shadow-sm transition-colors duration-200"
            >
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-2 tracking-tight">{stat.val}</h3>
                <span className={`text-[10px] font-bold mt-1.5 block ${stat.lblColor}`}>{stat.label}</span>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* ROW 3: SPLIT CARDS (Continue Learning & Study Streak)   */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Card A: Continue Learning */}
        <motion.div 
          whileHover={{ y: -3, boxShadow: '0 12px 30px -10px rgba(13,148,136,0.04)', borderColor: 'rgba(13,148,136,0.08)' }}
          className="bg-white border border-[#e2e8f0]/40 rounded-[28px] p-6 shadow-sm flex flex-col justify-between h-[300px] transition-colors duration-250"
        >
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#0d9488] stroke-[2.2]" />
            <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">
              Continue Learning
            </h3>
          </div>
          
          {lastChat ? (
            <div className="flex-1 flex flex-col justify-between mt-4">
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Chat Session</span>
                <h4 className="text-sm font-bold text-slate-700 line-clamp-2 leading-relaxed">
                  "{lastChat.query || lastChat.title}"
                </h4>
                <div className="flex gap-2.5 mt-1 text-[10px] font-bold text-slate-400">
                  <span className="bg-[#e2e8f0] text-slate-600 px-2.5 py-0.5 rounded-full">
                    Class {lastChat.grade || currentClass}
                  </span>
                  {lastChat.subject && (
                    <span className="bg-[#f0fdfa] text-[#0d9488] px-2.5 py-0.5 rounded-full">
                      {lastChat.subject}
                    </span>
                  )}
                  <span className="ml-auto text-slate-400 font-semibold">
                    {formatTimestamp(lastChat.timestamp || lastChat.updatedAt)}
                  </span>
                </div>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate(`/chat?session=${lastChat.sessionId}`)}
                className="w-full flex items-center justify-center gap-2 bg-[#f0fdfa] hover:bg-[#e6fcf5] text-[#0d9488] font-bold py-3.5 px-4 rounded-xl text-xs transition-all duration-200 cursor-pointer shadow-sm mt-4 outline-none"
              >
                <Play className="w-3.5 h-3.5 fill-[#0d9488] stroke-none" />
                Continue This Chat
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
              <MessageSquare className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-xs text-slate-400 font-semibold">No recent chat sessions yet.</p>
              <button 
                onClick={() => navigate('/chat')}
                className="mt-3 text-xs font-bold text-[#0d9488] hover:underline cursor-pointer"
              >
                Start your first chat
              </button>
            </div>
          )}
        </motion.div>

        {/* Card B: Study Streak & Goal Tracking */}
        <motion.div 
          whileHover={{ y: -3, boxShadow: '0 12px 30px -10px rgba(13,148,136,0.04)', borderColor: 'rgba(13,148,136,0.08)' }}
          className="bg-white border border-[#e2e8f0]/40 rounded-[28px] p-6 shadow-sm flex flex-col justify-between h-[300px] transition-colors duration-250"
        >
          <div>
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0d9488] stroke-[2.2]" />
                Study Streak
              </h3>
              
              {/* Streak badge */}
              <div className="flex items-center gap-1 bg-[#f0fdfa] text-[#0d9488] px-3 py-1 rounded-full text-xs font-extrabold shadow-sm">
                <span>{data?.streak?.currentStreak || 0} days</span>
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2.5 mb-4">
              <p className="text-xs text-slate-400 font-semibold">Keep it up! Consistency leads to excellence.</p>
              {/* Quick log button */}
              <button 
                onClick={() => setShowLogModal(true)}
                className="flex items-center gap-1 hover:bg-[#f0fdfa] text-[#0d9488] font-bold p-1 rounded-lg text-xs transition-colors duration-150 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log Study</span>
              </button>
            </div>

            {/* Streak Days Row */}
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => {
                const historyItem = data?.streak?.weeklyHistory?.find(item => item.dayName === day);
                const dailyMinutes = historyItem?.duration || 0;
                const isStudied = historyItem?.studied || false;
                return (
                  <div key={day} className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{day}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isStudied 
                        ? 'bg-[#0d9488] text-white shadow-sm shadow-[#0d9488]/20' 
                        : 'bg-slate-50 border border-slate-200 text-slate-300'
                    }`}>
                      {isStudied ? <Check className="w-4 h-4 stroke-[3.5px]" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                    </div>
                    <span className={`text-[8px] font-extrabold ${isStudied ? 'text-slate-500' : 'text-slate-300'}`}>
                      {isStudied ? `${dailyMinutes}m` : '--'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Goal Progress Bar */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span className="text-[11px] text-slate-400">Goal Progress ({progressPercent}%)</span>
              <button 
                onClick={() => setShowGoalModal(true)}
                className="text-[#0d9488] hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <span>{formatStudyTime(completedMins)} / {targetHours}h</span>
              </button>
            </div>
            
            {/* Progress Bar Container */}
            <div className="w-full bg-[#f1f5f9] rounded-full h-2.5 overflow-hidden border border-[#e2e8f0]/40">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-[#0d9488] h-full rounded-full"
              />
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mt-1">
              <span>Great job! You studied for {formatStudyTime(completedMins)} this week.</span>
              <button 
                onClick={() => setShowGoalModal(true)}
                className="font-bold text-[#0d9488] hover:underline cursor-pointer"
              >
                Goal: {targetHours}h
              </button>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* ROW 4: ABOUT NOBETH AI TUTOR FOOTER                      */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="bg-[#fcfcff] border border-[#e2e8f0]/50 rounded-[28px] p-6 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        
        <div className="flex items-start gap-4 max-w-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#f0fdfa] border border-[#0d9488]/10 shrink-0 flex items-center justify-center shadow-sm mt-1">
            <svg className="w-7 h-7 text-[#0d9488]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-700 leading-snug">About Nobeth AI Tutor</h4>
            <p className="text-xs text-slate-400 font-semibold mt-1.5 leading-relaxed">
              Nobeth AI Tutor is your intelligent learning companion built for NCERT students. Ask questions, get accurate explanations, and learn better with AI - powered by advanced technology.
            </p>
          </div>
        </div>

        {/* Feature badges column */}
        <div className="grid grid-cols-2 gap-3.5 shrink-0 w-full lg:w-auto">
          {[
            { label: 'NCERT Focused', sub: 'Trusted content from books' },
            { label: 'AI Powered', sub: 'Advanced easy explanations' },
            { label: 'Clear & Accurate', sub: 'Citations and proper clarity' },
            { label: 'Safe & Secure', sub: 'Private and always protected' }
          ].map((pill, idx) => (
            <div key={idx} className="border border-[#e2e8f0]/70 rounded-xl p-2.5 bg-white flex flex-col gap-0.5 shadow-sm">
              <span className="text-[10px] font-extrabold text-[#0d9488] tracking-wide">{pill.label}</span>
              <span className="text-[9px] text-slate-400 font-bold">{pill.sub}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-slate-400 text-center select-none font-bold mt-10">
        © 2025 Nobeth AI Tutor. All rights reserved.
      </p>

      {/* ──────────────────────────────────────────────────────── */}
      {/* MODAL 1: LOG STUDY MINUTES                               */}
      {/* ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-100 shadow-2xl rounded-3xl p-6 w-[340px] max-w-full"
            >
              <h3 className="text-base font-bold text-slate-800 mb-1">Log Study Time</h3>
              <p className="text-xs text-slate-400 mb-4 font-medium">Log your offline NCERT learning sessions manually.</p>
              
              <form onSubmit={handleLogStudy} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="480"
                    required
                    value={logMinutes}
                    onChange={(e) => setLogMinutes(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 focus:border-[#0d9488] focus:bg-white rounded-xl text-sm font-bold text-slate-700 outline-none transition-colors duration-150"
                  />
                </div>
                
                <div className="flex gap-2.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-3 rounded-xl text-xs transition-colors duration-150 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-[#0d9488] hover:bg-[#0f766e] disabled:bg-indigo-300 text-white font-bold py-3 rounded-xl text-xs transition-colors duration-150 cursor-pointer"
                  >
                    {actionLoading ? 'Logging...' : 'Log Time'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────── */}
      {/* MODAL 2: UPDATE WEEKLY TARGET GOAL HOURS                 */}
      {/* ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-100 shadow-2xl rounded-3xl p-6 w-[340px] max-w-full"
            >
              <h3 className="text-base font-bold text-slate-800 mb-1">Set Weekly Goal</h3>
              <p className="text-xs text-slate-400 mb-4 font-medium">Update your weekly target study hours (max: 168h).</p>
              
              <form onSubmit={handleUpdateGoal} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    step="0.5"
                    required
                    value={goalHours}
                    onChange={(e) => setGoalHours(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 focus:border-[#0d9488] focus:bg-white rounded-xl text-sm font-bold text-slate-700 outline-none transition-colors duration-150"
                  />
                </div>
                
                <div className="flex gap-2.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowGoalModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-3 rounded-xl text-xs transition-colors duration-150 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-[#0d9488] hover:bg-[#0f766e] disabled:bg-indigo-300 text-white font-bold py-3 rounded-xl text-xs transition-colors duration-150 cursor-pointer"
                  >
                    {actionLoading ? 'Saving...' : 'Save Goal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



    </motion.div>
  );
};

export default Dashboard;
