import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [showTwoFactorInput, setShowTwoFactorInput] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [hasDetectedSuspiciousActivity, setHasDetectedSuspiciousActivity] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState(0);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const twoFactorInputRef = useRef<HTMLInputElement>(null);

  // Focus on the first input on mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Check for suspicious login patterns or bot activity
  useEffect(() => {
    // Check how rapidly the user is interacting with the form
    const typingSpeedCheck = () => {
      const now = Date.now();
      const lastActivityStr = sessionStorage.getItem('last_login_activity');
      const lastActivity = lastActivityStr ? parseInt(lastActivityStr) : 0;
      
      if (lastActivity && (now - lastActivity < 100)) {
        // Typing is suspiciously fast - might be automated
        incrementSuspiciousCounter();
      }
      sessionStorage.setItem('last_login_activity', now.toString());
    };

    // Add event listeners to monitor behavior
    const formElements = document.querySelectorAll('input, button');
    formElements.forEach(el => {
      el.addEventListener('click', typingSpeedCheck);
      el.addEventListener('keypress', typingSpeedCheck);
    });

    // Check for unusual browser/device patterns
    const detectSuspiciousEnvironment = () => {
      // Check for automation tools, headless browsers, or unusual plugins
      const windowObj = window as any;
      const automationHints = [
        'webdriver' in navigator,
        'domAutomation' in windowObj,
        'callPhantom' in windowObj,
        '__nightmare' in windowObj,
        '__selenium_evaluate' in windowObj,
        '__webdriverFunc' in windowObj,
        'selenium' in navigator.userAgent.toLowerCase(),
        /headless/i.test(navigator.userAgent)
      ];
      
      if (automationHints.some(hint => hint)) {
        incrementSuspiciousCounter(3); // Higher weight for automation signals
      }
    };
    
    detectSuspiciousEnvironment();

    return () => {
      // Clean up event listeners
      formElements.forEach(el => {
        el.removeEventListener('click', typingSpeedCheck);
        el.removeEventListener('keypress', typingSpeedCheck);
      });
    };
  }, []);

  const incrementSuspiciousCounter = (increment = 1) => {
    const counterStr = sessionStorage.getItem('suspicious_activity_counter');
    const currentCount = counterStr ? parseInt(counterStr) : 0;
    const newCount = currentCount + increment;
    sessionStorage.setItem('suspicious_activity_counter', newCount.toString());
    
    // If we reach a threshold, add security measures
    if (newCount >= 5 && !hasDetectedSuspiciousActivity) {
      setHasDetectedSuspiciousActivity(true);
      // Log the suspicious activity
      const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      securityLogs.push({
        type: 'suspicious_login_behavior',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        indicators: {
          rapidActivity: newCount >= 5,
          automationSignals: /headless|selenium|webdriver/i.test(navigator.userAgent)
        }
      });
      localStorage.setItem('security_logs', JSON.stringify(securityLogs));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setFormData({ ...formData, email: newEmail });
    
    // Check account lock status when email changes
    if (newEmail && checkAccountLocked) {
      const lockStatus = checkAccountLocked(newEmail);
      // Status is handled by parent component
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginAttempt(prev => prev + 1);
    
    // Add a subtle delay to prevent timing attacks
    const randomDelay = Math.floor(Math.random() * 300) + 200;
    await new Promise(resolve => setTimeout(resolve, randomDelay));
    
    // Check if account is locked before attempting to login
    if (checkAccountLocked && formData.email) {
      const lockStatus = checkAccountLocked(formData.email);
      if (lockStatus.locked) {
        toast.error(`Compte verrouillé. Réessayez dans ${lockStatus.remainingMinutes} minutes ou contactez l'administrateur.`);
        return;
      }
    }
    
    // If showing 2FA input, validate the code
    if (showTwoFactorInput) {
      if (!/^\d{6}$/.test(twoFactorCode)) {
        toast.error("Veuillez entrer un code à 6 chiffres valide");
        return;
      }
      
      // In a real app, we would validate the 2FA code here
      // For demo purposes, we'll accept any 6-digit code
      
      // Simulate 2FA validation
      try {
        // Use spread with formData and add twoFactorCode as a separate parameter
        // or modify the LoginCredentials interface to include it
        const result = await login.mutateAsync({
          email: formData.email,
          password: formData.password,
          twoFactorCode: twoFactorCode
        });
        
        // Log successful 2FA login
        const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        securityLogs.push({
          type: '2fa_login_success',
          email: formData.email,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });
        localStorage.setItem('security_logs', JSON.stringify(securityLogs));
      } catch (error) {
        console.error("Erreur de connexion avec 2FA:", error);
      }
      return;
    }
    
    try {
      // First authentication step
      const result = await login.mutateAsync(formData);
      
      // Check if user has 2FA enabled and if we got a result back
      if (result && result.id) {
        const userData = localStorage.getItem(`2fa_${result.id}`);
        if (userData) {
          try {
            const parsedData = JSON.parse(userData);
            if (parsedData.enabled) {
              // Show 2FA input
              setShowTwoFactorInput(true);
              if (twoFactorInputRef.current) {
                setTimeout(() => twoFactorInputRef.current?.focus(), 100);
              }
              return;
            }
          } catch (e) {
            console.error("Error parsing 2FA data", e);
          }
        }
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      
      // If we've had multiple failed attempts, show additional security measures
      if (loginAttempt >= 2) {
        incrementSuspiciousCounter(2);
      }
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {hasDetectedSuspiciousActivity && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Activité suspecte détectée. Pour votre sécurité, des vérifications supplémentaires peuvent être demandées.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="rounded-md shadow-sm space-y-4">
        {!showTwoFactorInput ? (
          <>
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
                value={formData.email}
                onChange={handleEmailChange}
                disabled={securityInfo?.locked || login.isPending}
                aria-invalid={securityInfo?.locked ? "true" : undefined}
              />
            </div>
            <div className="relative">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  ref={passwordInputRef}
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  disabled={securityInfo?.locked || login.isPending}
                  aria-invalid={securityInfo?.locked ? "true" : undefined}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                  disabled={securityInfo?.locked || login.isPending}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <Label htmlFor="two-factor-code" className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-indigo-500" />
              Code d'authentification
            </Label>
            <Input
              id="two-factor-code"
              name="two-factor-code"
              type="text"
              ref={twoFactorInputRef}
              autoComplete="one-time-code"
              required
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-lg tracking-widest text-center font-mono"
              placeholder="000000"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ''))}
              disabled={login.isPending}
            />
            <div className="text-sm text-center mt-2 text-gray-500">
              Saisissez le code depuis votre application d'authentification
            </div>
          </div>
        )}
      </div>

      {!showTwoFactorInput && (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 rounded"
              disabled={securityInfo?.locked || login.isPending}
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
      )}

      <div>
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={login.isPending || !!securityInfo?.locked}
        >
          {login.isPending ? "Connexion..." : showTwoFactorInput ? "Vérifier" : "Se connecter"}
        </Button>
      </div>
      
      {showTwoFactorInput && (
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm text-indigo-600 hover:text-indigo-500"
            onClick={() => setShowTwoFactorInput(false)}
            disabled={login.isPending}
          >
            Retour à la connexion
          </button>
        </div>
      )}
    </form>
  );
};

export default LoginForm;
