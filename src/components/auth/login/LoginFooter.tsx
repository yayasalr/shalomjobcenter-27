
import { Link } from "react-router-dom";

const LoginFooter = () => {
  return (
    <div className="pt-4 text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        En vous connectant, vous acceptez nos{" "}
        <Link to="/terms" className="underline">
          Conditions d'Utilisation
        </Link>{" "}
        et notre{" "}
        <Link to="/privacy" className="underline">
          Politique de Confidentialité
        </Link>
      </p>
    </div>
  );
};

export default LoginFooter;
