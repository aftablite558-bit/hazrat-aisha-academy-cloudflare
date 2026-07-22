import { BaseEntity, EntityStatus } from './master';

export interface Notice extends BaseEntity {
  title: string;
  category: string;
  description: string;
  attachmentUrl?: string;
  publishDate: string;
  expiryDate: string;
  isPublished: boolean;
  priority: 'High' | 'Normal' | 'Low';
  createdBy: string;
}

export interface GalleryAlbum extends BaseEntity {
  title: string;
  description: string;
  images: string[];
  eventDate: string;
  isPublished: boolean;
}

export interface CalendarEvent extends BaseEntity {
  title: string;
  date: string;
  category: string;
  description: string;
  isHoliday: boolean;
  isExamination: boolean;
  isPublished: boolean;
}

export interface Document extends BaseEntity {
  title: string;
  category: string;
  fileUrl: string;
  isPublished: boolean;
  downloadCount: number;
}

export interface Facility extends BaseEntity {
  title: string;
  description: string;
  images: string[];
  displayOrder: number;
  isPublished: boolean;
}

export interface CareerVacancy extends BaseEntity {
  jobTitle: string;
  department: string;
  qualification: string;
  experience: string;
  lastDate: string;
  description: string;
  status: EntityStatus;
}

export interface CareerApplication extends BaseEntity {
  applicantName: string;
  appliedPosition: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  resumeUrl: string;
  appliedDate: string;
  status: 'Pending' | 'Under Review' | 'Shortlisted' | 'Accepted' | 'Rejected';
  notes?: string;
  decisionDate?: string;
  decisionBy?: string;
}

export interface AlumniProfile extends BaseEntity {
  name: string;
  batch: string;
  profession: string;
  company: string;
  photoUrl: string;
  achievement: string;
  isPublished: boolean;
}

export interface Enquiry extends BaseEntity {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: 'Pending' | 'Resolved';
}

export interface Testimonial extends BaseEntity {
  name: string;
  role: string;
  content: string;
  photoUrl?: string;
  rating: number;
  isPublished: boolean;
}

export interface Achievement extends BaseEntity {
  title: string;
  category: string;
  description: string;
  date: string;
  imageUrl?: string;
  isPublished: boolean;
}

export interface FeedbackTicket extends BaseEntity {
  ticketId: string;
  name: string;
  mobile: string;
  email?: string;
  category: 'Appreciation' | 'Complaint' | 'Suggestion' | 'Issue Report';
  subject: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
  internalNotes?: string;
  submittedAt: string;
}
