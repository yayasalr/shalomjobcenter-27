
import { User } from './types';

// Simulation de stockage local des utilisateurs
export const MOCK_USERS = [
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
