
import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Layout, X } from 'lucide-react';
import TextStatusForm from './TextStatusForm';
import ImageStatusPreview from './ImageStatusPreview';
import { Status, StatusCreatorProps } from './types';

const StatusCreator: React.FC<StatusCreatorProps> = ({ onStatusCreated }) => {
  const [creatorMode, setCreatorMode] = useState<'closed' | 'text' | 'image'>('closed');
  const [textStatus, setTextStatus] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle opening the text status creator
  const handleOpenTextCreator = () => {
    setCreatorMode('text');
    setSelectedImage(null);
  };
  
  // Handle opening the image status creator
  const handleOpenImageCreator = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle image selection
  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setCreatorMode('image');
    }
  };
  
  // Handle canceling the status creation
  const handleCancel = () => {
    setCreatorMode('closed');
    setTextStatus('');
    setSelectedImage(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle submitting a text status
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (textStatus.trim() === '') return;
    
    const newStatus: Status = {
      id: Date.now(),
      user: "You", // Current user
      avatar: "/placeholder.svg", // You can replace with actual user avatar
      isViewed: false,
      timestamp: new Date(),
      content: textStatus
    };
    
    onStatusCreated(newStatus);
    handleCancel();
  };
  
  // Handle publishing an image status
  const handleImagePublish = () => {
    if (!selectedImage) return;
    
    const newStatus: Status = {
      id: Date.now(),
      user: "You", // Current user
      avatar: "/placeholder.svg", // You can replace with actual user avatar
      isViewed: false,
      timestamp: new Date(),
      image: selectedImage,
      content: textStatus.trim() !== '' ? textStatus : undefined
    };
    
    onStatusCreated(newStatus);
    handleCancel();
  };
  
  return (
    <div className="p-3 border-b">
      {creatorMode === 'closed' && (
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 bg-gray-50"
            onClick={handleOpenTextCreator}
          >
            <Layout className="h-4 w-4 mr-2" />
            Create Status
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-gray-50"
            onClick={handleOpenImageCreator}
          >
            <Camera className="h-4 w-4" />
          </Button>
          
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*" 
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
      )}
      
      {creatorMode === 'text' && (
        <TextStatusForm
          textStatus={textStatus}
          setTextStatus={setTextStatus}
          onSubmit={handleTextSubmit}
          onCancel={handleCancel}
        />
      )}
      
      {creatorMode === 'image' && selectedImage && (
        <ImageStatusPreview
          imageUrl={selectedImage}
          onPublish={handleImagePublish}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default StatusCreator;
