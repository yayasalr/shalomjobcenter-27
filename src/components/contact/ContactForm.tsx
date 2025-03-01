
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { ContactFormSubmission } from '@/types/contact';

const ContactForm = () => {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    department: 'support',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, department: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create a new contact form submission
    const newSubmission: ContactFormSubmission = {
      id: `contact-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      department: formData.department,
      status: 'new',
      createdAt: new Date(),
    };
    
    // Get existing submissions or initialize an empty array
    const existingSubmissions = JSON.parse(localStorage.getItem('contactFormSubmissions') || '[]');
    
    // Add new submission to the array
    const updatedSubmissions = [newSubmission, ...existingSubmissions];
    
    // Save updated submissions to localStorage
    localStorage.setItem('contactFormSubmissions', JSON.stringify(updatedSubmissions));
    
    // Send notification email to admin if enabled
    if (settings.notificationSettings?.newContactFormAlert && settings.adminEmail) {
      console.log('Sending notification email to admin:', settings.adminEmail);
      // Dans une application réelle, nous utiliserions une API pour envoyer l'email
    }
    
    // Show success message
    setTimeout(() => {
      toast.success('Votre message a été envoyé avec succès!', {
        description: 'Nous vous répondrons dans les plus brefs délais.',
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        department: 'support',
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="md:col-span-3 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6" style={{ color: settings.primaryColor }}>Envoyez-nous un message</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom complet"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre.email@example.com"
              required
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Sujet</Label>
            <Input 
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Sujet de votre message"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Département</Label>
            <Select
              value={formData.department}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Sélectionnez un département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="support">Support technique</SelectItem>
                <SelectItem value="sales">Service commercial</SelectItem>
                <SelectItem value="billing">Facturation</SelectItem>
                <SelectItem value="general">Questions générales</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea 
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Écrivez votre message ici..."
            className="min-h-[150px]"
            required
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="px-8" 
            disabled={isSubmitting}
            style={{ 
              backgroundColor: settings.primaryColor,
              borderColor: settings.primaryColor
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="mr-2 h-4 w-4" />
                Envoyer
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
