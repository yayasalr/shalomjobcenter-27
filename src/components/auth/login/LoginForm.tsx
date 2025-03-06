
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

interface LoginFormProps {
  securityInfo: {locked: boolean; remainingMinutes: number} | null;
  onSetShowContactAdminDialog: (show: boolean) => void;
}

const LoginForm = ({ securityInfo, onSetShowContactAdminDialog }: LoginFormProps) => {
  const { login, checkAccountLocked } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setFormData({ ...formData, email: newEmail });
    
    // Vérifier l'état de verrouillage du compte à chaque changement d'email
    if (newEmail && checkAccountLocked) {
      const lockStatus = checkAccountLocked(newEmail);
      // We don't need to set security info here as it's passed down from parent
    } else {
      // We don't need to set security info here as it's passed down from parent
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier si le compte est verrouillé avant de tenter la connexion
    if (checkAccountLocked && formData.email) {
      const lockStatus = checkAccountLocked(formData.email);
      if (lockStatus.locked) {
        toast.error(`Compte verrouillé. Réessayez dans ${lockStatus.remainingMinutes} minutes ou contactez l'administrateur.`);
        return;
      }
    }
    
    try {
      await login.mutateAsync(formData);
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <Label htmlFor="email">Adresse email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Adresse email"
            value={formData.email}
            onChange={handleEmailChange}
            disabled={securityInfo?.locked}
          />
        </div>
        <div className="relative">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={securityInfo?.locked}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
              disabled={securityInfo?.locked}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 rounded"
            disabled={securityInfo?.locked}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            Se souvenir de moi
          </label>
        </div>

        <div className="text-sm">
          <Link to="/contact" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Mot de passe oublié?
          </Link>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={login.isPending || !!securityInfo?.locked}
        >
          {login.isPending ? "Connexion..." : "Se connecter"}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
