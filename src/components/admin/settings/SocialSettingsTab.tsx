
import React from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialSettingsTabProps {
  settings: SiteSettings;
  handleSocialLinkChange: (field: keyof SiteSettings['socialLinks'], value: string) => void;
}

export const SocialSettingsTab: React.FC<SocialSettingsTabProps> = ({
  settings,
  handleSocialLinkChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liens vers les réseaux sociaux</CardTitle>
        <CardDescription>Ajoutez ou modifiez vos liens vers les réseaux sociaux.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            type="url"
            id="facebook"
            defaultValue={settings.socialLinks.facebook}
            onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="twitter">Twitter</Label>
          <Input
            type="url"
            id="twitter"
            defaultValue={settings.socialLinks.twitter}
            onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            type="url"
            id="instagram"
            defaultValue={settings.socialLinks.instagram}
            onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            type="url"
            id="linkedin"
            defaultValue={settings.socialLinks.linkedin}
            onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
