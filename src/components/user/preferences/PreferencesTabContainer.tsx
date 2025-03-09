
import React from 'react';
import { AppearanceCard } from './AppearanceCard';
import { NotificationsCard } from './NotificationsCard';
import { LanguageRegionCard } from './LanguageRegionCard';
import { usePreferences } from './hooks/usePreferences';

export const PreferencesTabContainer: React.FC = () => {
  const { updatePreference, savePreferences } = usePreferences();

  return (
    <div className="space-y-6">
      <AppearanceCard onPreferenceChange={updatePreference} />
      <NotificationsCard onPreferenceChange={updatePreference} />
      <LanguageRegionCard onSavePreferences={savePreferences} />
    </div>
  );
};
