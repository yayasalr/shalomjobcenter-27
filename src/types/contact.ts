
export interface ContactFormSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  department: string;
  status: 'new' | 'read' | 'responded';
  createdAt: Date;
}
