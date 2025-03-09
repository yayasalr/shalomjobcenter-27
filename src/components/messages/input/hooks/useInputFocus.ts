
import { useEffect } from 'react';

interface UseInputFocusProps {
  value: string;
  inputRef: React.RefObject<HTMLDivElement>;
}

export const useInputFocus = ({ value, inputRef }: UseInputFocusProps) => {
  // Reset input field after sending and handle focus
  useEffect(() => {
    if (!value && inputRef.current) {
      // Focus after sending the message
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [value, inputRef]);
  
  // Focus input and place cursor at the end
  const focusInput = () => {
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
  
  return { focusInput };
};
