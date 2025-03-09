
import React, { useRef, useState } from 'react';
import { EmojiSelector, ImagePreview, EditableInput, SendButton, ImageInput } from './input';
import { useEmojiInsertion } from './input/hooks/useEmojiInsertion';
import { useInputFocus } from './input/hooks/useInputFocus';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  selectedImage?: string | null;
  onImageSelect?: (file: File) => void;
  onClearImage?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = "Écrivez un message...",
  selectedImage = null,
  onImageSelect = () => {},
  onClearImage = () => {}
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  
  // Custom hooks
  const { insertEmoji } = useEmojiInsertion({ value, onChange, inputRef });
  const { focusInput } = useInputFocus({ value, inputRef });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (value.trim() || selectedImage) {
      onSend();
      // Reset input manually after sending
      if (inputRef.current) {
        inputRef.current.innerHTML = '';
        inputRef.current.focus();
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    insertEmoji(emoji);
    setEmojiPickerOpen(false);
    focusInput();
  };

  return (
    <MessageInputContainer 
      selectedImage={selectedImage}
      onClearImage={onClearImage}
      emojiPickerOpen={emojiPickerOpen}
      setEmojiPickerOpen={setEmojiPickerOpen}
      onEmojiSelect={handleEmojiSelect}
      onImageSelect={onImageSelect}
      inputRef={inputRef}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      onSendClick={handleSend}
      canSend={!!value.trim() || !!selectedImage}
    />
  );
};

// Separate component for the UI portion
interface MessageInputContainerProps {
  selectedImage: string | null;
  onClearImage: () => void;
  emojiPickerOpen: boolean;
  setEmojiPickerOpen: (open: boolean) => void;
  onEmojiSelect: (emoji: string) => void;
  onImageSelect: (file: File) => void;
  inputRef: React.RefObject<HTMLDivElement>;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  placeholder: string;
  onSendClick: () => void;
  canSend: boolean;
}

const MessageInputContainer: React.FC<MessageInputContainerProps> = ({
  selectedImage,
  onClearImage,
  emojiPickerOpen,
  setEmojiPickerOpen,
  onEmojiSelect,
  onImageSelect,
  inputRef,
  value,
  onChange,
  onKeyDown,
  placeholder,
  onSendClick,
  canSend
}) => {
  return (
    <div className="message-input-area flex flex-col">
      {/* Image preview */}
      {selectedImage && (
        <ImagePreview 
          selectedImage={selectedImage} 
          onClearImage={onClearImage} 
        />
      )}

      <div className="flex items-center">
        {/* Emoji selector */}
        <EmojiSelector 
          onEmojiSelect={onEmojiSelect}
          open={emojiPickerOpen}
          setOpen={setEmojiPickerOpen}
        />
        
        {/* Image upload */}
        <ImageInput 
          onImageSelect={onImageSelect}
          selectedImage={selectedImage}
          onClearImage={onClearImage}
        />
        
        {/* Input field */}
        <div ref={inputRef}>
          <EditableInput
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
          />
        </div>
        
        {/* Send button */}
        <SendButton
          onClick={onSendClick}
          disabled={!canSend}
        />
      </div>
    </div>
  );
};

export default MessageInput;
