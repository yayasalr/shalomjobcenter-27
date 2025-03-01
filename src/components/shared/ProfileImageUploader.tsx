
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UploadCloud, User } from 'lucide-react';

interface ProfileImageUploaderProps {
  currentImage?: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  currentImage = '/placeholder.svg',
  onImageChange,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  return (
    <div className={`profile-image-container ${sizeClasses[size]} ${className}`}>
      <Avatar className="w-full h-full">
        <AvatarImage src={currentImage} alt="Profile image" />
        <AvatarFallback>
          <User className="w-1/2 h-1/2" />
        </AvatarFallback>
      </Avatar>
      
      <div className="image-upload-overlay">
        <label htmlFor="profile-image-upload" className="cursor-pointer">
          <Button type="button" size="sm" variant="ghost" className="text-white">
            <UploadCloud className="w-6 h-6" />
          </Button>
        </label>
        <input
          id="profile-image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageChange}
        />
      </div>
    </div>
  );
};

export default ProfileImageUploader;
