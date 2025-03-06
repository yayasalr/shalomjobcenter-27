
import React from 'react';
import { 
  SocialAccountsCard,
  BenefitsCard,
  ConnectAccountDialog,
  DisconnectAccountDialog,
  useSocialAccounts
} from './social';

export const ConnectedAccountsTab: React.FC = () => {
  const {
    socialAccounts,
    currentAccount,
    showConnectDialog,
    setShowConnectDialog,
    showConfirmDisconnect,
    setShowConfirmDisconnect,
    handleConnect,
    submitConnect,
    initiateDisconnect,
    handleDisconnect,
  } = useSocialAccounts();

  return (
    <div className="space-y-6">
      <SocialAccountsCard 
        accounts={socialAccounts}
        onConnect={handleConnect}
        onDisconnect={initiateDisconnect}
      />
      
      <BenefitsCard />

      {/* Dialog to connect account */}
      <ConnectAccountDialog
        open={showConnectDialog}
        onOpenChange={setShowConnectDialog}
        account={currentAccount}
        onConnect={submitConnect}
      />

      {/* Dialog to confirm disconnection */}
      <DisconnectAccountDialog
        open={showConfirmDisconnect}
        onOpenChange={setShowConfirmDisconnect}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
};
