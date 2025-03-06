
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin, checkAccountLocked } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [securityInfo, setSecurityInfo] = useState<{locked: boolean; remainingMinutes: number} | null>(null);
  const [showContactAdminDialog, setShowContactAdminDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, le rediriger vers la page appropriée
    if (isAuthenticated) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
    
    // Si un email est saisi, vérifier si le compte est verrouillé
    if (formData.email && checkAccountLocked) {
      const lockStatus = checkAccountLocked(formData.email);
      setSecurityInfo(lockStatus);
    }
  }, [isAuthenticated, isAdmin, navigate, formData.email, checkAccountLocked]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setFormData({ ...formData, email: newEmail });
    
    // Vérifier l'état de verrouillage du compte à chaque changement d'email
    if (newEmail && checkAccountLocked) {
      const lockStatus = checkAccountLocked(newEmail);
      setSecurityInfo(lockStatus);
    } else {
      setSecurityInfo(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier si le compte est verrouillé avant de tenter la connexion
    if (checkAccountLocked && formData.email) {
      const lockStatus = checkAccountLocked(formData.email);
      if (lockStatus.locked) {
        toast.error(`Compte verrouillé. Réessayez dans ${lockStatus.remainingMinutes} minutes ou contactez l'administrateur.`);
        setSecurityInfo(lockStatus);
        return;
      }
    }
    
    try {
      await login.mutateAsync(formData);
    } catch (error) {
      console.error("Erreur de connexion:", error);
      
      // L'erreur est gérée dans le hook useAuth qui affichera les toasts appropriés
      // et mettra à jour le compteur de tentatives
    }
  };

  const handleContactAdmin = () => {
    if (!contactMessage.trim()) {
      toast.error("Veuillez saisir un message pour l'administrateur");
      return;
    }
    
    // Enregistrer la demande de contact dans le localStorage
    const contactRequests = JSON.parse(localStorage.getItem('admin_contact_requests') || '[]');
    contactRequests.push({
      email: formData.email,
      message: contactMessage,
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('admin_contact_requests', JSON.stringify(contactRequests));
    
    toast.success("Votre demande a été envoyée à l'administrateur");
    setShowContactAdminDialog(false);
    setContactMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Connexion sécurisée
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Ou{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              créez un nouveau compte
            </Link>
          </p>
        </div>
        
        {securityInfo?.locked && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
              <div>
                <p className="text-red-800 dark:text-red-300 text-sm font-medium">
                  Compte verrouillé
                </p>
                <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                  Trop de tentatives de connexion. Votre compte est verrouillé pour {securityInfo.remainingMinutes} minutes.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/50"
                  onClick={() => setShowContactAdminDialog(true)}
                >
                  Contacter l'administrateur
                </Button>
              </div>
            </div>
          </div>
        )}
        
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
              <RouterLink to="/contact" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Mot de passe oublié?
              </RouterLink>
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
        
        <div className="pt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            En vous connectant, vous acceptez nos <Link to="/terms" className="underline">Conditions d'Utilisation</Link> et notre <Link to="/privacy" className="underline">Politique de Confidentialité</Link>
          </p>
        </div>
      </div>
      
      {/* Dialog pour contacter l'administrateur */}
      <Dialog open={showContactAdminDialog} onOpenChange={setShowContactAdminDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contacter l'administrateur</DialogTitle>
            <DialogDescription>
              Expliquez pourquoi vous souhaitez déverrouiller votre compte
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-message">Message</Label>
              <Textarea
                id="admin-message"
                placeholder="Expliquez pourquoi vous avez besoin d'un accès à votre compte..."
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactAdminDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleContactAdmin}>
              Envoyer la demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
