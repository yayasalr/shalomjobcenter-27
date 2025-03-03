
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { ContactFormSubmission } from '@/types/contact';
import { SubmissionsList } from './SubmissionsList';
import { SubmissionDetail } from './SubmissionDetail';
import { ForwardingTab } from './ForwardingTab';
import { useSubmissions } from './useSubmissions';

const ContactSubmissionsTab: React.FC = () => {
  const { settings } = useSiteSettings();
  const {
    submissions,
    selectedSubmission,
    searchQuery,
    filter,
    newSubmissionsCount,
    filteredSubmissions,
    responseText,
    forwardEmail,
    isForwarding,
    setSearchQuery,
    setFilter,
    setResponseText,
    setForwardEmail,
    handleSelectSubmission,
    handleSendResponse,
    handleForwardSubmission,
    handleBulkForward
  } = useSubmissions();

  const [showDetail, setShowDetail] = useState(false);

  // On mobile, when a submission is selected, show the detail view
  useEffect(() => {
    if (selectedSubmission) {
      setShowDetail(true);
    }
  }, [selectedSubmission]);

  // Handler for back button on mobile
  const handleBackToList = () => {
    setShowDetail(false);
  };

  return (
    <Card>
      <CardContent className="p-6 h-[calc(100vh-280px)]">
        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="submissions">Formulaires reçus</TabsTrigger>
            <TabsTrigger value="forward">Transfert par email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submissions">
            <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-4">
              <div className={`${showDetail ? 'hidden md:block' : 'block'}`}>
                <SubmissionsList 
                  filteredSubmissions={filteredSubmissions}
                  selectedSubmission={selectedSubmission}
                  searchQuery={searchQuery}
                  filter={filter}
                  newSubmissionsCount={newSubmissionsCount}
                  setSearchQuery={setSearchQuery}
                  setFilter={setFilter}
                  handleSelectSubmission={handleSelectSubmission}
                />
              </div>
              
              <div className={`col-span-2 ${!showDetail ? 'hidden md:block' : 'block'}`}>
                <SubmissionDetail
                  selectedSubmission={selectedSubmission}
                  responseText={responseText}
                  forwardEmail={forwardEmail}
                  isForwarding={isForwarding}
                  setResponseText={setResponseText}
                  setForwardEmail={setForwardEmail}
                  handleSendResponse={handleSendResponse}
                  handleForwardSubmission={handleForwardSubmission}
                  onBack={handleBackToList}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="forward">
            <ForwardingTab 
              settings={settings}
              filteredSubmissions={filteredSubmissions}
              filter={filter}
              forwardEmail={forwardEmail}
              isForwarding={isForwarding}
              setForwardEmail={setForwardEmail}
              handleBulkForward={handleBulkForward}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContactSubmissionsTab;
