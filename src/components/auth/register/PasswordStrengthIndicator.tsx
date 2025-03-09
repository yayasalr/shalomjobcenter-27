
import React from "react";
import { XCircle, CheckCircle } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
  passwordStrength: number;
  passwordErrors: string[];
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  passwordStrength,
  passwordErrors,
}) => {
  if (!password) return null;
  
  return (
    <>
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              passwordStrength < 2 ? 'bg-red-500' : 
              passwordStrength < 4 ? 'bg-yellow-500' : 'bg-green-500'
            }`} 
            style={{ width: `${(passwordStrength / 5) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Force du mot de passe: {
            passwordStrength < 2 ? 'Faible' : 
            passwordStrength < 4 ? 'Moyen' : 'Fort'
          }
        </p>
      </div>
      
      <div className="mt-2 space-y-1">
        {passwordErrors.map((error, index) => (
          <div key={index} className="flex items-center text-xs text-red-500">
            <XCircle className="h-3 w-3 mr-1" />
            <span>{error}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default PasswordStrengthIndicator;
