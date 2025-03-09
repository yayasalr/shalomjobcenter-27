
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/language';

interface HousingSwitchProps {
  showHousingOnly: boolean;
  onHousingChange: (showHousingOnly: boolean) => void;
}

export const HousingSwitch: React.FC<HousingSwitchProps> = ({
  showHousingOnly,
  onHousingChange
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="housing-only" 
        checked={showHousingOnly}
        onCheckedChange={onHousingChange}
      />
      <Label htmlFor="housing-only">{t('filter_by_housing')}</Label>
    </div>
  );
};
