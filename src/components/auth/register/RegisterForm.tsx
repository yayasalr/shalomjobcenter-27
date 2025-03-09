
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RegisterData } from "@/hooks/auth/types";
import { usePasswordValidation } from "@/hooks/auth/usePasswordValidation";
import PasswordField from "./PasswordField";
import ConfirmPasswordField from "./ConfirmPasswordField";

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => Promise<void>;
  isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { passwordStrength, passwordErrors, validatePassword } = usePasswordValidation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    validatePassword(newPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier si les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    // Valider le mot de passe
    if (!validatePassword(formData.password)) {
      toast.error("Le mot de passe ne respecte pas les critères de sécurité");
      return;
    }
    
    try {
      // On supprime le champ confirmPassword avant d'envoyer les données
      const { confirmPassword, ...registerData } = formData;
      
      await onSubmit({
        ...registerData,
        acceptTerms: true
      });
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Nom complet"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Adresse email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Adresse email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <PasswordField
          password={formData.password}
          passwordStrength={passwordStrength}
          passwordErrors={passwordErrors}
          onPasswordChange={handlePasswordChange}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
        />
        
        <ConfirmPasswordField
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          showPassword={showPassword}
          onConfirmPasswordChange={(e) => 
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
        />
      </div>

      <div>
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Inscription..." : "S'inscrire"}
        </Button>
      </div>
      
      <div className="pt-4 text-center">
        <p className="text-xs text-gray-500">
          En vous inscrivant, vous acceptez nos Conditions d'Utilisation et notre Politique de Confidentialité.
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
