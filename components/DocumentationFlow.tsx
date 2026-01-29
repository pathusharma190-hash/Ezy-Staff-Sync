import React, { useState } from 'react';
import { HelperProfile, DocumentationStep } from '../types';
import { Check, FileText, Download, Upload, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

interface DocumentationFlowProps {
  candidate: HelperProfile;
  onComplete: () => void;
  onCancel: () => void;
}

const DocumentationFlow: React.FC<DocumentationFlowProps> = ({ candidate, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);

  const steps: DocumentationStep[] = [
    { id: '1', title: 'Identity Verification', status: 'active', description: 'Confirming ID proof and background check status.' },
    { id: '2', title: 'Contract Generation', status: 'pending', description: 'Generating standard employment agreement.' },
    { id: '3', title: 'Digital Signature', status: 'pending', description: 'Awaiting employer digital signature.' },
    { id: '4', title: 'Payment Setup', status: 'pending', description: 'Setting up escrow for first month salary.' },
  ];

  const handleNext = () => {
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setProcessing(false);
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        onComplete();
      }
    }, 1500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Background Check Cleared</h4>
                <p className="text-sm text-green-700 mt-1">
                  {candidate.name}'s government ID and criminal record check have been verified by our partner agencies.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
               <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Documents on File</h4>
               <ul className="space-y-2 text-sm text-gray-700">
                 <li className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> National ID Card (Verified)</li>
                 <li className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> Police Clearance Certificate (Verified)</li>
                 <li className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> Reference Letter (Verified)</li>
               </ul>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
             <p className="text-sm text-gray-600">
               We are generating a standard employment contract compliant with local labor laws for {candidate.category}.
             </p>
             <div className="border rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center text-center">
                <FileText className="w-12 h-12 text-gray-400 mb-2" />
                <h4 className="font-medium text-gray-900">Employment_Contract_v1.pdf</h4>
                <p className="text-xs text-gray-500 mb-4">Generated today</p>
                <button className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
                  <Download className="w-4 h-4" /> Preview Draft
                </button>
             </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              Please review the contract terms above before signing.
            </div>
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type your full name to sign</label>
              <input type="text" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border" placeholder="e.g. John Doe" />
            </div>
          </div>
        );
      case 3:
         return (
           <div className="space-y-4">
             <p className="text-sm text-gray-600">Setup secure payment for the first month. Your funds are held in escrow until 7 days after the start date.</p>
             <div className="bg-gray-50 p-4 rounded-lg border flex items-center justify-between">
                <span className="font-medium text-gray-900">Total Due</span>
                <span className="text-xl font-bold text-gray-900">$450.00</span>
             </div>
             <button className="w-full py-3 bg-black text-white rounded-lg flex items-center justify-center gap-2">
               Pay Securely
             </button>
           </div>
         )
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Sidebar Steps */}
        <div className="w-full md:w-1/3 bg-gray-900 p-8 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-8">Hiring Process</h2>
            <div className="space-y-8 relative">
              {/* Vertical line */}
              <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-700 -z-10"></div>
              
              {steps.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    index <= currentStep ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {index < currentStep ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
                  </div>
                  <div>
                    <h3 className={`font-medium ${index <= currentStep ? 'text-white' : 'text-gray-400'}`}>{step.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800">
             <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3">Candidate</h4>
             <div className="flex items-center gap-3">
               <img src={`https://picsum.photos/seed/${candidate.id}/100`} className="w-10 h-10 rounded-full" alt="" />
               <div>
                 <p className="font-medium text-sm">{candidate.name}</p>
                 <p className="text-xs text-gray-400">{candidate.category}</p>
               </div>
             </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 md:p-12 flex flex-col">
          <div className="mb-6">
             <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep].title}</h2>
             <p className="text-gray-500 mt-1">{steps[currentStep].description}</p>
          </div>

          <div className="flex-1">
            {renderStepContent()}
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
             <button 
               onClick={onCancel}
               className="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
             >
               Cancel
             </button>
             <button 
               onClick={handleNext}
               disabled={processing}
               className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-70"
             >
               {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
               {currentStep === steps.length - 1 ? 'Complete Hiring' : 'Continue'}
               {!processing && <ArrowRight className="w-4 h-4" />}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationFlow;
