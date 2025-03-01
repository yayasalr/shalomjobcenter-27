
import { useQueryClient } from "@tanstack/react-query";
import { User } from "./types";

export const useUserAvatar = () => {
  const queryClient = useQueryClient();

  const updateUserAvatar = (user: User | null, avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: avatarUrl };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      localStorage.setItem("userAvatar", avatarUrl);
      queryClient.setQueryData(["auth-user"], updatedUser);
      return updatedUser;
    }
    return user;
  };

  return { updateUserAvatar };
};
