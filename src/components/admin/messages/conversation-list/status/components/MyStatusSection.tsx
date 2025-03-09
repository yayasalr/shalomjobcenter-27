
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Edit, Camera } from 'lucide-react';
import { MyStatusSectionProps } from '../types';

const MyStatusSection: React.FC<MyStatusSectionProps> = ({ 
  myStatus, 
  onTextClick, 
  onImageClick, 
  onStatusClick 
}) => {
  return (
    <div className="p-3 border-b">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Mon statut</h3>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500" 
            onClick={onTextClick}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500" 
            onClick={onImageClick}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* My recent status */}
      <div 
        className="flex items-center mt-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
        onClick={() => onStatusClick(myStatus)}
      >
        <Avatar className="h-12 w-12 mr-3">
          <img src={myStatus.user.avatar} alt={myStatus.user.name} />
        </Avatar>
        <div>
          <p className="font-medium">Mon statut</p>
          <p className="text-xs text-gray-500">
            Il y a {Math.floor(Math.random() * 59) + 1} min
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyStatusSection;
