
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccountLockedAlertProps {
  remainingMinutes: number;
  onContactAdmin: () => void;
}

const AccountLockedAlert = ({ remainingMinutes, onContactAdmin }: AccountLockedAlertProps) => {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
        <div>
          <p className="text-red-800 dark:text-red-300 text-sm font-medium">
            Compte verrouillé
          </p>
          <p className="text-red-700 dark:text-red-400 text-sm mt-1">
            Trop de tentatives de connexion. Votre compte est verrouillé pour {remainingMinutes} minutes.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/50"
            onClick={onContactAdmin}
          >
            Contacter l'administrateur
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountLockedAlert;
