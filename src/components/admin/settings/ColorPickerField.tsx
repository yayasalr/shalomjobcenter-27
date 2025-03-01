
import React from 'react';
import { Label } from "@/components/ui/label";

interface ColorPickerFieldProps {
  label: string;
  color: string;
  onColorChange: (color: string) => void;
}

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({ 
  label, 
  color, 
  onColorChange 
}) => {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center mt-1 gap-3">
        <div className="relative w-10 h-10 rounded-md overflow-hidden shadow-sm border border-gray-200">
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div 
            className="w-full h-full" 
            style={{ backgroundColor: color }}
          ></div>
        </div>
        <span className="text-sm text-gray-600 font-mono">{color}</span>
      </div>
    </div>
  );
};
