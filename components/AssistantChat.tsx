import React, { useState, useEffect, useRef } from 'react';
import { HelperCategory, HelperProfile, ChatMessage } from '../types';
import { getAssistantResponse } from '../services/geminiService';
import { Send, User, Bot, Star, ArrowLeft, CheckCircle2, ShieldAlert, FileText, Eye } from 'lucide-react';
import ResumeModal from './ResumeModal';

interface AssistantChatProps {
  category: HelperCategory;
  helpers: HelperProfile[];
  onBack: () => void;
  onSelectCandidate: (candidate: HelperProfile) => void;
}

const AssistantChat: React.FC<AssistantChatProps> = ({ category, helpers, onBack, onSelectCandidate }) => {
  // Filter helpers by category immediately
  const [filteredHelpers, setFilteredHelpers] = useState<HelperProfile[]>(
    helpers.filter(h => h.category === category)
  );
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<HelperProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        id: 'init',
        role: 'model',
        text: `Hello! I see you're looking for a ${category}. I have ${filteredHelpers.length} candidates available. Tell me more about your requirements (e.g., specific skills, years of experience, or personality traits) so I can help you shortlist.`,
        timestamp: new Date()
      }
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]); // Only run when category changes (essentially mount)

  // Scroll to bottom
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
      // Prepare history for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await getAssistantResponse(history, filteredHelpers, userMsg.text);

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'model',
        text: response.text,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'model',
        text: "I'm having trouble connecting right now. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors group" title="Back">
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{category} Candidates</h1>
            <p className="text-xs text-gray-500">AI-Assisted Selection Process</p>
          </div>
        </div>
        <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {filteredHelpers.length} Available
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat Assistant */}
        <div className="w-1/3 min-w-[350px] bg-white border-r border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-[10px] mt-2 opacity-70 text-right`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-none p-4 flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about skills, experience..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12 text-sm shadow-sm"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1.5 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-2">
              AI can make mistakes. Please verify candidate details.
            </p>
          </div>
        </div>

        {/* Right: Candidate Grid */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
           {filteredHelpers.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-gray-400">
               <User className="w-16 h-16 mb-4 opacity-30" />
               <p>No candidates found in this category.</p>
             </div>
           ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredHelpers.map((helper) => (
                <div key={helper.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                     <div className="absolute -bottom-8 left-6">
                        <div className="w-16 h-16 rounded-full bg-white p-1 shadow-md">
                          <img 
                            src={`https://picsum.photos/seed/${helper.id}/200`} 
                            alt={helper.name} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                     </div>
                  </div>
                  
                  <div className="pt-10 px-6 pb-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{helper.name}</h3>
                        <p className="text-sm text-gray-500">{helper.maritalStatus}, {helper.age} years old</p>
                      </div>
                      <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold">
                        <Star className="w-3 h-3 fill-yellow-500 mr-1" />
                        {helper.rating}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 italic">"{helper.bio}"</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {helper.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                      {helper.skills.length > 3 && (
                        <span className="text-[10px] text-gray-400 py-1">+ {helper.skills.length - 3} more</span>
                      )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center text-sm mb-4">
                        <div className="flex items-center gap-2">
                             <span className="text-gray-500">Exp: <span className="font-semibold text-gray-900">{helper.experienceYears}Y</span></span>
                             <button
                               onClick={() => setViewingProfile(helper)}
                               className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 text-xs font-medium ml-2"
                             >
                                <Eye className="w-3 h-3" /> View Resume
                             </button>
                        </div>
                        {helper.verified ? (
                          <span className="text-green-600 text-xs font-medium flex items-center bg-green-50 px-2 py-1 rounded-full border border-green-100">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                          </span>
                        ) : (
                          <span className="text-amber-600 text-xs font-medium flex items-center bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                             <ShieldAlert className="w-3 h-3 mr-1" /> Pending
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => onSelectCandidate(helper)}
                        disabled={!helper.verified}
                        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center ${
                          helper.verified 
                            ? 'bg-gray-900 text-white hover:bg-gray-800' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                      >
                         {helper.verified ? 'Select Candidate' : 'Verification Pending'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
           )}
        </div>

        {/* Resume Modal */}
        <ResumeModal profile={viewingProfile!} onClose={() => setViewingProfile(null)} />
      </div>
    </div>
  );
};

export default AssistantChat;