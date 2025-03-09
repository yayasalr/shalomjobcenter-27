
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface PasswordMatchIndicatorProps {
  password: string;
  confirmPassword: string;
}

const PasswordMatchIndicator: React.FC<PasswordMatchIndicatorProps> = ({
  password,
  confirmPassword,
}) => {
  if (!password || !confirmPassword) return null;
  
  return (
    <div className="flex items-center mt-1 text-xs">
      {password === confirmPassword ? (
        <>
          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
          <span className="text-green-500">Les mots de passe correspondent</span>
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3 text-red-500 mr-1" />
          <span className="text-red-500">Les mots de passe ne correspondent pas</span>
        </>
      )}
    </div>
  );
};

export default PasswordMatchIndicator;
