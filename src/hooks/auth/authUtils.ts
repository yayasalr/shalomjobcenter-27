
import { User } from './types';

// Simulation de stockage local des utilisateurs avec mot de passe plus sécurisé
export const MOCK_USERS = [
  {
    id: "1",
    email: "user@example.com",
    name: "Utilisateur Standard",
    password: "User@2025!",
    role: "user" as const,
  },
  {
    id: "admin",
    email: "admin@admin.com",
    name: "Administrateur",
    password: "Admin@2025!",
    role: "admin" as const,
  },
];

export const WELCOME_BOT = {
  id: 'welcome-bot',
  name: 'SHALOM JOB CENTER',
  avatar: '/placeholder.svg',
  role: 'admin' as const,
};

export const ADMIN_USER = {
  id: 'admin',
  name: 'Administrateur',
  avatar: '/placeholder.svg',
  role: 'admin' as const,
};

export const createWelcomeMessages = (user: User) => {
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

// Fonction pour vérifier si un compte admin existe déjà
export const ensureAdminAccount = () => {
  const storedUsers = localStorage.getItem("users");
  if (!storedUsers) {
    // Si pas d'utilisateurs, on initialise avec les utilisateurs par défaut
    localStorage.setItem("users", JSON.stringify(MOCK_USERS));
    return;
  }
  
  const users = JSON.parse(storedUsers);
  const adminExists = users.some((user: any) => user.role === "admin");
  
  if (!adminExists) {
    // Si aucun administrateur n'existe, on ajoute l'administrateur par défaut
    users.push(MOCK_USERS.find(user => user.role === "admin"));
    localStorage.setItem("users", JSON.stringify(users));
  }
};
