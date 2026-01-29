import React, { useState } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import EmployerDashboard from './components/EmployerDashboard';
import AssistantChat from './components/AssistantChat';
import DocumentationFlow from './components/DocumentationFlow';
import { UserRole, HelperCategory, HelperProfile, AppView, EmployerLead } from './types';

// Mock initial data
const INITIAL_HELPERS: HelperProfile[] = [
  {
    id: '1',
    name: 'Maria Rodriguez',
    category: HelperCategory.HOUSE_HELP,
    experienceYears: 5,
    age: 34,
    maritalStatus: 'Married',
    skills: ['Deep Cleaning', 'Laundry', 'Pet Friendly'],
    bio: 'Efficient and reliable housekeeper with 5 years of experience in maintaining large households.',
    availability: 'Full-time',
    rating: 4.8,
    verified: true,
    resumeUrl: '#'
  },
  {
    id: '2',
    name: 'John Smith',
    category: HelperCategory.GARDENER,
    experienceYears: 8,
    age: 42,
    maritalStatus: 'Single',
    skills: ['Landscaping', 'Pruning', 'Irrigation Systems'],
    bio: 'Passionate gardener who specializes in sustainable landscaping and tropical plants.',
    availability: 'Part-time',
    rating: 4.9,
    verified: true,
    resumeUrl: '#'
  },
  {
    id: '3',
    name: 'Priya Patel',
    category: HelperCategory.COOK,
    experienceYears: 10,
    age: 38,
    maritalStatus: 'Married',
    skills: ['Indian Cuisine', 'Vegetarian', 'Meal Prep'],
    bio: 'Experienced cook specializing in healthy, home-style Indian and Continental meals.',
    availability: 'Full-time',
    rating: 5.0,
    verified: true,
    resumeUrl: '#'
  },
   {
    id: '4',
    name: 'Sarah Johnson',
    category: HelperCategory.NANNY,
    experienceYears: 4,
    age: 26,
    maritalStatus: 'Single',
    skills: ['CPR Certified', 'Tutoring', 'Newborn Care'],
    bio: 'Caring nanny with a background in early childhood education.',
    availability: 'Full-time',
    rating: 4.7,
    verified: true,
    resumeUrl: '#'
  },
  {
    id: '5',
    name: 'David Chen',
    category: HelperCategory.COOK,
    experienceYears: 15,
    age: 45,
    maritalStatus: 'Married',
    skills: ['Asian Cuisine', 'Pastry', 'Event Catering'],
    bio: 'Professional chef with hotel experience looking for private household opportunities.',
    availability: 'Contract',
    rating: 4.9,
    verified: true,
    resumeUrl: '#'
  }
];

// Mock Leads
const INITIAL_LEADS: EmployerLead[] = [
    {
        id: 'L1',
        employerName: 'Alice Anderson',
        contactNumber: '+1 555-0101',
        requirementSummary: 'Full-time Nanny for 2 kids',
        category: HelperCategory.NANNY,
        processStep: 4, // WhatsApp Group Created
        paymentDetails: {
            packageFee: 1200,
            amountPaid: 600,
            currency: '$',
            status: 'Partial'
        },
        createdAt: new Date('2023-10-15')
    },
    {
        id: 'L2',
        employerName: 'Bob Builder',
        contactNumber: '+1 555-0102',
        requirementSummary: 'Part-time Gardener, Weekends',
        category: HelperCategory.GARDENER,
        processStep: 1, // Package Selection
        paymentDetails: {
            packageFee: 400,
            amountPaid: 0,
            currency: '$',
            status: 'Pending'
        },
        createdAt: new Date('2023-10-20')
    },
    {
        id: 'L3',
        employerName: 'Charlie Chef',
        contactNumber: '+1 555-0103',
        requirementSummary: 'Live-in Cook, Asian Cuisine',
        category: HelperCategory.COOK,
        processStep: 6, // Confirmation
        paymentDetails: {
            packageFee: 2000,
            amountPaid: 2000,
            currency: '$',
            status: 'Paid'
        },
        createdAt: new Date('2023-10-01')
    }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  const [helpers, setHelpers] = useState<HelperProfile[]>(INITIAL_HELPERS);
  const [leads, setLeads] = useState<EmployerLead[]>(INITIAL_LEADS);
  const [selectedCategory, setSelectedCategory] = useState<HelperCategory | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<HelperProfile | null>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.ADMIN) {
      setCurrentView(AppView.ADMIN_DASHBOARD);
    } else {
      setCurrentView(AppView.EMPLOYER_DASHBOARD);
    }
  };

  const handleLogout = () => {
    setUserRole(UserRole.GUEST);
    setCurrentView(AppView.LOGIN);
    setSelectedCategory(null);
    setSelectedCandidate(null);
  };

  // Note: onSelectCategory is less relevant now with AI Chat in EmployerDashboard but kept for compatibility
  const handleCategorySelect = (category: HelperCategory) => {
    setSelectedCategory(category);
    // setCurrentView(AppView.ASSISTANT_CHAT); // Legacy flow
  };

  const handleCandidateSelect = (candidate: HelperProfile) => {
    setSelectedCandidate(candidate);
    setCurrentView(AppView.DOCUMENTATION);
  };

  const handleToggleVerification = (id: string) => {
    setHelpers(prev => prev.map(h => 
      h.id === id ? { ...h, verified: !h.verified } : h
    ));
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.LOGIN:
        return <Login onLogin={handleLogin} />;
      
      case AppView.ADMIN_DASHBOARD:
        return (
          <AdminDashboard 
            helpers={helpers} 
            setHelpers={setHelpers}
            leads={leads}
            onLogout={handleLogout} 
            onToggleVerification={handleToggleVerification}
          />
        );
      
      case AppView.EMPLOYER_DASHBOARD:
        return (
          <EmployerDashboard 
            onSelectCategory={handleCategorySelect} 
            helpers={helpers}
            onLogout={handleLogout} 
            onSelectCandidate={handleCandidateSelect}
          />
        );
      
      // Kept for backward compatibility if needed, though EmployerDashboard now handles search
      case AppView.ASSISTANT_CHAT:
        if (!selectedCategory) return <div>Error: No category selected</div>;
        return (
          <AssistantChat 
            category={selectedCategory} 
            helpers={helpers} 
            onBack={() => setCurrentView(AppView.EMPLOYER_DASHBOARD)}
            onSelectCandidate={handleCandidateSelect}
          />
        );

      case AppView.DOCUMENTATION:
        if (!selectedCandidate) return <div>Error: No candidate selected</div>;
        return (
          <DocumentationFlow 
            candidate={selectedCandidate}
            onCancel={() => setCurrentView(AppView.EMPLOYER_DASHBOARD)}
            onComplete={() => {
              alert("Process Completed Successfully!");
              setCurrentView(AppView.EMPLOYER_DASHBOARD);
            }}
          />
        );

      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="font-sans text-gray-900">
      {renderView()}
    </div>
  );
};

export default App;