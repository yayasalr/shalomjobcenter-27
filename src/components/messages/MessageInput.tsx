
import React, { useState, useRef } from 'react';
import { useRecording } from './input/hooks/useRecording';
import { useMediaHandling } from './input/hooks/useMediaHandling';
import EmojiPicker from './input/EmojiPicker';
import StickerPicker from './input/StickerPicker';
import MediaAttachmentButtons from './input/MediaAttachmentButtons';
import MediaPreview from './input/MediaPreview';
import VoiceRecorder from './input/VoiceRecorder';
import SendButton from './input/SendButton';
import { toast } from 'sonner';

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
  const inputRef = useRef<HTMLDivElement>(null);

  // Use custom hooks for recording and media handling
  const {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    formatRecordingTime
  } = useRecording();

  const {
    mediaPreview,
    mediaType,
    fileInputRef,
    handleFileSelect,
    handleFileChange,
    handleAudioPreview,
    cancelMediaPreview
  } = useMediaHandling();

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
        cancelMediaPreview();
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

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(newMessage + emoji);
    setShowEmojiPicker(false);
  };

  const handleStickerClick = (stickerUrl: string) => {
    // This would normally send a sticker message
    toast.success("Fonctionnalité d'envoi de stickers à venir");
    setShowStickerPicker(false);
  };

  const handleSendButtonClick = () => {
    if (newMessage.trim() || mediaPreview) {
      sendMessage();
    } else {
      startRecording();
    }
  };

  const handleStopRecording = () => {
    const duration = stopRecording();
    const isValidRecording = handleAudioPreview(duration);
    
    if (isValidRecording) {
      // Focus the input field for adding a caption
      inputRef.current?.focus();
    }
  };

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
        <MediaPreview 
          mediaPreview={mediaPreview}
          mediaType={mediaType}
          cancelMediaPreview={cancelMediaPreview}
        />
      ) : (
        <>
          <EmojiPicker 
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            onEmojiClick={handleEmojiClick}
          />
          
          <StickerPicker 
            showStickerPicker={showStickerPicker}
            setShowStickerPicker={setShowStickerPicker}
            onStickerClick={handleStickerClick}
          />
          
          <MediaAttachmentButtons handleFileSelect={handleFileSelect} />
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
      
      <VoiceRecorder 
        isRecording={isRecording}
        recordingTime={recordingTime}
        stopRecording={handleStopRecording}
        formatRecordingTime={formatRecordingTime}
      />
      
      {!isRecording && (
        <SendButton 
          hasContent={Boolean(newMessage.trim() || mediaPreview)}
          isSending={isSending}
          onClick={handleSendButtonClick}
        />
      )}
    </div>
  );
};

export default MessageInput;
