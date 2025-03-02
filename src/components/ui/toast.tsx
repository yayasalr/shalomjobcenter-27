
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

export const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const ToastViewport = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const ToastTitle = ({ children }: { children: React.ReactNode }) => <div className="font-medium">{children}</div>;
export const ToastDescription = ({ children }: { children: React.ReactNode }) => <div className="text-sm text-gray-500">{children}</div>;
export const ToastClose = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
    aria-label="Close"
  >
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
    </svg>
  </button>
);

export type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export type ToastActionElement = React.ReactElement;
