
import React from 'react';
import { Megaphone, LayoutTemplate, Shield } from 'lucide-react';

export const getTypeIcon = (type: 'announcement' | 'promotion' | 'info' | 'alert') => {
  switch (type) {
    case 'announcement':
      return <Megaphone className="h-5 w-5" />;
    case 'promotion':
      return <LayoutTemplate className="h-5 w-5" />;
    case 'info':
      return <Shield className="h-5 w-5" />;
    case 'alert':
      return <Shield className="h-5 w-5 text-red-500" />;
    default:
      return <Megaphone className="h-5 w-5" />;
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};
