import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import LaTeXRenderer from '../components/LaTeXRenderer';
import DiagramRenderer from '../components/DiagramRenderer';
import { 
  Search, 
  Plus, 
  Pin, 
  MessageSquare, 
  Mic, 
  Send, 
  ArrowLeft,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  CheckCheck,
  SquarePen,
  History,
  GraduationCap,
  ChevronDown,
  Trash2,
  AlertTriangle,
  Volume2,
  Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Scrollable sources carousel subcomponent for cleaner scoping
const SourcesCarousel = ({ sources, grade }) => {
  const carouselRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(sources.length > 3);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Initial check
    checkScroll();
    // Add event listener for window resize to recheck arrows
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [sources]);

  return (
    <div className="mt-5 w-full">
      <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 px-1">
        Sources ({sources.length})
      </h4>
      
      <div className="relative flex items-center group/carousel">
        {showLeftArrow && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="absolute -left-3 z-10 w-8 h-8 rounded-full bg-white border border-slate-200/80 shadow-md flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
        
        <div
          ref={carouselRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth w-full pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sources.map((src, i) => (
            <div
              key={i}
              className="min-w-[260px] max-w-[260px] bg-white border border-slate-200/50 hover:border-slate-200 rounded-2xl p-4 shadow-sm flex gap-3 h-[112px] shrink-0 transition-colors select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <div className="overflow-hidden flex flex-col justify-between flex-1">
                <div>
                  <div className="flex justify-between items-center text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <span>NCERT {src.subject || 'Science'}</span>
                    <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md font-extrabold">Page {src.pageNumber}</span>
                  </div>
                  <h5 className="text-[11px] font-bold text-slate-700 truncate mt-1">
                    {src.chapter || `Chapter ${i + 1}`}
                  </h5>
                </div>
                <p className="text-[10px] text-slate-400 font-medium line-clamp-2 mt-1 leading-normal italic">
                  "{src.snippet}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="absolute -right-3 z-10 w-8 h-8 rounded-full bg-white border border-slate-200/80 shadow-md flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};

// Progressive Thinking/Loading Steps component to reduce perceived waiting time
const ThinkingLoader = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Analyzing query & learning context...",
    "Searching NCERT textbooks library...",
    "Structuring academic explanation...",
    "Formulating final response..."
  ];

  useEffect(() => {
    const intervals = [1300, 1600, 1600];
    let timer;
    const runNext = (index) => {
      if (index < steps.length - 1) {
        timer = setTimeout(() => {
          setCurrentStep(index + 1);
          runNext(index + 1);
        }, intervals[index]);
      }
    };
    runNext(0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-3 min-w-[280px] max-w-[340px] text-xs font-semibold select-none text-slate-500">
      <div className="flex items-center gap-2 border-b border-slate-100/80 pb-2 text-slate-400">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Tutor Thinking Process</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          
          let icon = null;
          let textColor = "text-slate-400/80";

          if (isCompleted) {
            icon = (
              <svg className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            );
            textColor = "text-slate-400/60 font-medium";
          } else if (isActive) {
            icon = (
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-ping" />
              </div>
            );
            textColor = "text-teal-600 font-extrabold";
          } else {
            icon = (
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
              </div>
            );
          }

          return (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 transition-colors duration-300 ${textColor}`}
            >
              <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                {icon}
              </div>
              <span className="leading-none">{step}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export const ChatWorkspace = () => {
  const { currentClass } = useAuth();
  const navigate = useNavigate();
  
  // URL routing query params
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSessionId = searchParams.get('session');
  
  // List of all chat sessions
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active chat state
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState('Science');
  
  // UI states
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sendingQuery, setSendingQuery] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [showHeaderMenuOpen, setShowHeaderMenuOpen] = useState(false);

  // Sync feedback from localStorage when activeSessionId changes
  useEffect(() => {
    if (!activeSessionId) {
      setFeedback({});
      return;
    }
    try {
      const saved = localStorage.getItem(`feedback-${activeSessionId}`);
      if (saved) {
        setFeedback(JSON.parse(saved));
      } else {
        setFeedback({});
      }
    } catch (e) {
      console.error('Failed to parse feedback from localStorage:', e);
      setFeedback({});
    }
  }, [activeSessionId]);

  const handleFeedback = (msgId, type) => {
    if (!activeSessionId) return;
    setFeedback(prev => {
      const current = prev[msgId];
      const updated = { ...prev };
      if (current === type) {
        delete updated[msgId];
      } else {
        updated[msgId] = type;
      }
      try {
        localStorage.setItem(`feedback-${activeSessionId}`, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save feedback to localStorage:', e);
      }
      return updated;
    });
  };
  
  // Audio STT & TTS states & refs
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioRef = useRef(null);

  // Cleanup audio recorders and speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (streamRef.current) {
        try {
          streamRef.current.getTracks().forEach(track => track.stop());
        } catch (e) {}
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const options = { mimeType: 'audio/webm' };
      let recorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleTranscribe(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start audio recording:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {}
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  const handleTranscribe = async (audioBlob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');

      const response = await apiClient.post('/api/audio/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.text) {
        setInputQuery(response.data.text);
      }
    } catch (err) {
      console.error('Transcription failed:', err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setActiveSpeakingMsgId(null);
  };

  const handleToggleSpeak = async (msg) => {
    if (activeSpeakingMsgId === msg.id) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    const cleanText = msg.text
      .replace(/<think>[\s\S]*?<\/think>/g, '')
      .replace(/[*#_`]/g, '')
      .trim();

    if (!cleanText) return;

    setActiveSpeakingMsgId(msg.id);

    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      utterance.onend = () => {
        setActiveSpeakingMsgId(null);
      };
      
      utterance.onerror = async (e) => {
        console.warn('Web Speech API error, falling back to backend TTS:', e);
        await playTTSFallback(cleanText, msg.id);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      await playTTSFallback(cleanText, msg.id);
    }
  };

  const playTTSFallback = async (text, msgId) => {
    try {
      const response = await apiClient.get('/api/audio/speak', {
        params: { text },
        responseType: 'blob'
      });
      
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setActiveSpeakingMsgId(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (e) => {
        console.error('HTML5 Audio playback error:', e);
        setActiveSpeakingMsgId(null);
      };

      await audio.play();
    } catch (err) {
      console.error('Failed to generate or play backend TTS:', err);
      setActiveSpeakingMsgId(null);
    }
  };
  
  // Delete / archive verification dialog state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Auto-scroll refs
  const messagesEndRef = useRef(null);
  const typingIntervalsRef = useRef([]);
  const skipNextFetchRef = useRef(false);
  const queryInputRef = useRef(null);

  // Sample questions suggestions
  const [sampleQuestions, setSampleQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Fetch sessions list (with debounced search query filter)
  const fetchSessions = async (q = '') => {
    try {
      const res = await apiClient.get('/api/chat/sessions', {
        params: q ? { q } : {}
      });
      setSessions(res.data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Debounced search trigger (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSessions(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch grade-scoped sample questions on component mount
  const fetchSampleQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const res = await apiClient.get('/api/chat/sample-questions');
      setSampleQuestions(res.data);
    } catch (err) {
      console.error('Error fetching sample questions:', err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchSampleQuestions();
  }, []);

  // Fetch session message logs when URL session changes
  const fetchActiveSessionDetails = async (targetSessionId = null, showLoading = false) => {
    let resolvedSessionId = activeSessionId;
    let resolvedShowLoading = showLoading;

    // Handle case where fetchActiveSessionDetails(true) or fetchActiveSessionDetails(false) is called
    if (typeof targetSessionId === 'boolean') {
      resolvedShowLoading = targetSessionId;
    } else if (targetSessionId) {
      resolvedSessionId = targetSessionId;
    }

    if (!resolvedSessionId) {
      setActiveSession(null);
      setMessages([]);
      return;
    }
    
    if (resolvedShowLoading) setLoadingChat(true);
    try {
      const res = await apiClient.get(`/api/chat/session/${resolvedSessionId}`);
      setActiveSession(res.data);
      
      const chatsList = res.data.chats || [];
      const flattened = [];
      chatsList.forEach((msg, index) => {
        flattened.push({
          id: `user-${index}`,
          type: 'user',
          text: msg.query,
          timestamp: msg.timestamp
        });
        flattened.push({
          id: `tutor-${index}`,
          type: 'tutor',
          text: msg.response,
          sources: msg.sources || [],
          diagram: msg.diagram || null,
          timestamp: msg.timestamp
        });
      });
      setMessages(flattened);
    } catch (err) {
      console.error('Error loading session details:', err);
    } finally {
      if (resolvedShowLoading) setLoadingChat(false);
    }
  };

  useEffect(() => {
    // Clear any active typing stream intervals when switching sessions
    typingIntervalsRef.current.forEach(clearInterval);
    typingIntervalsRef.current = [];

    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    fetchActiveSessionDetails(true);
  }, [activeSessionId]);

  // Auto-scroll down on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sendingQuery]);

  // Clear typing intervals on unmount
  useEffect(() => {
    return () => {
      typingIntervalsRef.current.forEach(clearInterval);
    };
  }, []);

  // Create a new chat session
  const handleNewChat = async () => {
    try {
      const defaultTitle = 'New Learning Session';
      const res = await apiClient.post('/api/chat/session/create', { 
        title: defaultTitle,
        subject: activeSubject 
      });
      await fetchSessions();
      setSearchParams({ session: res.data.sessionId });
    } catch (err) {
      console.error('Failed to create new session:', err);
    }
  };

  // Handle clicking a sample question suggestion card
  const handleSelectSampleQuestion = (questionText) => {
    setInputQuery(questionText);
    setTimeout(() => {
      queryInputRef.current?.focus();
    }, 50);
  };

  // Submit Student Query with optimistic updates & simulated streaming
  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    
    let sessionId = activeSessionId;
    
    // Auto-create session if sending query on empty active session
    if (!sessionId) {
      try {
        const res = await apiClient.post('/api/chat/session/create', { 
          title: inputQuery.trim(),
          subject: activeSubject
        });
        sessionId = res.data.sessionId;
        
        // Sync active session state immediately to prevent "AI Tutor Workspace" default header
        setActiveSession({
          id: res.data.id,
          sessionId: sessionId,
          title: res.data.title,
          grade: res.data.grade || currentClass || '8',
          subject: res.data.subject || activeSubject,
          pinned: false,
          chats: [],
          createdAt: res.data.createdAt,
          updatedAt: res.data.updatedAt
        });

        // Skip the fetch details triggered by search param update
        skipNextFetchRef.current = true;
        
        setSearchParams({ session: sessionId });
      } catch (err) {
        console.error('Failed to create initial session:', err);
        return;
      }
    }

    const queryText = inputQuery.trim();
    setInputQuery('');
    setSendingQuery(true);

    // OPTIMISTIC UPDATE: Add user message bubble to screen immediately
    const userMsgId = `user-opt-${Date.now()}`;
    const tutorMsgId = `tutor-opt-${Date.now()}`;
    
    setMessages(prev => [
      ...prev,
      { id: userMsgId, type: 'user', text: queryText, timestamp: new Date().toISOString() }
    ]);

    try {
      const res = await apiClient.post(`/api/chat/session/${sessionId}/query`, {
        query: queryText
      });
      
      const fullResponse = res.data.response;
      
      // Initialize tutor bubble with empty text
      setMessages(prev => [
        ...prev,
        {
          id: tutorMsgId,
          type: 'tutor',
          text: '',
          sources: [],
          diagram: null,
          timestamp: new Date().toISOString(),
          isStreaming: true
        }
      ]);

      // Stream words for buttery-smooth visual feedback
      const words = fullResponse.split(' ');
      let currentText = '';
      let wordIndex = 0;
      
      const streamInterval = setInterval(() => {
        if (wordIndex < words.length) {
          currentText += (wordIndex === 0 ? '' : ' ') + words[wordIndex];
          setMessages(prev => 
            prev.map(m => m.id === tutorMsgId ? { ...m, text: currentText } : m)
          );
          wordIndex++;
        } else {
          clearInterval(streamInterval);
          // Stream completed: set final payload and show sources/diagrams
          setMessages(prev => 
            prev.map(m => m.id === tutorMsgId ? { 
              ...m, 
              text: fullResponse, 
              sources: res.data.sources || [], 
              diagram: res.data.diagram || null,
              isStreaming: false 
            } : m)
          );
          // Reload sessions to update preview
          fetchSessions();
          // Reload active session details to update header title
          fetchActiveSessionDetails(sessionId, false);
        }
      }, 35);
      
      typingIntervalsRef.current.push(streamInterval);

      // Async log study time inside background
      try {
        await apiClient.post('/api/dashboard/log-study', {
          duration_minutes: 2,
          activity_type: 'chat'
        });
      } catch (logErr) {
        console.error('Failed to log study time:', logErr);
      }
      
    } catch (err) {
      console.error('Error submitting query:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: 'tutor',
          text: 'I apologize, but I had trouble reaching the NCERT database. Please try submitting again.',
          sources: [],
          diagram: null,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setSendingQuery(false);
    }
  };

  // Toggle Pinned status
  const handleTogglePin = async (e, id) => {
    e.stopPropagation();
    try {
      // Optimistic update for instant visual feedback
      if (activeSession && activeSession.sessionId === id) {
        setActiveSession(prev => prev ? { ...prev, pinned: !prev.pinned } : null);
      }
      await apiClient.post(`/api/chat/session/${id}/pin`);
      fetchSessions(searchQuery);
    } catch (err) {
      console.error('Error pinning session:', err);
      // Rollback optimistic update on failure
      if (activeSession && activeSession.sessionId === id) {
        setActiveSession(prev => prev ? { ...prev, pinned: !prev.pinned } : null);
      }
    }
  };

  // Confirm and Delete (soft-delete/archive) session
  const triggerDeleteSession = (e, id) => {
    e.stopPropagation();
    setSessionToDelete(id);
    setShowDeleteConfirm(true);
    setActiveMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    setActionLoading(true);
    try {
      await apiClient.delete(`/api/chat/session/${sessionToDelete}`);
      setShowDeleteConfirm(false);
      setSessionToDelete(null);
      await fetchSessions(searchQuery);
      if (activeSessionId === sessionToDelete) {
        setSearchParams({});
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Copy to clipboard helper
  const handleCopyClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const parseISODate = (isoString) => {
    if (!isoString) return new Date();
    let formatted = isoString;
    if (!isoString.endsWith('Z') && !isoString.includes('+') && !isoString.includes('-')) {
      formatted = isoString + 'Z';
    }
    return new Date(formatted);
  };

  // Custom Time Formatter
  const formatSidebarTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = parseISODate(isoString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  const formatTimeOnly = (isoString) => {
    if (!isoString) return '';
    try {
      const date = parseISODate(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  // Grouping sessions for mockup-style list
  const groupSessionsByDate = (list) => {
    const today = [];
    const thisWeek = [];
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    list.forEach(sess => {
      const date = new Date(sess.updatedAt);
      if (date >= startOfToday) {
        today.push(sess);
      } else {
        thisWeek.push(sess);
      }
    });
    return { today, thisWeek };
  };

  const { today, thisWeek } = groupSessionsByDate(sessions);

  // Render individual session item in sidebar
  const renderSessionItem = (session) => {
    const isActive = session.sessionId === activeSessionId;
    const isMenuOpen = activeMenuId === session.sessionId;
    
    return (
      <motion.div
        layout
        key={session.sessionId}
        onClick={() => setSearchParams({ session: session.sessionId })}
        whileTap={{ scale: 0.985 }}
        className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-3 relative select-none ${
          isActive 
            ? 'bg-[#f0fdfa] border-transparent text-[#0d9488] shadow-[0_2px_12px_-5px_rgba(13,148,136,0.08)]' 
            : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'
        }`}
      >
        <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 ${
          isActive ? 'bg-[#0d9488] text-white' : 'bg-slate-50 text-slate-400'
        }`}>
          <MessageSquare className="w-4.5 h-4.5 stroke-[2.2]" />
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex justify-between items-start gap-2">
            <h4 className={`text-xs font-extrabold leading-snug line-clamp-1 ${
              isActive ? 'text-[#1e1b4b]' : 'text-slate-700'
            }`}>
              {session.title}
            </h4>
            
            {/* Action Menu button */}
            <div className="relative shrink-0 select-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(isMenuOpen ? null : session.sessionId);
                }}
                className="hover:text-slate-800 p-0.5 rounded cursor-pointer transition-colors"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
              
              {/* Floating Chat Menu Options */}
              <AnimatePresence>
                {isMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-25" onClick={() => setActiveMenuId(null)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-1 w-36 bg-white border border-slate-200/60 rounded-xl shadow-lg py-1 z-30 text-[11px] font-bold text-slate-600"
                    >
                      <button
                        onClick={(e) => {
                          setActiveMenuId(null);
                          handleTogglePin(e, session.sessionId);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Pin className="w-3.5 h-3.5" />
                        {session.pinned ? 'Unpin Chat' : 'Pin Chat'}
                      </button>
                      <button
                        onClick={(e) => triggerDeleteSession(e, session.sessionId)}
                        className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Chat
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-1">
            <span>Class {session.grade || currentClass || '8'}</span>
            <div className="flex items-center gap-1.5">
              {session.pinned && <Pin className="w-3 h-3 text-[#0d9488] fill-[#0d9488]" />}
              <span>{formatSidebarTime(session.updatedAt)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex bg-slate-50 h-screen overflow-hidden"
    >
      
      {/* SECOND COLUMN: Recent Chats Sidebar */}
      <div className="w-80 border-r border-slate-200/60 bg-white h-full flex flex-col p-4 shrink-0 select-none">
        
        {/* Title Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold text-slate-800">Recent Chats</h2>
          <button 
            onClick={handleNewChat}
            className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <SquarePen className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>
        </div>

        {/* Outline New Chat Button */}
        <button 
          onClick={handleNewChat}
          className="w-full bg-white border border-[#0d9488]/20 hover:border-[#0d9488] text-[#0d9488] hover:bg-[#0d9488]/5 font-extrabold py-3 px-4 rounded-xl text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mb-4 shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Chat</span>
        </button>

        {/* Search Input bar */}
        <div className="relative flex items-center mb-6">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/50 focus:border-brand-primary focus:bg-white rounded-xl text-xs font-bold transition-all duration-150 outline-none text-slate-700"
          />
        </div>

        {/* List of Sessions */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-5 pr-1 select-none no-scrollbar">
          {loadingSessions ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sessions.length > 0 ? (
            <>
              {today.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5 block px-1">Today</span>
                  <div className="flex flex-col gap-2">
                    {today.map(sess => renderSessionItem(sess))}
                  </div>
                </div>
              )}
              {thisWeek.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5 block px-1">This Week</span>
                  <div className="flex flex-col gap-2">
                    {thisWeek.map(sess => renderSessionItem(sess))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center">
              <MessageSquare className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-semibold">No chats found. Start your first session.</p>
            </div>
          )}
        </div>

        {/* View All Chats Button footer */}
        <button className="w-full bg-white border border-[#0d9488]/15 hover:border-[#0d9488] text-[#0d9488] hover:bg-[#0d9488]/5 font-extrabold py-3 px-4 rounded-xl text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-4 shadow-sm">
          <History className="w-4 h-4 stroke-[2.2]" />
          <span>View All Chats</span>
        </button>

      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Chat Pane Header */}
        <div className="h-16 border-b border-slate-200/60 bg-white flex items-center justify-between px-8 select-none shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors duration-150 cursor-pointer"
            >
              <ArrowLeft className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>
            
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 truncate max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
                {activeSession ? activeSession.title : 'AI Tutor Workspace'}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                Class {activeSession?.grade || currentClass || '8'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeSession && (
              <div className="relative">
                <button 
                  onClick={() => setShowHeaderMenuOpen(!showHeaderMenuOpen)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors duration-150 cursor-pointer"
                >
                  <MoreVertical className="w-4.5 h-4.5 stroke-[2.2]" />
                </button>

                <AnimatePresence>
                  {showHeaderMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-25" onClick={() => setShowHeaderMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        className="absolute right-0 mt-1 w-36 bg-white border border-slate-200/60 rounded-xl shadow-lg py-1 z-30 text-[11px] font-bold text-slate-600"
                      >
                        <button
                          onClick={(e) => {
                            setShowHeaderMenuOpen(false);
                            handleTogglePin(e, activeSession.sessionId);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Pin className="w-3.5 h-3.5 text-slate-400" />
                          {activeSession.pinned ? 'Unpin Chat' : 'Pin Chat'}
                        </button>
                        <button
                          onClick={(e) => {
                            setShowHeaderMenuOpen(false);
                            triggerDeleteSession(e, activeSession.sessionId);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Chat
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Messages Feed View */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 flex flex-col gap-6 bg-slate-50/50">
          {loadingChat ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs text-slate-400 font-semibold">Retrieving conversation logs...</p>
            </div>
          ) : messages.length > 0 ? (
            <>
              {messages.map((msg, idx) => {
                const isUser = msg.type === 'user';
                return (
                  <motion.div 
                    layout="position"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    key={msg.id || idx}
                    className={`flex gap-4 min-w-0 w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Message Avatar (Tutor Only) */}
                    {!isUser && (
                      <img 
                        src="/chatbot-avatar.png" 
                        alt="AI Tutor Avatar" 
                        className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-sm border border-[#e2e8f0]" 
                      />
                    )}
                    
                    {/* Bubble Content */}
                    <div className={`flex flex-col gap-1.5 min-w-0 ${isUser ? 'max-w-[75%]' : 'max-w-[80%]'}`}>
                      <div className={`rounded-3xl p-5 border text-sm font-medium leading-relaxed w-full overflow-hidden ${
                        isUser 
                          ? 'bg-[#0d9488] border-transparent text-white shadow-md shadow-[#0d9488]/15 rounded-tr-none flex flex-col gap-1.5' 
                          : 'bg-white border-slate-200/60 text-slate-800 shadow-[0_2px_8px_-3px_rgba(13,148,136,0.03)] rounded-tl-none'
                      }`}>
                        {isUser ? (
                          <>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <div className="text-[10px] text-white/70 font-bold self-end flex items-center gap-1 select-none mt-0.5">
                              <span>{formatTimeOnly(msg.timestamp)}</span>
                            </div>
                          </>
                        ) : (
                          <LaTeXRenderer content={msg.text} />
                        )}
                        
                        {/* Render Diagram (Tutor only) */}
                        {!isUser && msg.diagram && (
                          <DiagramRenderer diagram={msg.diagram} className="mt-4" />
                        )}
                      </div>

                      {/* Bubble Bottom Meta actions (Tutor Only) */}
                      {!isUser && (
                        <div className="flex items-center justify-between px-2 text-[10px] font-extrabold text-slate-400 select-none">
                          <div className="flex items-center gap-2">
                            <span>
                              {msg.timestamp ? formatTimeOnly(msg.timestamp) : ''}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleSpeak(msg)}
                              className="p-1 rounded hover:bg-slate-100 cursor-pointer transition-all duration-200 hover:scale-115 text-slate-400 hover:text-slate-600 flex items-center justify-center"
                              title={activeSpeakingMsgId === msg.id ? "Stop Reading" : "Read Response"}
                            >
                              {activeSpeakingMsgId === msg.id ? (
                                <Square className="w-3 h-3 fill-slate-500 text-slate-500" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleFeedback(msg.id, 'liked')}
                              className={`p-1 rounded hover:bg-slate-100 cursor-pointer transition-colors duration-150 ${
                                feedback[msg.id] === 'liked' ? 'text-[#0d9488] bg-[#f0fdfa]' : 'hover:text-slate-600 text-slate-400'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" fill={feedback[msg.id] === 'liked' ? 'currentColor' : 'none'} />
                            </button>
                            <button 
                              onClick={() => handleFeedback(msg.id, 'disliked')}
                              className={`p-1 rounded hover:bg-slate-100 cursor-pointer transition-colors duration-150 ${
                                feedback[msg.id] === 'disliked' ? 'text-rose-600 bg-rose-50' : 'hover:text-slate-600 text-slate-400'
                              }`}
                            >
                              <ThumbsDown className="w-3.5 h-3.5" fill={feedback[msg.id] === 'disliked' ? 'currentColor' : 'none'} />
                            </button>
                            <button 
                              onClick={() => handleCopyClipboard(msg.text, msg.id)}
                              className="hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-100 cursor-pointer relative flex items-center justify-center"
                            >
                              {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Sources Carousel display (Tutor Only) */}
                      {!isUser && msg.sources && msg.sources.length > 0 && (
                        <SourcesCarousel 
                          sources={msg.sources} 
                          grade={activeSession?.grade || currentClass || '8'} 
                        />
                      )}

                    </div>
                  </motion.div>
                );
              })}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto select-none px-4 py-8">
              <div className="w-16 h-16 rounded-2xl bg-[#f0fdfa] flex items-center justify-center text-[#0d9488] mb-4 shadow-sm border border-[#0d9488]/10">
                <svg className="w-8 h-8 text-[#0d9488]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h3 className="text-base font-extrabold text-slate-800">Ask your NCERT AI Tutor</h3>
              <p className="text-xs text-slate-400 mt-1.5 font-bold leading-relaxed max-w-md">
                Choose a session from the sidebar or type a query below to get math explanations, structural diagrams, and cited sources.
              </p>

              {/* Sample Questions Grid */}
              {sampleQuestions && sampleQuestions.length > 0 && (
                <div className="mt-8 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {sampleQuestions.map((item) => {
                    const subject = item.subject.toLowerCase();
                    let badgeBg = "bg-slate-100 text-slate-600 border-slate-200";
                    if (subject.includes("science")) {
                      badgeBg = "bg-[#f0fdfa] text-[#0d9488] border-[#ccfbf1]";
                    } else if (subject.includes("math")) {
                      badgeBg = "bg-[#f5f3ff] text-[#7c3aed] border-[#e9e3ff]";
                    } else if (subject.includes("english")) {
                      badgeBg = "bg-[#ecfdf5] text-[#059669] border-[#d1fae5]";
                    } else if (subject.includes("social") || subject.includes("history") || subject.includes("geography")) {
                      badgeBg = "bg-[#fef3c7] text-[#d97706] border-[#fde68a]";
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectSampleQuestion(item.question)}
                        className="p-4 rounded-2xl bg-white border border-slate-200/60 text-left hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 active:translate-y-0 active:shadow-sm transition-all duration-200 cursor-pointer flex flex-col gap-2 group"
                      >
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border w-fit ${badgeBg}`}>
                          {item.subject}
                        </span>
                        <p className="text-xs font-semibold text-slate-600 group-hover:text-slate-800 leading-relaxed">
                          {item.question}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Optimistic tutor typing loader bubble */}
          {sendingQuery && (
            <div className="flex gap-4 max-w-[85%] mr-auto">
              <img 
                src="/chatbot-avatar.png" 
                alt="AI Tutor Avatar" 
                className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-sm border border-[#e2e8f0] animate-pulse" 
              />
              <div className="bg-white border border-slate-200/60 rounded-[28px] rounded-tl-none p-5.5 shadow-[0_4px_20px_-4px_rgba(13,148,136,0.05)] flex items-center">
                <ThinkingLoader />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Floating Input Query Bar */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-200/50 shrink-0 z-10 select-none">
          <style>{`
            @keyframes pulseRed {
              0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
              70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
              100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
            }
            .input-active-recording {
              animation: pulseRed 1.5s infinite;
            }
          `}</style>
          <form 
            onSubmit={handleSubmitQuery} 
            className={`max-w-4xl mx-auto flex flex-col bg-white border shadow-[0_4px_30px_-5px_rgba(13,148,136,0.04)] rounded-[26px] p-3 relative transition-all duration-200 ${
              isRecording ? 'input-active-recording border-red-500' : 'border-slate-200/80'
            }`}
          >
            
            {/* TextInput Field */}
            <div className="flex items-center gap-2 px-2">
              <input
                ref={queryInputRef}
                type="text"
                placeholder={
                  isTranscribing
                    ? "⏳ Transcribing audio..."
                    : isRecording
                      ? "🎙️ Listening... Click 🔴 to Stop & Transcribe"
                      : "Ask anything from your NCERT books..."
                }
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={sendingQuery || isTranscribing}
                className="w-full py-2 bg-transparent border-none text-slate-700 placeholder-slate-400 text-sm font-bold outline-none"
              />
            </div>

            {/* Input Bottom Action Row */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 px-2">
              
              {/* Dropdowns & Pills */}
              <div className="flex items-center gap-2">
                <button type="button" className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors duration-150">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Your Class Badge */}
                <div className="bg-[#f0fdfa] text-[#0d9488] border border-[#0d9488]/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-[10px] font-extrabold shadow-sm select-none">
                  <GraduationCap className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Your Class: Class {activeSession?.grade || currentClass || '8'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={handleMicClick}
                  disabled={isTranscribing}
                  className={`w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center transition-all duration-200 hover:scale-115 active:scale-95 cursor-pointer ${
                    isRecording ? 'bg-red-50 text-red-500' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title={isRecording ? 'Stop & Transcribe' : 'Record Audio'}
                >
                  {isTranscribing ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : isRecording ? (
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  ) : (
                    <Mic className="w-4.5 h-4.5 stroke-[2.2]" />
                  )}
                </button>
                
                <button
                  type="submit"
                  disabled={sendingQuery || !inputQuery.trim()}
                  className="w-9 h-9 rounded-full bg-[#0d9488] hover:bg-[#0f766e] disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none text-white flex items-center justify-center transition-all duration-200 shadow-md shadow-[#0d9488]/20 cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4 fill-white/10 stroke-[2.2]" />
                </button>
              </div>

            </div>
          </form>
          
          <p className="text-[10px] text-slate-400 text-center font-medium mt-3">
            Nobeth AI Tutor can make mistakes. Please verify important information.
          </p>
        </div>

      </div>

      {/* Confirmation modal for soft delete (archiving) */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            />
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white border border-slate-100 rounded-[28px] p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">Delete Chat Session</h3>
              <p className="text-xs text-slate-400 font-bold mt-2 leading-relaxed">
                Are you sure you want to delete this chat? This action cannot be undone.
              </p>
              
              <div className="flex gap-3 w-full mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-slate-50 border border-slate-200/60 hover:bg-slate-100 text-slate-500 font-extrabold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={actionLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-md shadow-red-600/10 transition-all disabled:bg-red-300 cursor-pointer"
                >
                  {actionLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ChatWorkspace;
