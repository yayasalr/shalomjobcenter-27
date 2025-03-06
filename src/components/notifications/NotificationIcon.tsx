
import React from 'react';
import { MessageSquare, Calendar, CreditCard, AlertTriangle, Info } from 'lucide-react';
import { Notification } from './types';

interface NotificationIconProps {
  type: Notification['type'];
}

const NotificationIcon = ({ type }: NotificationIconProps) => {
  switch (type) {
    case 'message':
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case 'reservation':
      return <Calendar className="h-5 w-5 text-green-500" />;
    case 'payment':
      return <CreditCard className="h-5 w-5 text-purple-500" />;
    case 'alert':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'system':
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

export default NotificationIcon;
