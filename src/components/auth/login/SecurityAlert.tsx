
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SecurityAlertProps {
  show: boolean;
}

const SecurityAlert: React.FC<SecurityAlertProps> = ({ show }) => {
  if (!show) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        Activité suspecte détectée. Pour votre sécurité, des vérifications supplémentaires peuvent être demandées.
      </AlertDescription>
    </Alert>
  );
};

export default SecurityAlert;
