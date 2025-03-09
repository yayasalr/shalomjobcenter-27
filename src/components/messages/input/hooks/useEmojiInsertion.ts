
import { useRef } from 'react';

interface UseEmojiInsertionProps {
  value: string;
  onChange: (value: string) => void;
  inputRef: React.RefObject<HTMLDivElement>;
}

export const useEmojiInsertion = ({
  value,
  onChange,
  inputRef
}: UseEmojiInsertionProps) => {
  
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
        
        // Focus back on input
        inputRef.current.focus();
        
        return true;
      }
    }
    
    // No valid selection inside the input, add to the end
    appendEmoji(emoji);
    return true;
  };
  
  // Append emoji to the end of the message
  const appendEmoji = (emoji: string) => {
    const newValue = value + emoji;
    onChange(newValue);
    
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

  return { insertEmoji };
};
