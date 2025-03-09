
import { User } from "../types";

export const useLogoutMutation = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return { logout };
};
