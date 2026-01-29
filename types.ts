export enum UserRole {
  ADMIN = 'ADMIN', // The "User" who builds the database
  EMPLOYER = 'EMPLOYER', // The one hiring
  GUEST = 'GUEST'
}

export enum HelperCategory {
  HOUSE_HELP = 'House Help',
  GARDENER = 'Gardener',
  COOK = 'Cook',
  DRIVER = 'Driver',
  NANNY = 'Nanny'
}

export interface HelperProfile {
  id: string;
  name: string;
  category: HelperCategory;
  experienceYears: number;
  age: number;
  maritalStatus: string;
  skills: string[];
  bio: string;
  availability: string;
  rating: number; // 1-5
  avatarUrl?: string;
  resumeUrl?: string; // URL for the uploaded resume
  verified: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppView {
  LOGIN = 'LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  EMPLOYER_DASHBOARD = 'EMPLOYER_DASHBOARD',
  ASSISTANT_CHAT = 'ASSISTANT_CHAT',
  DOCUMENTATION = 'DOCUMENTATION'
}

export interface DocumentationStep {
  id: string;
  title: string;
  status: 'pending' | 'completed' | 'active';
  description: string;
}

export interface EmployerLead {
  id: string;
  employerName: string;
  contactNumber: string;
  requirementSummary: string;
  category: HelperCategory;
  processStep: number; // 0 to 6 based on flow
  paymentDetails: {
    packageFee: number;
    amountPaid: number;
    currency: string;
    status: 'Pending' | 'Partial' | 'Paid';
  };
  createdAt: Date;
}

export const PROCESS_STEPS = [
  'Requirements Captured',
  'Package Selection',
  'Lead Created / Branch Info',
  'Interview Timings Set',
  'WhatsApp Group Created',
  'Shortlisting & Interviews',
  'Confirmation'
];