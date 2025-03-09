
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import RegisterForm from "@/components/auth/register/RegisterForm";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (formData: any) => {
    try {
      await register.mutateAsync(formData);
      navigate("/login");
      toast.success("Compte créé avec succès. Vous pouvez maintenant vous connecter.");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>
        
        <RegisterForm 
          onSubmit={handleRegister}
          isLoading={register.isPending}
        />
      </div>
    </div>
  );
};

export default Register;
