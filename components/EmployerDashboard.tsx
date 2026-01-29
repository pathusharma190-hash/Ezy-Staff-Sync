import React, { useState, useRef, useEffect } from 'react';
import { HelperCategory, HelperProfile, ChatMessage } from '../types';
import { Search, ShieldCheck, ArrowLeft, Send, Sparkles, User, Star, CheckCircle2, ShieldAlert, Eye, FileText, Download, LogOut, Briefcase } from 'lucide-react';
import { analyzeRequirements, getAssistantResponse } from '../services/geminiService';
import ResumeModal from './ResumeModal';

interface EmployerDashboardProps {
  onSelectCategory: (category: HelperCategory) => void;
  onLogout: () => void;
  helpers: HelperProfile[]; // Pass all helpers to filter later
  onSelectCandidate: (candidate: HelperProfile) => void;
}

const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ onSelectCategory, onLogout, helpers, onSelectCandidate }) => {
  // Mode: 'REQUIREMENTS' (Initial Chat) -> 'BROWSING' (Candidate Grid)
  const [mode, setMode] = useState<'REQUIREMENTS' | 'BROWSING'>('REQUIREMENTS');
  
  // Requirement Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    role: 'model',
    text: "Hello! I'm your StaffSync hiring assistant. To get started, please tell me what kind of staff you are looking for today (e.g., Nanny, Cook, Driver) and any specific requirements you have.",
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Search Results State
  const [identifiedCategory, setIdentifiedCategory] = useState<HelperCategory | null>(null);
  const [requirementsSummary, setRequirementsSummary] = useState('');
  const [filteredHelpers, setFilteredHelpers] = useState<HelperProfile[]>([]);
  const [viewingProfile, setViewingProfile] = useState<HelperProfile | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // 1. Analyze intent
      const historyForAnalysis = [...messages, userMsg].map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const analysis = await analyzeRequirements(historyForAnalysis);

      if (analysis.isReady && analysis.category) {
        // Transition to Browsing
        setIdentifiedCategory(analysis.category as HelperCategory);
        setRequirementsSummary(analysis.summary);
        
        // Filter candidates
        const matches = helpers.filter(h => h.category === analysis.category);
        setFilteredHelpers(matches);
        
        setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            role: 'model',
            text: `Great! I've found ${matches.length} ${analysis.category} candidates matching your criteria: "${analysis.summary}". Here they are.`,
            timestamp: new Date()
        }]);
        setMode('BROWSING');
      } else {
        // Continue conversation
        setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            role: 'model',
            text: analysis.nextQuestion,
            timestamp: new Date()
        }]);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'model',
        text: "I'm having a bit of trouble connecting. Could you please repeat that?",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetSearch = () => {
    setMode('REQUIREMENTS');
    setMessages([{
        id: crypto.randomUUID(),
        role: 'model',
        text: "Let's start a new search. What are you looking for?",
        timestamp: new Date()
    }]);
    setIdentifiedCategory(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
           <div className="bg-indigo-600 p-2 rounded-lg">
              <Search className="text-white w-5 h-5" />
           </div>
           <span className="text-xl font-bold text-gray-900">StaffSync</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={resetSearch}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              mode === 'REQUIREMENTS' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            AI Search
          </button>

          <button
            disabled
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed"
          >
             <Briefcase className="w-5 h-5" />
             My Hires (Soon)
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4 px-2">
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">ER</div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Employer</p>
                <p className="text-xs text-gray-500 truncate">Standard Plan</p>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col w-full p-4 h-full overflow-hidden">
        {/* Header - Minimal since Sidebar handles most */}
        <header className="flex justify-between items-center mb-4 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                {mode === 'BROWSING' && (
                    <button onClick={resetSearch} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                )}
                {mode === 'REQUIREMENTS' ? 'New Search' : `${identifiedCategory} Candidates`}
            </h2>
            <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                <ShieldCheck className="w-3 h-3" /> Verified Database
            </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
            {/* REQUIREMENT GATHERING CHAT MODE */}
            {mode === 'REQUIREMENTS' && (
                <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto w-full">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-full mb-4">
                            <Sparkles className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Find your perfect staff</h2>
                        <p className="text-gray-500">Our AI assistant will help match you with verified candidates.</p>
                    </div>

                    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 flex flex-col h-[500px]">
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                            {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                                msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                }`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-4 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    autoFocus
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="e.g. I need a full-time nanny for my 2-year-old..."
                                    className="w-full border border-gray-300 rounded-full px-5 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* BROWSING MODE */}
            {mode === 'BROWSING' && (
                <div className="flex h-full gap-6">
                    {/* Left: Chat Context & Modifications */}
                    <div className="w-80 hidden lg:flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
                        <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                            <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Conversation
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`text-sm ${msg.role === 'user' ? 'text-right text-gray-500' : 'text-left text-gray-800'}`}>
                                    <div className={`inline-block p-3 rounded-lg ${msg.role === 'user' ? 'bg-gray-100' : 'bg-indigo-50'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-200">
                            <input
                                type="text"
                                placeholder="Refine search..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        // Simple mock refine just to show interaction
                                        const val = e.currentTarget.value;
                                        setMessages(prev => [...prev, 
                                            { id: crypto.randomUUID(), role: 'user', text: val, timestamp: new Date() },
                                            { id: crypto.randomUUID(), role: 'model', text: "I've updated the list based on that.", timestamp: new Date() }
                                        ]);
                                        e.currentTarget.value = '';
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Right: Results Grid */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="mb-6 flex justify-between items-end">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{identifiedCategory} Matches</h2>
                                <p className="text-gray-500 text-sm mt-1">Based on: <span className="italic">"{requirementsSummary}"</span></p>
                            </div>
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                                {filteredHelpers.length} Found
                            </span>
                        </div>
                        
                        {filteredHelpers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200">
                                <User className="w-12 h-12 text-gray-300 mb-2" />
                                <p className="text-gray-500">No matching candidates found.</p>
                                <button onClick={resetSearch} className="mt-4 text-indigo-600 font-medium hover:underline">Try different requirements</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredHelpers.map((helper) => (
                                    <div key={helper.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                                        <img src={helper.avatarUrl || `https://picsum.photos/seed/${helper.id}/100`} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">{helper.name}</h3>
                                                        <div className="flex items-center text-xs text-gray-500 gap-2">
                                                            <span>{helper.age} yrs</span>
                                                            <span>•</span>
                                                            <span>{helper.experienceYears}y Exp</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold">
                                                    <Star className="w-3 h-3 fill-yellow-500 mr-1" />
                                                    {helper.rating}
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">"{helper.bio}"</p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {helper.skills.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">{skill}</span>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => setViewingProfile(helper)}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Resume">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    {helper.resumeUrl && (
                                                        <a href={helper.resumeUrl} download className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Download CV">
                                                            <Download className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                </div>
                                                
                                                <button 
                                                    onClick={() => onSelectCandidate(helper)}
                                                    disabled={!helper.verified}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    helper.verified 
                                                        ? 'bg-gray-900 text-white hover:bg-gray-800' 
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {helper.verified ? 'Select' : 'Pending'}
                                                </button>
                                            </div>
                                        </div>
                                        {/* Verification Footer */}
                                        <div className={`px-4 py-2 text-[10px] font-medium flex items-center justify-center gap-1 ${helper.verified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {helper.verified ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                                            {helper.verified ? 'Verified Candidate' : 'Verification Pending'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        <ResumeModal profile={viewingProfile!} onClose={() => setViewingProfile(null)} />
      </main>
    </div>
  );
};

export default EmployerDashboard;