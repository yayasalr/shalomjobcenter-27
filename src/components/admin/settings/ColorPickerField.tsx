
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
      <div className="flex items-center mt-1">
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-10 h-10 p-1 border rounded cursor-pointer"
        />
        <span className="ml-2 text-sm text-gray-500">{color}</span>
      </div>
    </div>
  );
};
