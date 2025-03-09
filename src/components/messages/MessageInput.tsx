
import React, { useRef, useState, useEffect } from 'react';
import ImageInput from './ImageInput';
import { EmojiSelector, ImagePreview, EditableInput, SendButton } from './input';

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() || selectedImage) {
        onSend();
      }
    }
  };

  // Reset input field after sending
  useEffect(() => {
    if (!value && inputRef.current) {
      // Focus after sending the message
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [value]);

  // Insert emoji at cursor position or at the end
  const insertEmoji = (emoji: string) => {
    if (!inputRef.current) return;
    
    // Get selection
    const selection = window.getSelection();
    
    if (selection && selection.rangeCount > 0) {
      // If there's a selection, replace it with the emoji
      const range = selection.getRangeAt(0);
      
      if (range.commonAncestorContainer.parentNode === inputRef.current ||
          range.commonAncestorContainer === inputRef.current) {
        // Selection is inside our input
        range.deleteContents();
        range.insertNode(document.createTextNode(emoji));
        
        // Move cursor after emoji
        range.setStartAfter(range.endContainer);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Update value
        onChange(inputRef.current.textContent || '');
        
        // Close popover
        setEmojiPickerOpen(false);
        
        // Focus back on input
        inputRef.current.focus();
      } else {
        // Selection is outside our input, so add to the end
        appendEmoji(emoji);
      }
    } else {
      // No selection, add to the end
      appendEmoji(emoji);
    }
  };
  
  // Append emoji to the end of the message
  const appendEmoji = (emoji: string) => {
    const newValue = value + emoji;
    onChange(newValue);
    setEmojiPickerOpen(false);
    
    // Focus back on input and set cursor at end
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        
        // Move cursor to end
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(inputRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 10);
  };

  const handleSendClick = () => {
    if (value.trim() || selectedImage) {
      onSend();
      // Reset input manually after sending
      if (inputRef.current) {
        inputRef.current.innerHTML = '';
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="message-input-area flex flex-col">
      {/* Image preview component */}
      {selectedImage && (
        <ImagePreview 
          selectedImage={selectedImage} 
          onClearImage={onClearImage} 
        />
      )}

      <div className="flex items-center">
        {/* Emoji selector component */}
        <EmojiSelector 
          onEmojiSelect={insertEmoji}
          open={emojiPickerOpen}
          setOpen={setEmojiPickerOpen}
        />
        
        {/* Image attachment button */}
        <ImageInput 
          onImageSelect={onImageSelect}
          selectedImage={selectedImage}
          onClearImage={onClearImage}
        />
        
        {/* Editable input field */}
        <div ref={inputRef}>
          <EditableInput
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
        </div>
        
        {/* Send button */}
        <SendButton
          onClick={handleSendClick}
          disabled={!value.trim() && !selectedImage}
        />
      </div>
    </div>
  );
};

export default MessageInput;
