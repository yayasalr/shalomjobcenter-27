
export interface JobApplicationFormData {
  jobId: string;
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
}

export interface JobApplication extends JobApplicationFormData {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
}
