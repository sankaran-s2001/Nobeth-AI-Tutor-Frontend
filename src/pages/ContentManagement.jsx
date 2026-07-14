import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import { 
  BookOpen, 
  ChevronDown, 
  Search,
  Book,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ContentManagement = () => {
  const { currentClass } = useAuth();
  const [booksList, setBooksList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Active subject selection
  const [selectedSubject, setSelectedSubject] = useState('');
  // Expanded chapters tracker (stores chapterNo/ID as keys)
  const [expandedChapters, setExpandedChapters] = useState({});
  // Search query for filtering chapters
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchContentData = async () => {
      setIsLoading(true);
      setErrorMsg('');
      try {
        const response = await apiClient.get('/api/content/books');
        setBooksList(response.data);
        if (response.data && response.data.length > 0) {
          setSelectedSubject(response.data[0].subject);
        }
      } catch (error) {
        console.error("Failed to load content management data", error);
        setErrorMsg('Failed to load syllabus books. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchContentData();
  }, [currentClass]);

  // Toggle single accordion open/closed status
  const toggleChapter = (chapterNo) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterNo]: !prev[chapterNo]
    }));
  };

  // Find book document corresponding to active subject tab
  const activeBook = booksList.find(b => b.subject === selectedSubject);

  // Filter chapters list based on search input
  const filteredChapters = activeBook?.chapters?.filter(ch => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      ch.chapterName.toLowerCase().includes(term) ||
      ch.chapterNo.toString().includes(term)
    );
  }) || [];

  // Helper colors for subject badges
  const getSubjectTheme = (sub) => {
    const lower = sub.toLowerCase();
    if (lower.includes('sci')) {
      return { border: 'border-[#ccfbf1]', text: 'text-[#0d9488]', bg: 'bg-[#f0fdfa]' };
    }
    if (lower.includes('math') || lower.includes('arith')) {
      return { border: 'border-[#e9e3ff]', text: 'text-[#7c3aed]', bg: 'bg-[#f5f3ff]' };
    }
    if (lower.includes('english')) {
      return { border: 'border-[#d1fae5]', text: 'text-[#059669]', bg: 'bg-[#ecfdf5]' };
    }
    if (lower.includes('tamil') || lower.includes('lang')) {
      return { border: 'border-[#ccfbf1]', text: 'text-[#0d9488]', bg: 'bg-[#f0fdfa]' };
    }
    return { border: 'border-[#fde68a]', text: 'text-[#d97706]', bg: 'bg-[#fef3c7]' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 overflow-y-auto p-8 bg-[#f8fafc] relative"
    >
      {/* ──────────────────────────────────────────────────────── */}
      {/* HEADER SECTION                                           */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-800 tracking-tight leading-none">
            Content Library
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 font-bold">
            Access your grade-specific NCERT syllabus books, chapter list, and summaries.
          </p>
        </div>

        {/* Current Class Badge */}
        <div className="border border-[#e2e8f0]/70 rounded-2xl py-2 px-4 bg-white flex items-center gap-2 shadow-sm shrink-0">
          <GraduationCap className="w-5 h-5 text-[#0d9488] stroke-[2.2]" />
          <span className="text-xs font-extrabold text-slate-700">Class {currentClass || '8'}</span>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {isLoading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#0d9488] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-semibold">Loading content library...</p>
        </div>
      ) : booksList.length === 0 ? (
        <div className="min-h-[400px] bg-white border border-slate-100 rounded-[28px] p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <BookOpen className="w-16 h-16 text-slate-200 mb-4" />
          <h3 className="text-base font-bold text-slate-700">No books available</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1.5 font-medium leading-relaxed">
            There are no syllabus books populated for your assigned Class level yet. Please check back later.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* ──────────────────────────────────────────────────────── */}
          {/* SUBJECT SELECTOR TABS                                    */}
          {/* ──────────────────────────────────────────────────────── */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Select Subject
            </span>
            <div className="flex flex-wrap gap-3">
              {booksList.map((book) => {
                const isActive = book.subject === selectedSubject;
                const theme = getSubjectTheme(book.subject);
                return (
                  <motion.button
                    key={book.bookId}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedSubject(book.subject);
                      setSearchQuery('');
                      setExpandedChapters({});
                    }}
                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-sm font-extrabold transition-all duration-200 cursor-pointer shadow-sm ${
                      isActive 
                        ? `${theme.bg} ${theme.text} ${theme.border} ring-2 ring-[#0d9488]/10`
                        : 'bg-white border-[#e2e8f0]/60 text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Book className={`w-4 h-4 shrink-0 ${isActive ? theme.text : 'text-slate-400'}`} />
                    <span>{book.subject}</span>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/60' : 'bg-slate-100 text-slate-500'}`}>
                      {book.totalChapters || book.chapters?.length || 0} Ch
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* CHAPTERS SEARCH AND ACCORDIONS                           */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeBook && (
            <div className="flex flex-col gap-5">
              {/* Search Bar Row */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search chapters by name or number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:border-[#0d9488] focus:bg-white rounded-2xl text-xs font-bold text-slate-700 outline-none transition-colors duration-150 shadow-sm"
                />
              </div>

              {filteredChapters.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
                  <p className="text-xs text-slate-400 font-semibold">No chapters match your search query.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredChapters.map((ch) => {
                    const isExpanded = !!expandedChapters[ch.chapterNo];
                    const theme = getSubjectTheme(selectedSubject);
                    return (
                      <div 
                        key={ch.chapterNo}
                        className="bg-white border border-[#e2e8f0]/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_4px_12px_-5px_rgba(0,0,0,0.05)] transition-all duration-200"
                      >
                        {/* Accordion Header Trigger */}
                        <button
                          onClick={() => toggleChapter(ch.chapterNo)}
                          className="w-full flex items-center justify-between p-4.5 text-left cursor-pointer outline-none hover:bg-slate-50/50 transition-colors duration-150"
                        >
                          <div className="flex items-center gap-3.5 min-w-0 pr-4">
                            {/* Chapter Index Badge */}
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg shrink-0 border ${theme.bg} ${theme.text} ${theme.border}`}>
                              CH {ch.chapterNo}
                            </span>
                            <span className="text-xs sm:text-sm font-extrabold text-slate-700 truncate">
                              {ch.chapterName}
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200/40 text-slate-400 shrink-0"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </motion.div>
                        </button>

                        {/* Accordion Panel Body */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                            >
                              <div className="px-4.5 pb-4.5 pt-0.5 border-t border-slate-50">
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-4.5 flex flex-col gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-[#0d9488]" />
                                    <span className="text-[10px] font-extrabold text-[#0d9488] uppercase tracking-wider">
                                      Chapter Summary
                                    </span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                                    {ch.summary ? ch.summary : (
                                      <span className="text-slate-400 italic">
                                        No summary available for this chapter yet.
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ContentManagement;
