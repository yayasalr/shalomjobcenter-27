
import React from 'react';
import { SiteSettings } from '@/types/siteSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormItem, FormDescription } from "@/components/ui/form";

interface NotificationSettingsTabProps {
  settings: SiteSettings;
  handleChange: (field: keyof SiteSettings, value: any) => void;
  handleNestedChange: (parent: keyof SiteSettings, field: string, value: any) => void;
}

export const NotificationSettingsTab: React.FC<NotificationSettingsTabProps> = ({
  settings,
  handleChange,
  handleNestedChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de notifications</CardTitle>
        <CardDescription>Configurez comment les notifications sont envoyées aux utilisateurs et administrateurs.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <h3 className="text-lg font-medium">Notifications par email</h3>
          
          <FormItem className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Activer les notifications par email</Label>
              <FormDescription>
                Envoyer des notifications par email pour les événements importants
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={settings.notificationSettings?.emailNotifications || false}
                onCheckedChange={(checked) => 
                  handleNestedChange('notificationSettings', 'emailNotifications', checked)
                }
              />
            </FormControl>
          </FormItem>
        </div>
        
        <div className="grid gap-4">
          <h3 className="text-lg font-medium">Formulaires de contact</h3>
          
          <FormItem className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Alerte de nouveau formulaire</Label>
              <FormDescription>
                Recevoir une notification par email quand un nouveau formulaire de contact est soumis
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={settings.notificationSettings?.newContactFormAlert || false}
                onCheckedChange={(checked) => 
                  handleNestedChange('notificationSettings', 'newContactFormAlert', checked)
                }
              />
            </FormControl>
          </FormItem>
          
          <div className="space-y-2">
            <Label htmlFor="contactFormEmailTemplate">Modèle d'email pour formulaire de contact</Label>
            <Textarea
              id="contactFormEmailTemplate"
              placeholder="Modèle d'email pour les formulaires de contact..."
              className="min-h-[150px]"
              value={settings.notificationSettings?.contactFormEmailTemplate || ''}
              onChange={(e) => 
                handleNestedChange('notificationSettings', 'contactFormEmailTemplate', e.target.value)
              }
            />
            <p className="text-sm text-gray-500">
              Vous pouvez utiliser les variables suivantes: {'{name}'}, {'{email}'}, {'{subject}'}, {'{message}'}, {'{department}'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">Serveur SMTP</Label>
              <Input
                id="smtpHost"
                placeholder="smtp.example.com"
                value={settings.smtpHost || ''}
                onChange={(e) => handleChange('smtpHost', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">Port SMTP</Label>
              <Input
                id="smtpPort"
                placeholder="587"
                value={settings.smtpPort || ''}
                onChange={(e) => handleChange('smtpPort', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpUser">Utilisateur SMTP</Label>
              <Input
                id="smtpUser"
                placeholder="user@example.com"
                value={settings.smtpUser || ''}
                onChange={(e) => handleChange('smtpUser', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">Mot de passe SMTP</Label>
              <Input
                id="smtpPassword"
                type="password"
                placeholder="••••••••"
                value={settings.smtpPassword || ''}
                onChange={(e) => handleChange('smtpPassword', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senderName">Nom de l'expéditeur</Label>
              <Input
                id="senderName"
                placeholder="Shalom Job Center"
                value={settings.senderName || ''}
                onChange={(e) => handleChange('senderName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderEmail">Email de l'expéditeur</Label>
              <Input
                id="senderEmail"
                placeholder="contact@shalomjobcenter.tg"
                value={settings.senderEmail || ''}
                onChange={(e) => handleChange('senderEmail', e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
