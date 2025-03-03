
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Mic, Smile, Image, Sticker } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = () => {
    if (!newMessage.trim() && !isSending) return;
    
    setIsSending(true);
    
    // Add a small delay to simulate network latency
    setTimeout(() => {
      try {
        handleSendMessage();
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
    fileInputRef.current?.click();
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
      // This would normally upload the image and then send a message with the image URL
      toast.success("Fonctionnalité de partage d'images à venir");
    };
    reader.readAsDataURL(file);

    // Reset the input
    e.target.value = '';
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleStickerClick = (stickerUrl: string) => {
    // This would normally send a sticker message
    toast.success("Fonctionnalité d'envoi de stickers à venir");
    setShowStickerPicker(false);
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
      
      <Dialog open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500 hover:bg-gray-200 rounded-full"
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
            className="text-gray-500 hover:bg-gray-200 rounded-full"
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
        className="text-gray-500 hover:bg-gray-200 rounded-full"
        onClick={handleFileSelect}
      >
        <Paperclip className="h-5 w-5" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-gray-500 hover:bg-gray-200 rounded-full"
        onClick={handleFileSelect}
      >
        <Image className="h-5 w-5" />
      </Button>
      
      <div 
        contentEditable 
        className="whatsapp-input" 
        onInput={(e) => setNewMessage(e.currentTarget.textContent || '')}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
      >
        {newMessage}
      </div>
      
      <Button 
        onClick={sendMessage} 
        disabled={!newMessage.trim() || isSending}
        className="whatsapp-send-button"
        size="icon"
      >
        {newMessage.trim() ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default MessageInput;
