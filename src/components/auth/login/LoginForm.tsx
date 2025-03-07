
import { useRef } from "react";
import useAuth from "@/hooks/useAuth";
import SecurityAlert from "./SecurityAlert";
import StandardLoginForm from "./StandardLoginForm";
import TwoFactorForm from "./TwoFactorForm";
import { useLoginForm } from "@/hooks/auth/useLoginForm";
import { useSuspiciousActivityDetection } from "@/hooks/auth/useSuspiciousActivityDetection";

interface LoginFormProps {
  securityInfo: {locked: boolean; remainingMinutes: number} | null;
  onSetShowContactAdminDialog: (show: boolean) => void;
}

const LoginForm = ({ securityInfo, onSetShowContactAdminDialog }: LoginFormProps) => {
  const { login } = useAuth();
  const { hasDetectedSuspiciousActivity } = useSuspiciousActivityDetection();
  const twoFactorInputRef = useRef<HTMLInputElement>(null);
  
  const {
    formData,
    twoFactorCode,
    showTwoFactorInput,
    handleEmailChange,
    handlePasswordChange,
    handleTwoFactorCodeChange,
    handleBackToLogin,
    handleSubmit
  } = useLoginForm();

  // Create a form submission wrapper that accepts the event
  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      <SecurityAlert show={hasDetectedSuspiciousActivity} />
      
      {showTwoFactorInput ? (
        <TwoFactorForm
          value={twoFactorCode}
          onChange={handleTwoFactorCodeChange}
          onSubmit={handleSubmit}
          onBack={handleBackToLogin}
          isPending={login.isPending}
        />
      ) : (
        <StandardLoginForm
          email={formData.email}
          password={formData.password}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onSubmit={onSubmit}
          isPending={login.isPending}
          isDisabled={!!securityInfo?.locked}
        />
      )}
    </form>
  );
};

export default LoginForm;
