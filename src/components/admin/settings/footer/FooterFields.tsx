
import React from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { FooterTextAreaField } from './FooterTextAreaField';

interface FooterFieldsProps {
  settings: SiteSettings['footer'];
  onFieldChange: (field: keyof SiteSettings['footer'], value: string) => void;
}

export const FooterFields: React.FC<FooterFieldsProps> = ({
  settings,
  onFieldChange,
}) => {
  return (
    <div className="grid gap-6">
      <FooterTextAreaField
        id="contact"
        label="Contact"
        value={settings.contact}
        onChange={(value) => onFieldChange('contact', value)}
      />
      
      <FooterTextAreaField
        id="about"
        label="À propos"
        value={settings.about}
        onChange={(value) => onFieldChange('about', value)}
      />
      
      <FooterTextAreaField
        id="terms"
        label="Conditions d'utilisation"
        value={settings.terms}
        onChange={(value) => onFieldChange('terms', value)}
      />
      
      <FooterTextAreaField
        id="policy"
        label="Politique de confidentialité"
        value={settings.policy}
        onChange={(value) => onFieldChange('policy', value)}
      />
    </div>
  );
};
