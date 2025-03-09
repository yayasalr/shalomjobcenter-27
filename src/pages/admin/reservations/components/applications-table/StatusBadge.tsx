
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, X } from 'lucide-react';
import { useLanguage } from '@/hooks/language';

interface StatusBadgeProps {
  status: 'approved' | 'pending' | 'rejected';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();
  
  return (
    <Badge
      className={`${
        status === 'approved'
          ? 'bg-green-100 text-green-800 border-green-200'
          : status === 'pending'
          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
          : 'bg-red-100 text-red-800 border-red-200'
      }`}
    >
      {status === 'approved' ? (
        <>
          <Check className="mr-1 h-3.5 w-3.5" />
          {t('approved')}
        </>
      ) : status === 'pending' ? (
        <>
          <Clock className="mr-1 h-3.5 w-3.5" />
          {t('pending')}
        </>
      ) : (
        <>
          <X className="mr-1 h-3.5 w-3.5" />
          {t('rejected')}
        </>
      )}
    </Badge>
  );
};

export default StatusBadge;
