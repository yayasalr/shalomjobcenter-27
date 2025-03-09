
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';

interface FooterTextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const FooterTextAreaField: React.FC<FooterTextAreaFieldProps> = ({
  id,
  label,
  value,
  onChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
      <Label htmlFor={id} className="text-blue-700 font-medium">{label}</Label>
      <Separator className="my-2 bg-blue-100" />
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-blue-200 focus:border-blue-500 mt-1 min-h-[120px]"
        placeholder={`Entrez votre texte ${label.toLowerCase()} ici...`}
      />
    </div>
  );
};
