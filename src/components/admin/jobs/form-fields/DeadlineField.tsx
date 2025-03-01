
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeadlineFieldProps {
  deadline: string;
  setDeadline: (value: string) => void;
}

export const DeadlineField: React.FC<DeadlineFieldProps> = ({
  deadline,
  setDeadline
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div>
      <Label htmlFor="deadline" className="block text-sm font-medium mb-1">
        Date limite <span className="text-red-500">*</span>
      </Label>
      <Input
        id="deadline"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        min={today}
        required
      />
    </div>
  );
};
