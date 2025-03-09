
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus, Camera, Edit, ImageIcon, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { Textarea } from '@/components/ui/textarea';

interface Status {
  id: number;
  user: string;
  avatar: string;
  isViewed: boolean;
  timestamp: Date;
  content?: string;
  image?: string;
}

interface StatusTabContentProps {
  statuses: Status[];
}

const StatusTabContent: React.FC<StatusTabContentProps> = ({ statuses: initialStatuses }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [textStatus, setTextStatus] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>(initialStatuses);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewingStatus, setViewingStatus] = useState<Status | null>(null);
  
  // Handling status creation
  const handleCreateStatus = (type: 'photo' | 'text') => {
    if (type === 'photo') {
      // Show image uploader instead of toast
      setShowTextInput(false);
    } else {
      // Show the text field for status
      setShowTextInput(true);
      setSelectedImage(null);
    }
  };
  
  // Handle status image upload
  const handleImageUpload = (file: File) => {
    setIsUploading(true);
    
    // Create URL for the image
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
    }, 1000);
  };
  
  // Publish status with image
  const publishImageStatus = () => {
    if (!selectedImage) return;
    
    // Add the new status to the list
    const newStatus: Status = {
      id: Date.now(),
      user: "Vous",
      avatar: "/placeholder.svg",
      isViewed: false,
      timestamp: new Date(),
      image: selectedImage
    };
    
    setStatuses([newStatus, ...statuses]);
    setSelectedImage(null);
    
    toast.success("Photo status published successfully");
  };
  
  // Handle text status submission
  const handleTextStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textStatus.trim()) return;
    
    // Add the new status to the list
    const newStatus: Status = {
      id: Date.now(),
      user: "Vous",
      avatar: "/placeholder.svg",
      isViewed: false,
      timestamp: new Date(),
      content: textStatus
    };
    
    setStatuses([newStatus, ...statuses]);
    setTextStatus('');
    setShowTextInput(false);
    
    toast.success("Text status published successfully");
  };
  
  // Cancel publication
  const cancelPublication = () => {
    setShowTextInput(false);
    setTextStatus('');
    setSelectedImage(null);
  };
  
  // View a status
  const handleViewStatus = (status: Status) => {
    // Mark status as viewed
    const updatedStatuses = statuses.map(s => 
      s.id === status.id ? {...s, isViewed: true} : s
    );
    setStatuses(updatedStatuses);
    setViewingStatus(status);
    
    // Auto-close the status after 5 seconds
    setTimeout(() => {
      setViewingStatus(null);
    }, 5000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Status viewer overlay */}
      {viewingStatus && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-white"
              onClick={() => setViewingStatus(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div className="flex items-center mb-4 px-4">
              <div className="h-10 w-10 rounded-full mr-2 overflow-hidden border-2 border-white">
                <img 
                  src={viewingStatus.avatar} 
                  alt={viewingStatus.user} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-white font-medium">{viewingStatus.user}</p>
                <p className="text-gray-300 text-xs">
                  {viewingStatus.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
            
            {viewingStatus.content && (
              <div className="p-6 text-white text-center text-xl bg-gradient-to-r from-green-500 to-blue-500 min-h-[300px] flex items-center justify-center">
                {viewingStatus.content}
              </div>
            )}
            
            {viewingStatus.image && (
              <div className="min-h-[300px] flex items-center justify-center bg-black">
                <img 
                  src={viewingStatus.image} 
                  alt="Status" 
                  className="max-h-[80vh] max-w-full"
                />
              </div>
            )}
            
            <div className="absolute bottom-0 w-full px-4 pb-4">
              <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden mb-4">
                <div className="bg-white h-full animate-[status-progress_5s_linear]"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Section for creating a status */}
      <div className="p-3 bg-white border-b">
        <div className="flex items-center mb-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <Plus className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">My status</p>
            <p className="text-xs text-gray-500">Tap to add status update</p>
          </div>
        </div>
        
        {/* Image publication interface */}
        {selectedImage && (
          <div className="mt-3 flex flex-col space-y-3">
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={selectedImage} 
                alt="Preview" 
                className="w-full object-contain max-h-64"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button 
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                onClick={publishImageStatus}
              >
                <Send className="h-4 w-4 mr-1" />
                Publish
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={cancelPublication}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {/* Text status form */}
        {showTextInput ? (
          <form onSubmit={handleTextStatusSubmit} className="mt-3">
            <div className="flex flex-col space-y-2">
              <Textarea
                value={textStatus}
                onChange={(e) => setTextStatus(e.target.value)}
                placeholder="Type your status here..."
                className="min-h-[100px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Publish
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={cancelPublication}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
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
                Text
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
              label="Add a photo for your status"
              className="w-full"
              buttonVariant="outline"
              buttonSize="default"
            />
          </div>
        )}
      </div>
      
      {/* Status list */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          <h3 className="text-xs font-medium text-gray-500 mb-2">Recent</h3>
          
          {statuses.length > 0 ? (
            <div className="space-y-3">
              {statuses.map((status) => (
                <div 
                  key={status.id} 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleViewStatus(status)}
                >
                  <div className={`h-12 w-12 rounded-full border-2 ${status.isViewed ? 'border-gray-300' : 'border-green-500'} p-0.5`}>
                    <img 
                      src={status.avatar} 
                      alt={status.user} 
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{status.user}</p>
                    <p className="text-xs text-gray-500">
                      {status.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {status.content && (
                    <div className="bg-gray-100 px-3 py-1 rounded text-sm max-w-[150px] truncate">
                      {status.content}
                    </div>
                  )}
                  {status.image && (
                    <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden">
                      <img src={status.image} alt="Status" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">
                No recent status.<br />Status updates disappear after 24 hours.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StatusTabContent;
