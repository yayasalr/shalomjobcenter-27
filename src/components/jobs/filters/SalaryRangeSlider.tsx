
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface SalaryRangeSliderProps {
  salaryRange: [number, number];
  setSalaryRange: (range: [number, number]) => void;
}

export const SalaryRangeSlider: React.FC<SalaryRangeSliderProps> = ({
  salaryRange,
  setSalaryRange
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Salaire (FCFA): {salaryRange[0].toLocaleString('fr-FR')} - {salaryRange[1].toLocaleString('fr-FR')}
      </label>
      <Slider
        defaultValue={[300000, 1500000]}
        max={2000000}
        min={100000}
        step={50000}
        value={salaryRange}
        onValueChange={(value) => setSalaryRange(value as [number, number])}
        className="my-4"
      />
    </div>
  );
};
