
import React, { useState, useEffect } from 'react';
import { Conversation } from './types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import WhatsAppHeader from './WhatsAppHeader';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Phone, Video, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConversationViewProps {
  conversation: Conversation;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isOnline?: boolean;
  onBack?: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isOnline = Math.random() > 0.5, // Random online status simulation
  onBack
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('messages');
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callIntervalId, setCallIntervalId] = useState<number | null>(null);

  const handleViewProfile = () => {
    setShowProfile(true);
  };

  const handleProfileImageUpload = (file: File) => {
    setIsUploading(true);
    
    // This would normally upload the image to a server
    setTimeout(() => {
      toast.success("Profile picture updated");
      setIsUploading(false);
    }, 1500);
  };

  const handleStatus = () => {
    setActiveTab('status');
  };

  const initiateCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setIsInCall(true);
    setCallDuration(0);
    
    // Start call timer
    const intervalId = window.setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    setCallIntervalId(intervalId);
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} call started with ${conversation.with.name}`);
  };
  
  const endCall = () => {
    if (callIntervalId) {
      window.clearInterval(callIntervalId);
    }
    
    toast.info(`Call ended. Duration: ${formatCallDuration(callDuration)}`);
    setIsInCall(false);
    setCallIntervalId(null);
  };
  
  const formatCallDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (callIntervalId) {
        window.clearInterval(callIntervalId);
      }
    };
  }, [callIntervalId]);

  // Mock shared media
  const sharedMedia = [
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg'
  ];

  return (
    <div className="col-span-2 flex flex-col h-full whatsapp-container md:rounded-r-lg">
      {/* Call overlay */}
      {isInCall && (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
          <div className="flex items-center justify-between p-4">
            <div className="text-white text-lg font-medium">
              {callType === 'audio' ? 'Audio call' : 'Video call'}
            </div>
            <div className="text-white">
              {formatCallDuration(callDuration)}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {callType === 'video' ? (
              <div className="relative w-full max-w-md">
                <div className="bg-gray-700 rounded-lg overflow-hidden aspect-video">
                  <img 
                    src={conversation.with.avatar || '/placeholder.svg'} 
                    alt={conversation.with.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 right-4 w-32 h-32 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                  <img 
                    src="/placeholder.svg" 
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-white">
                  <img 
                    src={conversation.with.avatar || '/placeholder.svg'} 
                    alt={conversation.with.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-white text-2xl font-medium mb-2">{conversation.with.name}</h2>
                <p className="text-gray-400">Connected</p>
              </div>
            )}
          </div>
          
          <div className="p-6 flex justify-center">
            <Button 
              variant="destructive" 
              className="rounded-full h-16 w-16"
              onClick={endCall}
            >
              <Phone className="h-8 w-8 transform rotate-135" />
            </Button>
          </div>
        </div>
      )}
      
      <WhatsAppHeader 
        conversation={conversation} 
        isOnline={isOnline} 
        onBack={onBack}
        onViewProfile={handleViewProfile}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="whatsapp-tabs">
          <TabsTrigger 
            value="messages" 
            className={`whatsapp-tab ${activeTab === 'messages' ? 'active' : ''}`}
          >
            MESSAGES
          </TabsTrigger>
          <TabsTrigger 
            value="status" 
            className={`whatsapp-tab ${activeTab === 'status' ? 'active' : ''}`}
          >
            STATUS
          </TabsTrigger>
          <TabsTrigger 
            value="calls" 
            className={`whatsapp-tab ${activeTab === 'calls' ? 'active' : ''}`}
          >
            CALLS
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="flex-1 flex flex-col">
          <MessageList conversation={conversation} />
          
          <MessageInput 
            newMessage={newMessage} 
            setNewMessage={setNewMessage} 
            handleSendMessage={handleSendMessage} 
          />
        </TabsContent>
        
        <TabsContent value="status" className="flex-1 p-4 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center mb-4">
              <Avatar className="h-14 w-14 border-2 border-green-500">
                <AvatarImage src={conversation.with.avatar || '/placeholder.svg'} alt={conversation.with.name} />
                <AvatarFallback>{conversation.with.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <h3 className="font-medium">{conversation.with.name}'s Status</h3>
                <p className="text-sm text-gray-500">
                  {isOnline ? 'Updated today' : 'No recent updates'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {isOnline ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src="/placeholder.svg" 
                      alt="Status" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                      {i + 1}h ago
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  No status updates available
                </div>
              )}
            </div>
            
            {isOnline && (
              <div className="mt-4 text-center">
                <button 
                  className="text-green-600 text-sm font-medium"
                  onClick={() => toast.info(`Viewing ${conversation.with.name}'s status`)}
                >
                  View all status updates
                </button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="calls" className="flex-1 p-4 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium text-lg">Call {conversation.with.name}</h3>
              {isOnline && (
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100">
                  Online
                </Badge>
              )}
            </div>
            
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="flex-1 flex flex-col items-center py-6 border-green-100 bg-green-50 hover:bg-green-100 text-green-600"
                onClick={() => initiateCall('audio')}
              >
                <Phone className="h-10 w-10 mb-2" />
                <span>Audio Call</span>
              </Button>
              
              <Button 
                variant="outline"
                className="flex-1 flex flex-col items-center py-6 border-blue-100 bg-blue-50 hover:bg-blue-100 text-blue-600"
                onClick={() => initiateCall('video')}
              >
                <Video className="h-10 w-10 mb-2" />
                <span>Video Call</span>
              </Button>
            </div>
            
            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Recent Calls</h4>
              <div className="space-y-2">
                {isOnline ? (
                  <>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Incoming audio call</span>
                      </div>
                      <span className="text-xs text-gray-500">Yesterday, 15:30</span>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center">
                        <Video className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm">Outgoing video call</span>
                      </div>
                      <span className="text-xs text-gray-500">Mar 8, 10:15</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No recent calls
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4 py-2 pb-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <ImageUploader
                  variant="avatar"
                  currentImage={conversation.with.avatar || '/placeholder.svg'}
                  onImageUpload={handleProfileImageUpload}
                  isUploading={isUploading}
                  previewClassName="h-28 w-28"
                />
              </div>
              
              <h2 className="text-xl font-bold">{conversation.with.name}</h2>
              
              {conversation.with.email && (
                <p className="text-sm text-gray-500">{conversation.with.email}</p>
              )}
              
              <div className="text-sm text-gray-500">
                {isOnline ? 'Online' : 'Offline'}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">About</h3>
              <p className="text-gray-600">Available</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Media, links and docs</h3>
              <div className="grid grid-cols-3 gap-2">
                {sharedMedia.length > 0 ? (
                  sharedMedia.map((media, index) => (
                    <div key={index} className="h-20 bg-gray-100 rounded overflow-hidden">
                      <img src={media} alt="Media" className="h-full w-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    No media
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline"
                className="flex-1 mr-2 border-green-100 bg-green-50 hover:bg-green-100 text-green-600"
                onClick={() => {
                  setShowProfile(false);
                  setTimeout(() => initiateCall('audio'), 500);
                }}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              
              <Button 
                variant="outline"
                className="flex-1 ml-2 border-red-100 bg-red-50 hover:bg-red-100 text-red-600"
                onClick={() => {
                  setShowProfile(false);
                  toast.error("This function is not available in demo mode");
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Block
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConversationView;
