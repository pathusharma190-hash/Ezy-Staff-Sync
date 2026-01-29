import React from 'react';
import { HelperProfile } from '../types';
import { X, Download, Star, MapPin, Phone, Mail, Briefcase, Award, User, Circle } from 'lucide-react';

interface ResumeModalProps {
  profile: HelperProfile;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ profile, onClose }) => {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            {/* Modal Content - Resume Layout */}
            <div className="bg-white relative">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-1 bg-white rounded-full shadow-sm hover:shadow-md transition-all">
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col md:flex-row min-h-[700px]">
                    {/* Left Sidebar */}
                    <div className="w-full md:w-1/3 bg-slate-900 text-white p-8">
                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="w-32 h-32 rounded-full border-4 border-slate-700 overflow-hidden mb-6 bg-white shadow-lg">
                                <img 
                                    src={profile.avatarUrl || `https://picsum.photos/seed/${profile.id}/300`} 
                                    alt={profile.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">{profile.name}</h2>
                            <p className="text-indigo-400 font-medium uppercase tracking-widest text-sm mt-2">{profile.category}</p>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    Contact Details
                                </h3>
                                <ul className="space-y-3 text-sm text-slate-300">
                                    <li className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-lg">
                                        <Phone className="w-4 h-4 text-indigo-400" /> 
                                        <span>+1 (555) 000-0000</span>
                                    </li>
                                    <li className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-lg">
                                        <Mail className="w-4 h-4 text-indigo-400" /> 
                                        <span className="truncate">candidate@staffsync.ai</span>
                                    </li>
                                    <li className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-lg">
                                        <MapPin className="w-4 h-4 text-indigo-400" /> 
                                        <span>New York, USA</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((skill, i) => (
                                        <span key={i} className="bg-indigo-600/20 text-indigo-200 border border-indigo-600/30 px-3 py-1.5 rounded-full text-xs font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Languages</h3>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <Circle className="w-2 h-2 fill-indigo-500 text-indigo-500" /> English (Native)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Circle className="w-2 h-2 fill-indigo-500 text-indigo-500" /> Spanish (Conversational)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="w-full md:w-2/3 p-8 md:p-12 bg-white overflow-y-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-gray-100 gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Profile</h1>
                                <div className="flex items-center gap-3">
                                     <div className="flex text-yellow-400 bg-yellow-50 px-2 py-1 rounded-lg">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(profile.rating) ? 'fill-current' : 'text-gray-300'}`} />
                                        ))}
                                        <span className="text-yellow-700 text-sm font-bold ml-2">{profile.rating}</span>
                                    </div>
                                    <span className="text-gray-400 text-sm">|</span>
                                    <span className="text-gray-500 text-sm font-medium">{profile.verified ? 'Verified Candidate' : 'Pending Verification'}</span>
                                </div>
                            </div>
                            
                            {profile.resumeUrl && (
                                <a 
                                    href={profile.resumeUrl}
                                    download={`${profile.name.replace(/\s+/g, '_')}_Resume`}
                                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg text-sm font-medium transform active:scale-95"
                                    onClick={(e) => {
                                        if(profile.resumeUrl === '#') {
                                            e.preventDefault();
                                            alert("Demo Mode: No real PDF file attached. In a real app, this downloads the document.");
                                        }
                                    }}
                                >
                                    <Download className="w-4 h-4" /> Download PDF
                                </a>
                            )}
                        </div>

                        <div className="space-y-10">
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                                    <div className="p-1.5 bg-indigo-100 rounded-md text-indigo-600">
                                        <User className="w-5 h-5" /> 
                                    </div>
                                    Executive Summary
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-base bg-gray-50 p-6 rounded-xl border border-gray-100 italic">
                                    "{profile.bio}"
                                </p>
                            </section>

                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                                    <div className="p-1.5 bg-indigo-100 rounded-md text-indigo-600">
                                        <Briefcase className="w-5 h-5" /> 
                                    </div>
                                    Professional Overview
                                </h3>
                                <div className="border-l-2 border-indigo-100 pl-6 ml-2 space-y-8">
                                    <div className="relative">
                                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-indigo-500 bg-white"></div>
                                        <h4 className="font-bold text-gray-900 text-lg">{profile.category} Specialist</h4>
                                        <p className="text-sm text-indigo-600 font-medium mb-3">Various Households • {profile.experienceYears} Years Experience</p>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            Proven track record of reliability and excellence in {profile.category.toLowerCase()} services. 
                                            Expertise includes {profile.skills.slice(0, 3).join(', ')}. 
                                            Consistently rated high for punctuality and quality of work.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                                    <div className="p-1.5 bg-indigo-100 rounded-md text-indigo-600">
                                        <Award className="w-5 h-5" /> 
                                    </div>
                                    Key Attributes
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                        <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Total Experience</span>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{profile.experienceYears} <span className="text-sm font-normal text-gray-500">Years</span></p>
                                    </div>
                                    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                        <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Availability</span>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{profile.availability}</p>
                                    </div>
                                    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                        <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Age</span>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{profile.age}</p>
                                    </div>
                                    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                        <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Marital Status</span>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{profile.maritalStatus}</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;