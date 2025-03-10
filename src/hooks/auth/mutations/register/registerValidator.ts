
import { toast } from "sonner";
import { RegisterData } from "../../types";
import { 
  isEmailRegistered, 
  isUsernameRegistered, 
  validatePasswordStrength,
  isValidEmail 
} from "../../passwordUtils";

/**
 * Validate registration data before creating account
 */
export const validateRegistrationData = (data: RegisterData): boolean => {
  // Check required fields
  if (!data.email || !data.password || !data.name) {
    toast.error("Tous les champs sont obligatoires");
    return false;
  }
  
  // Validate email format
  if (!isValidEmail(data.email)) {
    toast.error("Format d'email invalide");
    return false;
  }
  
  // Check for admin email reservation
  const adminCreds = localStorage.getItem('admin_credentials');
  if (adminCreds) {
    try {
      const adminData = JSON.parse(adminCreds);
      if (data.email.toLowerCase() === adminData.email.toLowerCase()) {
        toast.error("Cet email est réservé pour l'administration");
        return false;
      }
    } catch (e) {
      console.error("Error parsing admin credentials", e);
    }
  }
  
  // Check if the email is already in use
  const existingUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
  const emailExists = existingUsers.some((u: any) => 
    u.email.toLowerCase() === data.email.toLowerCase()
  );
  
  if (emailExists) {
    toast.error("Cet email est déjà utilisé");
    return false;
  }
  
  // Check if username is already in use
  const usernameExists = existingUsers.some((u: any) => 
    u.name && u.name.toLowerCase() === data.name.toLowerCase()
  );
  
  if (usernameExists) {
    toast.error("Ce nom d'utilisateur est déjà utilisé");
    return false;
  }
  
  // Validate password strength
  const passwordValidation = validatePasswordStrength(data.password);
  if (!passwordValidation.valid) {
    toast.error(passwordValidation.errors[0]);
    return false;
  }
  
  return true;
};
