
import React from 'react';

export const BannerBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Abstract patterns */}
      <svg className="absolute h-full w-full opacity-5" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,30 L30,30 L30,10" stroke="#888" strokeWidth="0.5" fill="none" />
        <path d="M70,10 L70,30 L90,30" stroke="#888" strokeWidth="0.5" fill="none" />
        <path d="M90,70 L70,70 L70,90" stroke="#888" strokeWidth="0.5" fill="none" />
        <path d="M30,90 L30,70 L10,70" stroke="#888" strokeWidth="0.5" fill="none" />
        <circle cx="50" cy="50" r="30" stroke="#888" strokeWidth="0.3" fill="none" />
        <circle cx="50" cy="50" r="20" stroke="#888" strokeWidth="0.2" fill="none" strokeDasharray="1,1" />
      </svg>
      
      {/* Dot patterns */}
      <div className="absolute top-0 left-0 w-full h-full">
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-gray-300"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};
