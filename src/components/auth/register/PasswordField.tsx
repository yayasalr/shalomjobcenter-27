
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

interface PasswordFieldProps {
  password: string;
  passwordStrength: number;
  passwordErrors: string[];
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  password,
  passwordStrength,
  passwordErrors,
  onPasswordChange,
  showPassword,
  togglePasswordVisibility,
}) => {
  return (
    <div>
      <Label htmlFor="password">Mot de passe</Label>
      <div className="relative">
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Mot de passe"
          value={password}
          onChange={onPasswordChange}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
      
      <PasswordStrengthIndicator 
        password={password}
        passwordStrength={passwordStrength}
        passwordErrors={passwordErrors}
      />
    </div>
  );
};

export default PasswordField;
