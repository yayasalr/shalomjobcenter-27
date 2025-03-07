
import { User, RegisterData, LoginCredentials } from "./types";
import { useLoginMutation } from "./mutations/useLoginMutation";
import { useRegisterMutation } from "./mutations/useRegisterMutation";
import { useProfileMutations } from "./mutations/useProfileMutations";

export const useAuthMutations = (
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  // Get login mutation
  const { login } = useLoginMutation(user, setUser);
  
  // Get register mutation
  const { register, registerUser } = useRegisterMutation(setUser);
  
  // Get profile mutations
  const { logout, updateUserAvatar } = useProfileMutations(user, setUser);

  return {
    login,
    register,
    logout,
    registerUser,
    updateUserAvatar
  };
};
