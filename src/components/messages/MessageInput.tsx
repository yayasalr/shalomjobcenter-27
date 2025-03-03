
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Mic, Smile, Image, Sticker, X, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  newMessage, 
  setNewMessage, 
  handleSendMessage 
}) => {
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'audio' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clean up the recording timer if it exists
    return () => {
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  const sendMessage = () => {
    if ((!newMessage.trim() && !mediaPreview) || isSending) return;
    
    setIsSending(true);
    
    let messageContent = newMessage.trim();
    
    // Add a prefix for image or audio messages to identify them later
    if (mediaPreview && mediaType === 'image') {
      messageContent = `image-message: ${mediaPreview}`;
    } else if (mediaPreview && mediaType === 'audio') {
      messageContent = `audio-message: Audio recording (${recordingTime}s)`;
    }
    
    // Set the message content
    setNewMessage(messageContent);
    
    // Add a small delay to ensure the message content is set
    setTimeout(() => {
      try {
        handleSendMessage();
        // Clear media preview after sending
        setMediaPreview(null);
        setMediaType(null);
        setNewMessage('');
      } finally {
        setIsSending(false);
      }
    }, 200); // Very short delay for near-instant feel
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileSelect = () => {
    // Ensure this is triggered by a user event (click/tap)
    if (fileInputRef.current) {
      // Add a small delay to ensure the click is registered properly on mobile
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 50);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation
    if (!file.type.startsWith('image/')) {
      toast.error("Seules les images sont supportées pour l'instant");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse (max 5MB)");
      return;
    }

    // Create a preview and simulate sending an image
    const reader = new FileReader();
    reader.onload = () => {
      const imagePreview = reader.result as string;
      setMediaPreview(imagePreview);
      setMediaType('image');
      // Focus the input field for adding a caption
      inputRef.current?.focus();
    };
    reader.readAsDataURL(file);

    // Reset the input
    e.target.value = '';
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(newMessage + emoji);
    setShowEmojiPicker(false);
  };

  const handleStickerClick = (stickerUrl: string) => {
    // This would normally send a sticker message
    toast.success("Fonctionnalité d'envoi de stickers à venir");
    setShowStickerPicker(false);
  };

  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start a timer to track recording duration
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // This would normally start actual audio recording
      toast.success("Enregistrement vocal démarré");
      
      // Simulate requesting microphone access
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          // Here you would normally start recording
          console.log('Microphone access granted, recording started');
        })
        .catch(err => {
          toast.error("Impossible d'accéder au microphone");
          stopRecording();
        });
    } else {
      toast.error("Votre navigateur ne supporte pas l'enregistrement audio");
    }
  };

  const stopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    setIsRecording(false);
    
    // This would normally process the recorded audio
    if (recordingTime > 1) {
      setMediaPreview('/placeholder.svg');
      setMediaType('audio');
      toast.success("Enregistrement vocal terminé");
    } else {
      toast.error("Enregistrement trop court");
    }
  };

  const cancelMediaPreview = () => {
    setMediaPreview(null);
    setMediaType(null);
  };

  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Mock emojis for the demo
  const emojis = ['😊', '😂', '❤️', '👍', '🙏', '😍', '🔥', '😢', '🎉', '🤔'];
  
  // Mock stickers for the demo
  const stickers = [
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
  ];

  return (
    <div className="whatsapp-input-area">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
      
      {mediaPreview ? (
        <div className="media-preview-container">
          <div className="media-preview">
            {mediaType === 'image' && (
              <img src={mediaPreview} alt="Preview" className="h-20 object-contain" />
            )}
            {mediaType === 'audio' && (
              <div className="flex items-center justify-center bg-gray-100 h-20 w-20 rounded">
                <div className="text-gray-600">Audio</div>
              </div>
            )}
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-1 right-1 h-6 w-6 rounded-full"
              onClick={cancelMediaPreview}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Dialog open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-500 hover:bg-gray-200 rounded-full touch-manipulation"
                onClick={() => setShowEmojiPicker(true)}
              >
                <Smile className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="p-2 w-64">
              <div className="grid grid-cols-5 gap-2">
                {emojis.map((emoji, index) => (
                  <Button 
                    key={index} 
                    variant="ghost" 
                    className="h-10 w-10 text-xl"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showStickerPicker} onOpenChange={setShowStickerPicker}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-500 hover:bg-gray-200 rounded-full touch-manipulation"
                onClick={() => setShowStickerPicker(true)}
              >
                <Sticker className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="p-2 w-64">
              <div className="grid grid-cols-2 gap-2">
                {stickers.map((sticker, index) => (
                  <div 
                    key={index} 
                    className="h-24 w-full border rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => handleStickerClick(sticker)}
                  >
                    <img src={sticker} alt="Sticker" className="h-full w-full object-contain" />
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500 hover:bg-gray-200 rounded-full touch-manipulation"
            onClick={handleFileSelect}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500 hover:bg-gray-200 rounded-full touch-manipulation"
            onClick={handleFileSelect}
          >
            <Image className="h-5 w-5" />
          </Button>
        </>
      )}
      
      <div 
        ref={inputRef}
        contentEditable 
        className="whatsapp-input" 
        onInput={(e) => setNewMessage(e.currentTarget.textContent || '')}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
      >
        {newMessage}
      </div>
      
      {isRecording ? (
        <div className="recording-indicator flex items-center mr-2">
          <div className="recording-pulse mr-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-500 text-sm font-medium">{formatRecordingTime(recordingTime)}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 ml-2 touch-manipulation"
            onClick={stopRecording}
          >
            <StopCircle className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <Button 
          onClick={newMessage.trim() || mediaPreview ? sendMessage : startRecording} 
          disabled={isSending}
          className="whatsapp-send-button touch-manipulation"
          size="icon"
        >
          {newMessage.trim() || mediaPreview ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
      )}
    </div>
  );
};

export default MessageInput;
