
import { User } from "./types";
import { useLoginAttempts } from "./security/useLoginAttempts";
import { useAdminSecurity } from "./security/useAdminSecurity";
import { useSessionSecurity } from "./security/useSessionSecurity";

export const useSecurityFeatures = (user: User | null) => {
  const { getLoginAttempts, updateLoginAttempts, checkAccountLocked } = useLoginAttempts();
  const { unlockUserAccount, updateUserSecurityLevel } = useAdminSecurity(user);
  const { refreshSession } = useSessionSecurity(user);

  return {
    refreshSession,
    unlockUserAccount,
    updateUserSecurityLevel,
    checkAccountLocked,
    getLoginAttempts,
    updateLoginAttempts
  };
};
