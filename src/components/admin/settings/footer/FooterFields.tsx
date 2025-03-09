
import React from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { FooterTextAreaField } from './FooterTextAreaField';
import { FooterSectionHeader } from './FooterSectionHeader';

interface FooterFieldsProps {
  settings: SiteSettings['footer'];
  onFieldChange: (field: keyof SiteSettings['footer'], value: string) => void;
}

export const FooterFields: React.FC<FooterFieldsProps> = ({
  settings,
  onFieldChange,
}) => {
  return (
    <div className="space-y-8">
      <section>
        <FooterSectionHeader 
          title="Informations de contact" 
          description="Informations de contact affichées dans le pied de page du site"
        />
        <FooterTextAreaField
          id="contact"
          label="Contact"
          value={settings.contact}
          onChange={(value) => onFieldChange('contact', value)}
        />
      </section>
      
      <section>
        <FooterSectionHeader 
          title="À propos" 
          description="Brève description de votre entreprise pour le pied de page"
        />
        <FooterTextAreaField
          id="about"
          label="À propos"
          value={settings.about}
          onChange={(value) => onFieldChange('about', value)}
        />
      </section>
      
      <section>
        <FooterSectionHeader 
          title="Documents légaux" 
          description="Textes légaux pour votre site web"
        />
        <div className="grid gap-6 md:grid-cols-2">
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
      </section>
    </div>
  );
};
