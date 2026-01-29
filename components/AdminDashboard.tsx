import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, Loader2, Database, Trash2, Download, XCircle, Eye, Users, DollarSign, Clock, Check, LayoutDashboard, LogOut, Settings, FileText } from 'lucide-react';
import { HelperProfile, EmployerLead, PROCESS_STEPS } from '../types';
import { extractProfileFromText } from '../services/geminiService';
import ResumeModal from './ResumeModal';

interface AdminDashboardProps {
  helpers: HelperProfile[];
  setHelpers: React.Dispatch<React.SetStateAction<HelperProfile[]>>;
  leads: EmployerLead[];
  onLogout: () => void;
  onToggleVerification: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ helpers, setHelpers, leads, onLogout, onToggleVerification }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'DATABASE' | 'LEADS'>('HOME');
  
  // Database State
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [viewingProfile, setViewingProfile] = useState<HelperProfile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lead State
  const [selectedLead, setSelectedLead] = useState<EmployerLead | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadStatus(`Analyzing ${file.name}...`);

    try {
      const resumeUrl = URL.createObjectURL(file);
      let textContent = `This is a resume for a ${file.name}`;
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newProfile = await extractProfileFromText(textContent, file.name);
      const profileWithResume = { ...newProfile, resumeUrl };
      setHelpers(prev => [profileWithResume, ...prev]);
      setUploadStatus('Profile extracted and saved to database successfully!');
    } catch (error) {
      setUploadStatus('Error processing file. Please try again.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const deleteHelper = (id: string) => {
    setHelpers(prev => prev.filter(h => h.id !== id));
  };

  // Dashboard Stats Configuration matching the image
  const DASHBOARD_CARDS = [
    // Row 1: Cyans & Blues
    { title: "Active Cases", count: 124, color: "bg-[#0ea5e9]" },
    { title: "Shortlisting", count: 45, color: "bg-[#0284c7]" },
    { title: "Interviews", count: 12, color: "bg-[#2563eb]" },
    { title: "Helper Booking", count: 8, color: "bg-[#1d4ed8]" },
    { title: "Pending Deposits", count: 5, color: "bg-[#1e40af]" },
    
    // Row 2: Deep Blues & Purples
    { title: "Pending PPT, Medical, Sch Cert", count: 14, color: "bg-[#1e1b4b]" },
    { title: "Pending IPA Approvals", count: 7, color: "bg-[#312e81]" },
    { title: "IPA Approved", count: 23, color: "bg-[#4338ca]" },
    { title: "Indo EC Processing", count: 9, color: "bg-[#6d28d9]" },
    { title: "Phil EC Processing", count: 4, color: "bg-[#7c3aed]" },

    // Row 3: Magentas & Pinks
    { title: "Arrivals", count: 6, color: "bg-[#86198f]" },
    { title: "Handover", count: 18, color: "bg-[#a21caf]" },
    { title: "PPC", count: 3, color: "bg-[#be185d]" },
    { title: "Counselling", count: 2, color: "bg-[#9d174d]" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
           <div className="bg-primary-600 p-2 rounded-lg">
              <Database className="text-white w-5 h-5" />
           </div>
           <span className="text-xl font-bold text-gray-900">StaffSync AI</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab('HOME')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              activeTab === 'HOME' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Home Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('DATABASE')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              activeTab === 'DATABASE' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            Candidates DB
          </button>

          <button
            onClick={() => setActiveTab('LEADS')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              activeTab === 'LEADS' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            Employer Leads
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8 w-full">
        
        {/* === HOME DASHBOARD VIEW === */}
        {activeTab === 'HOME' && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8 uppercase tracking-wide">Home Dashboard</h1>
            
            <div className="flex flex-wrap gap-4">
               {/* Row 1 */}
               <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  {DASHBOARD_CARDS.slice(0, 5).map((card, idx) => (
                    <div key={idx} className={`${card.color} text-white p-6 rounded-lg shadow-sm flex flex-col justify-between h-32 transition-transform hover:scale-[1.02] cursor-pointer`}>
                      <span className="text-sm font-medium leading-tight opacity-90">{card.title}</span>
                      <span className="text-3xl font-bold">{card.count}</span>
                    </div>
                  ))}
               </div>

               {/* Row 2 */}
               <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  {DASHBOARD_CARDS.slice(5, 10).map((card, idx) => (
                    <div key={idx} className={`${card.color} text-white p-6 rounded-lg shadow-sm flex flex-col justify-between h-32 transition-transform hover:scale-[1.02] cursor-pointer`}>
                      <span className="text-sm font-medium leading-tight opacity-90">{card.title}</span>
                      <span className="text-3xl font-bold">{card.count}</span>
                    </div>
                  ))}
               </div>

               {/* Row 3 */}
               <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {DASHBOARD_CARDS.slice(10, 14).map((card, idx) => (
                    <div key={idx} className={`${card.color} text-white p-6 rounded-lg shadow-sm flex flex-col justify-between h-32 transition-transform hover:scale-[1.02] cursor-pointer`}>
                      <span className="text-sm font-medium leading-tight opacity-90">{card.title}</span>
                      <span className="text-3xl font-bold">{card.count}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* === CANDIDATE DATABASE VIEW === */}
        {activeTab === 'DATABASE' && (
            <div className="max-w-7xl mx-auto">
                {/* Upload Section */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Build Your Database</h2>
                    <p className="text-gray-500 mb-8">Upload resumes (PDF, DOCX) to automatically extract candidate data using AI.</p>
                    
                    <div 
                    className={`border-2 border-dashed rounded-xl p-10 transition-colors ${isProcessing ? 'bg-gray-50 border-gray-300' : 'border-primary-300 hover:bg-primary-50 cursor-pointer'}`}
                    onClick={() => !isProcessing && fileInputRef.current?.click()}
                    >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                        disabled={isProcessing}
                    />
                    
                    {isProcessing ? (
                        <div className="flex flex-col items-center">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                        <p className="text-primary-700 font-medium">{uploadStatus}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-primary-500 mb-4" />
                        <p className="text-lg font-medium text-gray-900">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-400 mt-2">PDF, Word, or Text files</p>
                        </div>
                    )}
                    </div>

                    {uploadStatus && !isProcessing && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-green-600 bg-green-50 py-2 px-4 rounded-lg inline-flex">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">{uploadStatus}</span>
                    </div>
                    )}
                </div>
                </section>

                {/* Database List */}
                <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Current Database ({helpers.length})</h3>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">Sync Status: Active</span>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {helpers.length === 0 ? (
                            <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                No profiles found. Upload a resume to get started.
                            </td>
                            </tr>
                        ) : (
                            helpers.map((helper) => (
                            <tr key={helper.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                        {helper.name.charAt(0)}
                                    </div>
                                    </div>
                                    <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{helper.name}</div>
                                    <div className="text-sm text-gray-500">{helper.age} yrs • {helper.maritalStatus}</div>
                                    </div>
                                </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {helper.category}
                                </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {helper.experienceYears} Years
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <button
                                    onClick={() => setViewingProfile(helper)}
                                    className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 text-sm font-medium bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100"
                                    >
                                        <Eye className="w-4 h-4" /> View
                                    </button>
                                    {helper.resumeUrl && (
                                        <a 
                                        href={helper.resumeUrl} 
                                        download={`${helper.name.replace(/\s+/g, '_')}_Resume`}
                                        className="text-gray-500 hover:text-gray-900 p-1"
                                        title="Download Only"
                                        onClick={(e) => {
                                            if (helper.resumeUrl === '#') {
                                            e.preventDefault();
                                            alert("Demo Mode: No PDF available.");
                                            }
                                        }}
                                        >
                                        <Download className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <button 
                                    onClick={() => onToggleVerification(helper.id)}
                                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors border ${
                                    helper.verified 
                                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                    }`}
                                >
                                    {helper.verified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                    {helper.verified ? 'Verified' : 'Unverified'}
                                </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => deleteHelper(helper.id)} className="text-red-600 hover:text-red-900" title="Delete Candidate">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                </td>
                            </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                    </div>
                </div>
                </section>
            </div>
        )}

        {/* === EMPLOYER LEADS VIEW === */}
        {activeTab === 'LEADS' && (
            <div className="max-w-7xl mx-auto h-[calc(100vh-64px)]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                    {/* Leads List */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-bold text-gray-900">Employer Leads</h3>
                            <p className="text-xs text-gray-500">Select a lead to manage process</p>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            {leads.map(lead => (
                                <div 
                                    key={lead.id}
                                    onClick={() => setSelectedLead(lead)}
                                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${selectedLead?.id === lead.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-gray-900 text-sm">{lead.employerName}</h4>
                                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{lead.category}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2 truncate">{lead.requirementSummary}</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                                            lead.paymentDetails.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                                            lead.paymentDetails.status === 'Partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {lead.paymentDetails.status}
                                        </span>
                                        <span className="text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lead Detail & Process Flow */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                        {selectedLead ? (
                            <>
                                {/* Header */}
                                <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedLead.employerName}</h2>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {selectedLead.contactNumber}</span>
                                            <span>•</span>
                                            <span className="text-indigo-600 font-medium">{selectedLead.requirementSummary}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Current Stage</p>
                                        <p className="font-bold text-indigo-600">{PROCESS_STEPS[selectedLead.processStep]}</p>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6">
                                    {/* Payment Details Tab */}
                                    <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-green-600" /> Payment Status
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                <p className="text-xs text-gray-500 uppercase">Package Fee</p>
                                                <p className="text-xl font-bold text-gray-900">{selectedLead.paymentDetails.currency} {selectedLead.paymentDetails.packageFee}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                <p className="text-xs text-gray-500 uppercase">Amount Paid</p>
                                                <p className="text-xl font-bold text-green-600">{selectedLead.paymentDetails.currency} {selectedLead.paymentDetails.amountPaid}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                <p className="text-xs text-gray-500 uppercase">Pending</p>
                                                <p className="text-xl font-bold text-red-600">
                                                    {selectedLead.paymentDetails.currency} {selectedLead.paymentDetails.packageFee - selectedLead.paymentDetails.amountPaid}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Process Flow Timeline */}
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-indigo-600" /> Hiring Process Flow
                                        </h3>
                                        <div className="relative">
                                            {/* Vertical Line */}
                                            <div className="absolute left-4 top-2 bottom-4 w-0.5 bg-gray-200"></div>

                                            <div className="space-y-6">
                                                {PROCESS_STEPS.map((step, index) => {
                                                    const isCompleted = index <= selectedLead.processStep;
                                                    const isCurrent = index === selectedLead.processStep;

                                                    return (
                                                        <div key={index} className="relative pl-12">
                                                            {/* Dot */}
                                                            <div className={`absolute left-2 top-1.5 w-4 h-4 rounded-full border-2 z-10 ${
                                                                isCompleted ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'
                                                            } -translate-x-1/2`}>
                                                                {isCompleted && <Check className="w-full h-full text-white p-0.5" />}
                                                            </div>

                                                            {/* Content */}
                                                            <div className={`p-4 rounded-lg border ${
                                                                isCurrent ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-gray-100'
                                                            }`}>
                                                                <h4 className={`font-bold ${isCurrent ? 'text-indigo-900' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                                    {step}
                                                                </h4>
                                                                {isCurrent && (
                                                                    <p className="text-sm text-indigo-700 mt-1">Action required for this step.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <Users className="w-16 h-16 mb-4 opacity-20" />
                                <p>Select a lead from the list to view details.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Modal */}
        <ResumeModal profile={viewingProfile!} onClose={() => setViewingProfile(null)} />

      </main>
    </div>
  );
};

export default AdminDashboard;