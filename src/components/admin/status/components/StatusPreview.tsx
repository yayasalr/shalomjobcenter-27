
import React from 'react';

interface StatusPreviewProps {
  text: string;
  icon: React.ReactNode;
  backgroundColor: string;
  textColor: string;
  imageUrl?: string;
}

export const StatusPreview: React.FC<StatusPreviewProps> = ({
  text,
  icon,
  backgroundColor,
  textColor,
  imageUrl
}) => {
  return (
    <div 
      className="p-4 rounded-md flex items-center gap-3 overflow-hidden"
      style={{ backgroundColor, color: textColor }}
    >
      {icon}
      <div className="flex-1">{text}</div>
      {imageUrl && (
        <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
          <img src={imageUrl} alt="Status preview" className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
};
