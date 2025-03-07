
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PasswordInput from "./PasswordInput";
import { useRef, useEffect } from "react";

interface StandardLoginFormProps {
  email: string;
  password: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  isDisabled: boolean;
}

const StandardLoginForm: React.FC<StandardLoginFormProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isPending,
  isDisabled
}) => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  
  // Focus on the first input on mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email">Adresse email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          ref={emailInputRef}
          autoComplete="email"
          required
          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Adresse email"
          value={email}
          onChange={onEmailChange}
          disabled={isDisabled || isPending}
          aria-invalid={isDisabled ? "true" : undefined}
        />
      </div>
      
      <PasswordInput
        ref={passwordInputRef}
        value={password}
        onChange={onPasswordChange}
        disabled={isDisabled || isPending}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 rounded"
            disabled={isDisabled || isPending}
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

      <Button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        disabled={isPending || isDisabled}
      >
        {isPending ? "Connexion..." : "Se connecter"}
      </Button>
    </div>
  );
};

export default StandardLoginForm;
