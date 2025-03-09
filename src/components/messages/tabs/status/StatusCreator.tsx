
import React, { useState } from 'react';
import { Plus, Camera, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { StatusCreatorProps } from './types';
import TextStatusForm from './TextStatusForm';
import ImageStatusPreview from './ImageStatusPreview';

const StatusCreator: React.FC<StatusCreatorProps> = ({ onStatusCreated }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [textStatus, setTextStatus] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Handle status creation type selection
  const handleCreateStatus = (type: 'photo' | 'text') => {
    if (type === 'photo') {
      setShowTextInput(false);
    } else {
      setShowTextInput(true);
      setSelectedImage(null);
    }
  };
  
  // Handle image upload
  const handleImageUpload = (file: File) => {
    setIsUploading(true);
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    
    // Simulate upload completion
    setTimeout(() => {
      setIsUploading(false);
    }, 1000);
  };
  
  // Publish image status
  const publishImageStatus = () => {
    if (!selectedImage) return;
    
    const newStatus = {
      id: Date.now(),
      user: "Vous",
      avatar: "/placeholder.svg",
      isViewed: false,
      timestamp: new Date(),
      image: selectedImage,
      content: undefined
    };
    
    onStatusCreated(newStatus);
    setSelectedImage(null);
    toast.success("Statut photo publié avec succès!");
  };
  
  // Handle text status submission
  const handleTextStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textStatus.trim()) return;
    
    const newStatus = {
      id: Date.now(),
      user: "Vous",
      avatar: "/placeholder.svg",
      isViewed: false,
      timestamp: new Date(),
      content: textStatus,
      image: undefined
    };
    
    onStatusCreated(newStatus);
    setTextStatus('');
    setShowTextInput(false);
    toast.success("Statut texte publié avec succès!");
  };
  
  // Cancel any status creation
  const cancelPublication = () => {
    setShowTextInput(false);
    setTextStatus('');
    setSelectedImage(null);
  };

  return (
    <div className="p-3 bg-white border-b">
      <div className="flex items-center mb-3">
        <div className="relative">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
            <Plus className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">Mon statut</p>
          <p className="text-xs text-gray-500">Appuyez pour ajouter un statut</p>
        </div>
      </div>
      
      {/* Image preview for publication */}
      {selectedImage && (
        <ImageStatusPreview 
          imageUrl={selectedImage}
          onPublish={publishImageStatus}
          onCancel={cancelPublication}
        />
      )}
      
      {/* Text status form */}
      {showTextInput ? (
        <TextStatusForm 
          textStatus={textStatus}
          setTextStatus={setTextStatus}
          onSubmit={handleTextStatusSubmit}
          onCancel={cancelPublication}
        />
      ) : (
        !selectedImage && (
          <div className="flex space-x-2 mt-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 bg-green-50 border-green-100 hover:bg-green-100 text-green-600"
              onClick={() => handleCreateStatus('photo')}
            >
              <Camera className="h-4 w-4 mr-1" />
              Photo
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 bg-blue-50 border-blue-100 hover:bg-blue-100 text-blue-600"
              onClick={() => handleCreateStatus('text')}
            >
              <Edit className="h-4 w-4 mr-1" />
              Texte
            </Button>
          </div>
        )
      )}
      
      {/* Show image uploader only when needed */}
      {!showTextInput && !selectedImage && (
        <div className="mt-3">
          <ImageUploader
            onImageUpload={handleImageUpload}
            isUploading={isUploading}
            label="Ajouter une photo pour votre statut"
            className="w-full"
            buttonVariant="outline"
            buttonSize="default"
          />
        </div>
      )}
    </div>
  );
};

export default StatusCreator;
