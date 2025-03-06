
import React from 'react';
import { SocialAccountsCard } from './social/SocialAccountsCard';
import { BenefitsCard } from './social/BenefitsCard';
import { ConnectAccountDialog } from './social/ConnectAccountDialog';
import { DisconnectAccountDialog } from './social/DisconnectAccountDialog';
import { useSocialAccounts } from './social/useSocialAccounts';

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
