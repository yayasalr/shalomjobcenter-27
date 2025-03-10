
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PasswordInput from "./PasswordInput";

interface LoginFormProps {
  securityInfo: { locked: boolean; remainingMinutes: number } | null;
  onSetShowContactAdminDialog: (show: boolean) => void;
  onEmailChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoginError?: (error: Error) => void;
}

const LoginForm = ({ 
  securityInfo, 
  onSetShowContactAdminDialog,
  onEmailChange,
  onLoginError
}: LoginFormProps) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setFormError(null);
    if (onEmailChange) {
      onEmailChange(e);
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormError(null);
    
    // Validation des champs
    if (!email) {
      setFormError("Veuillez saisir votre email");
      return;
    }
    
    if (!password) {
      setFormError("Veuillez saisir votre mot de passe");
      return;
    }
    
    // Vérifier si le compte est verrouillé
    if (securityInfo?.locked) {
      setFormError(`Compte verrouillé. Réessayez dans ${securityInfo.remainingMinutes} minutes ou contactez l'administrateur.`);
      return;
    }
    
    try {
      await login.mutateAsync({ email, password, rememberMe });
    } catch (error) {
      console.error("Erreur de connexion:", error);
      
      if (error instanceof Error) {
        if (onLoginError) {
          onLoginError(error);
        } else {
          setFormError(error.message);
        }
      } else {
        setFormError("Une erreur s'est produite. Veuillez réessayer.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {formError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <div className="rounded-md shadow-sm -space-y-px">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Adresse email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="exemple@email.com"
            value={email}
            onChange={handleEmailChange}
            disabled={login.isPending || securityInfo?.locked}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mot de passe
          </label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={handlePasswordChange}
            disabled={login.isPending || securityInfo?.locked}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Checkbox
            id="remember_me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
            disabled={login.isPending || securityInfo?.locked}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            Se souvenir de moi
          </label>
        </div>

        <div className="text-sm">
          <Button
            variant="link"
            className="font-medium text-indigo-600 hover:text-indigo-500 p-0"
            onClick={() => onSetShowContactAdminDialog(true)}
            type="button"
          >
            Mot de passe oublié?
          </Button>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={login.isPending || securityInfo?.locked}
        >
          {login.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Se connecter
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
