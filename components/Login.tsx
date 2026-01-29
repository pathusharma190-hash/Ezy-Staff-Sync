import React from 'react';
import { UserRole } from '../types';
import { Shield, Briefcase, UserCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Brand Side */}
        <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
             <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
             </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 z-10">StaffSync AI</h1>
          <p className="text-indigo-100 text-lg z-10 leading-relaxed">
            The intelligent database for household staffing. Use AI to build your database and find the perfect match in minutes.
          </p>
          <div className="mt-8 z-10 flex gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">AI Powered</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">Verified</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">Secure</span>
          </div>
        </div>

        {/* Login Options Side */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Welcome Back</h2>
          
          <div className="space-y-4">
            <button 
              onClick={() => onLogin(UserRole.EMPLOYER)}
              className="w-full group p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 flex items-center gap-4 text-left"
            >
              <div className="bg-indigo-100 p-3 rounded-lg group-hover:bg-indigo-200 transition-colors">
                <Briefcase className="w-6 h-6 text-indigo-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Employer Login</h3>
                <p className="text-sm text-gray-500">I am looking to hire staff</p>
              </div>
            </button>

            <button 
              onClick={() => onLogin(UserRole.ADMIN)}
              className="w-full group p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center gap-4 text-left"
            >
               <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Shield className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Admin / Agency</h3>
                <p className="text-sm text-gray-500">I want to build the database</p>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">By logging in, you agree to our Terms of Service & Privacy Policy</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
