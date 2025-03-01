
import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ProfileSidebar } from '@/components/user/ProfileSidebar';
import { PersonalInfoTab } from '@/components/user/PersonalInfoTab';
import { SecurityTab } from '@/components/user/SecurityTab';
import { PreferencesTab } from '@/components/user/PreferencesTab';

const Profile = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8 mt-8">Mon profil</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProfileSidebar user={user} />
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="infos">
              <TabsList className="mb-6">
                <TabsTrigger value="infos">Informations personnelles</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
                <TabsTrigger value="preferences">Préférences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="infos">
                <PersonalInfoTab user={user} />
              </TabsContent>
              
              <TabsContent value="security">
                <SecurityTab />
              </TabsContent>
              
              <TabsContent value="preferences">
                <PreferencesTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
