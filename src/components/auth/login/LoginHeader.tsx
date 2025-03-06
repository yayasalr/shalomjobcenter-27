
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const LoginHeader = () => {
  return (
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
  );
};

export default LoginHeader;
