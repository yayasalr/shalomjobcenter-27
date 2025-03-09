
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordMatchIndicator from "./PasswordMatchIndicator";

interface ConfirmPasswordFieldProps {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ConfirmPasswordField: React.FC<ConfirmPasswordFieldProps> = ({
  password,
  confirmPassword,
  showPassword,
  onConfirmPasswordChange,
}) => {
  return (
    <div>
      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
      <Input
        id="confirmPassword"
        name="confirmPassword"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        required
        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
      />
      <PasswordMatchIndicator 
        password={password}
        confirmPassword={confirmPassword}
      />
    </div>
  );
};

export default ConfirmPasswordField;
