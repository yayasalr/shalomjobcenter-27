
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'host' | 'admin';
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

// Simulation de stockage local des utilisateurs
const MOCK_USERS = [
  {
    id: "1",
    email: "john@example.com",
    name: "John Doe",
    password: "password123",
    role: "host" as const,
  },
  {
    id: "admin",
    email: "admin@example.com",
    name: "Administrateur",
    password: "admin123",
    role: "admin" as const,
  },
];

const WELCOME_BOT = {
  id: 'welcome-bot',
  name: 'SHALOM JOB CENTER',
  avatar: '/placeholder.svg',
  role: 'admin' as const,
};

const ADMIN_USER = {
  id: 'admin',
  name: 'Administrateur',
  avatar: '/placeholder.svg',
  role: 'admin' as const,
};

const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        return JSON.parse(savedUser) as User;
      }
      return null;
    },
  });

  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const users = JSON.parse(localStorage.getItem("users") || JSON.stringify(MOCK_USERS));
      const user = users.find(
        (u: any) => u.email === credentials.email && u.password === credentials.password
      );
      if (!user) {
        throw new Error("Identifiants invalides");
      }
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth-user"], user);
      toast.success("Connexion réussie");
    },
    onError: () => {
      toast.error("Échec de la connexion");
    },
  });

  const register = useMutation({
    mutationFn: async (data: RegisterData) => {
      const users = JSON.parse(localStorage.getItem("users") || JSON.stringify(MOCK_USERS));
      const existingUser = users.find((u: any) => u.email === data.email);
      if (existingUser) {
        throw new Error("Cet email est déjà utilisé");
      }
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        role: "user" as const,
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      const { password, ...userWithoutPassword } = newUser;

      // Créer la conversation de bienvenue
      createWelcomeMessages(userWithoutPassword);
      
      return userWithoutPassword;
    },
    onSuccess: (user) => {
      toast.success("Inscription réussie");
      // Connexion automatique après inscription
      localStorage.setItem("currentUser", JSON.stringify(user));
      queryClient.setQueryData(["auth-user"], user);
    },
    onError: () => {
      toast.error("Échec de l'inscription");
    },
  });

  const createWelcomeMessages = (user: User) => {
    // Message de bienvenue du bot
    const welcomeMessage = {
      id: `welcome-${Date.now()}`,
      content: `Bienvenue ${user.name} sur SHALOM JOB CENTER ! Nous sommes ravis de vous accueillir. N'hésitez pas à parcourir les offres d'emploi et les logements disponibles. Si vous avez des questions, contactez notre équipe d'assistance.`,
      sender: 'system',
      timestamp: new Date(),
      read: false,
    };

    // Message de bienvenue de l'administrateur
    const adminWelcomeMessage = {
      id: `admin-welcome-${Date.now()}`,
      content: `Bonjour ${user.name}, je suis l'administrateur de la plateforme. N'hésitez pas à me contacter si vous avez des questions.`,
      sender: 'admin',
      timestamp: new Date(),
      read: false,
    };

    const initialConversations = [
      {
        id: `welcome-${Date.now()}`,
        with: WELCOME_BOT,
        lastMessage: {
          content: welcomeMessage.content,
          timestamp: welcomeMessage.timestamp,
          read: welcomeMessage.read,
          sender: 'system',
        },
        messages: [welcomeMessage],
      },
      {
        id: `admin-${Date.now()}`,
        with: ADMIN_USER,
        lastMessage: {
          content: adminWelcomeMessage.content,
          timestamp: adminWelcomeMessage.timestamp,
          read: adminWelcomeMessage.read,
          sender: 'admin',
        },
        messages: [adminWelcomeMessage],
      }
    ];

    localStorage.setItem(`conversations_${user.id}`, JSON.stringify(initialConversations));
  };

  const logout = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("currentUser");
      return null;
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-user"], null);
      toast.success("Déconnexion réussie");
    },
  });

  // Add the updateUserAvatar function
  const updateUserAvatar = (avatarUrl: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, avatar: avatarUrl };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      localStorage.setItem("userAvatar", avatarUrl);
      queryClient.setQueryData(["auth-user"], updatedUser);
    }
  };

  return {
    user: currentUser,
    isLoading,
    login,
    register,
    logout,
    updateUserAvatar,
  };
};

export default useAuth;
