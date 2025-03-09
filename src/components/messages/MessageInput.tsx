
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Smile, Paperclip, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ImageInput from './ImageInput';

// Common emojis for the simple picker
const COMMON_EMOJIS = ['😊', '😂', '👍', '❤️', '🙏', '😍', '🎉', '👋', '🔥', '✨', '🤔', '👏', '😢', '🙄', '😎', '👀'];

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
  const [open, setOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() || selectedImage) {
        onSend();
      }
    }
  };

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
        setOpen(false);
        
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
    setOpen(false);
    
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

  // Fix cursor position and focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      // Focus the input
      inputRef.current.focus();
      
      // Clear existing content
      inputRef.current.innerHTML = '';
      
      // Create and append text node if there's content
      if (value) {
        const textNode = document.createTextNode(value);
        inputRef.current.appendChild(textNode);
      }
      
      // Place cursor at the end
      const range = document.createRange();
      const sel = window.getSelection();
      
      if (sel) {
        sel.removeAllRanges();
        range.selectNodeContents(inputRef.current);
        range.collapse(false); // collapse to end
        sel.addRange(range);
      }
    }
  }, []);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.textContent || '');
  };

  return (
    <div className="message-input-area flex flex-col">
      {/* Show selected image preview above input */}
      {selectedImage && (
        <div className="px-3 py-2">
          <div className="relative inline-block">
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="h-20 w-auto rounded-md object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={onClearImage}
            >
              <span className="sr-only">Remove image</span>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100"
              aria-label="Ajouter un emoji"
            >
              <Smile className="h-5 w-5 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-64 p-2" align="start">
            <div className="grid grid-cols-4 gap-2">
              {COMMON_EMOJIS.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-gray-100"
                  onClick={() => insertEmoji(emoji)}
                >
                  <span className="text-xl">{emoji}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Image attachment button */}
        <ImageInput 
          onImageSelect={onImageSelect}
          selectedImage={selectedImage}
          onClearImage={onClearImage}
        />
        
        <div
          ref={inputRef}
          className="message-input"
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
          role="textbox"
          aria-multiline="true"
          aria-label={placeholder}
        ></div>
        
        <Button 
          onClick={() => {
            if (value.trim() || selectedImage) {
              onSend();
              // Reset input manually after sending
              if (inputRef.current) {
                inputRef.current.innerHTML = '';
                inputRef.current.focus();
              }
            }
          }}
          disabled={!value.trim() && !selectedImage}
          className="rounded-full bg-blue-500 hover:bg-blue-600"
          size="icon"
          aria-label="Envoyer le message"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
