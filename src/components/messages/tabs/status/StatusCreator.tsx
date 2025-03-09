
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Edit, X } from 'lucide-react';
import { StatusCreatorProps } from './types';
import TextStatusForm from './TextStatusForm';
import { createNewStatus, isValidTextStatus } from './utils/statusUtils';

const StatusCreator: React.FC<StatusCreatorProps> = ({ onStatusCreated }) => {
  const [showTextForm, setShowTextForm] = useState(false);
  const [textStatus, setTextStatus] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'text' | 'image' | null>(null);
  
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidTextStatus(textStatus)) {
      return;
    }
    
    // Create and publish text status
    const newStatus = createNewStatus(
      { name: "Moi", avatar: "/placeholder.svg" },
      textStatus
    );
    
    onStatusCreated(newStatus);
    
    // Reset form
    setTextStatus('');
    setShowTextForm(false);
  };
  
  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setPreviewMode('image');
        }
      };
      
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleImageSubmit = () => {
    if (!selectedImage) return;
    
    // Create and publish image status
    const newStatus = createNewStatus(
      { name: "Moi", avatar: "/placeholder.svg" },
      undefined,
      selectedImage
    );
    
    onStatusCreated(newStatus);
    
    // Reset form
    setSelectedImage(null);
    setPreviewMode(null);
  };
  
  const handleCancel = () => {
    setShowTextForm(false);
    setTextStatus('');
    setSelectedImage(null);
    setPreviewMode(null);
  };
  
  if (previewMode === 'image') {
    return (
      <div className="p-3 border-b">
        <div className="relative border rounded-lg overflow-hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 text-white z-10 bg-black/50"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <img 
            src={selectedImage || ''} 
            alt="Status preview" 
            className="w-full h-48 object-cover" 
          />
          
          <div className="p-3 flex justify-end">
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={handleImageSubmit}
            >
              Publier
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-3 border-b">
      {!showTextForm ? (
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Créer un statut</h3>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500"
              onClick={() => setShowTextForm(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500"
              onClick={() => document.getElementById('image-input')?.click()}
            >
              <Camera className="h-4 w-4" />
              <input 
                type="file" 
                id="image-input" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageSelected}
              />
            </Button>
          </div>
        </div>
      ) : (
        <TextStatusForm 
          textStatus={textStatus}
          setTextStatus={setTextStatus}
          onSubmit={handleTextSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default StatusCreator;
