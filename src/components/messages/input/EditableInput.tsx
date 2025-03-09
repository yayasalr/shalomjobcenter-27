
import React, { useRef, useEffect } from 'react';

interface EditableInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  placeholder?: string;
}

const EditableInput: React.FC<EditableInputProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder = "Écrivez un message..."
}) => {
  const inputRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.textContent || '');
  };

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

  return (
    <div
      ref={inputRef}
      className="message-input"
      contentEditable
      onInput={handleInput}
      onKeyDown={onKeyDown}
      data-placeholder={placeholder}
      suppressContentEditableWarning={true}
      role="textbox"
      aria-multiline="true"
      aria-label={placeholder}
    ></div>
  );
};

export default EditableInput;
