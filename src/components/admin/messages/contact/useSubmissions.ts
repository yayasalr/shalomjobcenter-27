
import { useState, useEffect } from 'react';
import { ContactFormSubmission } from '@/types/contact';
import { toast } from 'sonner';

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactFormSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactFormSubmission | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'new'>('all');
  const [responseText, setResponseText] = useState('');
  const [forwardEmail, setForwardEmail] = useState('');
  const [isForwarding, setIsForwarding] = useState(false);

  useEffect(() => {
    const storedSubmissions = localStorage.getItem('contactFormSubmissions');
    if (storedSubmissions) {
      try {
        const parsedSubmissions = JSON.parse(storedSubmissions, (key, value) => {
          if (key === 'createdAt' && typeof value === 'string') {
            return new Date(value);
          }
          return value;
        });
        
        const validatedSubmissions = parsedSubmissions.map((sub: any) => {
          if (sub.status !== 'new' && sub.status !== 'read' && sub.status !== 'responded') {
            sub.status = 'new';
          }
          return sub as ContactFormSubmission;
        });
        
        setSubmissions(validatedSubmissions);
      } catch (error) {
        console.error("Erreur lors du chargement des soumissions:", error);
        setSubmissions([]);
      }
    }
  }, []);

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'new') {
      return matchesSearch && sub.status === 'new';
    }
    
    return matchesSearch;
  });

  const handleSelectSubmission = (submission: ContactFormSubmission) => {
    if (submission.status === 'new') {
      const updatedSubmissions = submissions.map(sub => 
        sub.id === submission.id ? { ...sub, status: 'read' as const } : sub
      );
      setSubmissions(updatedSubmissions);
      localStorage.setItem('contactFormSubmissions', JSON.stringify(updatedSubmissions));
      
      submission = { ...submission, status: 'read' as const };
    }
    
    setSelectedSubmission(submission);
  };

  const handleSendResponse = () => {
    if (!selectedSubmission || !responseText.trim()) return;
    
    const updatedSubmissions = submissions.map(sub => 
      sub.id === selectedSubmission.id ? { ...sub, status: 'responded' as const } : sub
    );
    
    setSubmissions(updatedSubmissions);
    localStorage.setItem('contactFormSubmissions', JSON.stringify(updatedSubmissions));
    
    setSelectedSubmission({ ...selectedSubmission, status: 'responded' as const });
    
    // Simulation d'envoi d'email
    toast.success(`Réponse envoyée à ${selectedSubmission.email}`, {
      description: "Le message a été envoyé avec succès."
    });
    
    console.log(`Response sent to ${selectedSubmission.email}: ${responseText}`);
    setResponseText('');
  };

  const handleForwardSubmission = () => {
    if (!selectedSubmission || !forwardEmail.trim()) return;
    
    setIsForwarding(true);
    
    // Simulation d'envoi d'email
    setTimeout(() => {
      toast.success(`Formulaire transféré à ${forwardEmail}`, {
        description: "Le formulaire de contact a été transféré avec succès."
      });
      
      setIsForwarding(false);
      setForwardEmail('');
    }, 1500);
  };

  const handleBulkForward = () => {
    if (!forwardEmail.trim() || filteredSubmissions.length === 0) return;
    
    setIsForwarding(true);
    
    // Simulation d'envoi d'email
    setTimeout(() => {
      toast.success(`${filteredSubmissions.length} formulaires transférés à ${forwardEmail}`, {
        description: "Les formulaires de contact ont été transférés avec succès."
      });
      
      setIsForwarding(false);
      setForwardEmail('');
    }, 1500);
  };

  const newSubmissionsCount = submissions.filter(sub => sub.status === 'new').length;

  return {
    submissions,
    selectedSubmission,
    searchQuery,
    filter,
    responseText,
    forwardEmail,
    isForwarding,
    newSubmissionsCount,
    filteredSubmissions,
    setSubmissions,
    setSelectedSubmission,
    setSearchQuery,
    setFilter,
    setResponseText,
    setForwardEmail,
    setIsForwarding,
    handleSelectSubmission,
    handleSendResponse,
    handleForwardSubmission,
    handleBulkForward
  };
};
