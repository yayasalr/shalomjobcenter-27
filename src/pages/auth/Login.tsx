
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import LoginHeader from "@/components/auth/login/LoginHeader";
import LoginForm from "@/components/auth/login/LoginForm";
import LoginFooter from "@/components/auth/login/LoginFooter";
import AccountLockedAlert from "@/components/auth/login/AccountLockedAlert";
import ContactAdminDialog from "@/components/auth/login/ContactAdminDialog";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, checkAccountLocked } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [securityInfo, setSecurityInfo] = useState<{locked: boolean; remainingMinutes: number} | null>(null);
  const [showContactAdminDialog, setShowContactAdminDialog] = useState(false);

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, le rediriger vers la page appropriée
    if (isAuthenticated) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
    
    // Si un email est saisi, vérifier si le compte est verrouillé
    if (formData.email && checkAccountLocked) {
      const lockStatus = checkAccountLocked(formData.email);
      setSecurityInfo(lockStatus);
    }
  }, [isAuthenticated, isAdmin, navigate, formData.email, checkAccountLocked]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setFormData({ ...formData, email: newEmail });
    
    // Vérifier l'état de verrouillage du compte à chaque changement d'email
    if (newEmail && checkAccountLocked) {
      const lockStatus = checkAccountLocked(newEmail);
      setSecurityInfo(lockStatus);
    } else {
      setSecurityInfo(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <LoginHeader />
        
        {securityInfo?.locked && (
          <AccountLockedAlert 
            remainingMinutes={securityInfo.remainingMinutes} 
            onContactAdmin={() => setShowContactAdminDialog(true)} 
          />
        )}
        
        <LoginForm 
          securityInfo={securityInfo} 
          onSetShowContactAdminDialog={setShowContactAdminDialog} 
        />
        
        <LoginFooter />
      </div>
      
      <ContactAdminDialog 
        open={showContactAdminDialog} 
        onOpenChange={setShowContactAdminDialog}
        email={formData.email}
      />
    </div>
  );
};

export default Login;
