
import React from 'react';

interface ToastProps {
  children: React.ReactNode;
}

export const Toast: React.FC<ToastProps> = ({ children }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50 animate-in fade-in slide-in-from-bottom-5">
      {children}
    </div>
  );
};
