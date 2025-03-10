
import { toast } from "sonner";
import { isValidEmail } from "../../passwordUtils";

/**
 * Validate login credentials before attempting authentication
 */
export const validateLoginCredentials = (
  email: string, 
  lockStatus: { locked: boolean; remainingMinutes: number }
): boolean => {
  // Validate email format
  if (!isValidEmail(email)) {
    toast.error(`Format d'email invalide`);
    return false;
  }
  
  // Check if the account is locked
  if (lockStatus.locked) {
    toast.error(`Compte verrouillé. Réessayez dans ${lockStatus.remainingMinutes} minutes ou contactez l'administrateur.`);
    return false;
  }
  
  return true;
};
