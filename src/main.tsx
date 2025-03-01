
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Définir les couleurs globales
document.documentElement.style.setProperty('--primary', '#8B5CF6'); // Couleur principale (violet)
document.documentElement.style.setProperty('--secondary', '#E5DEFF'); // Couleur secondaire (violet clair)
document.documentElement.style.setProperty('--accent', '#D946EF'); // Couleur d'accent (magenta)
document.documentElement.style.setProperty('--background', '#F1F0FB'); // Couleur de fond (gris clair)
document.documentElement.style.setProperty('--foreground', '#1A1F2C'); // Couleur du texte (noir profond)

// Custom CSS variables for the SHALOM theme
document.documentElement.style.setProperty('--sholom-primary', '#8B5CF6');
document.documentElement.style.setProperty('--sholom-primary-dark', '#7c3aed');
document.documentElement.style.setProperty('--sholom-secondary', '#E5DEFF');
document.documentElement.style.setProperty('--sholom-accent', '#D946EF');
document.documentElement.style.setProperty('--sholom-dark', '#1A1F2C');
document.documentElement.style.setProperty('--sholom-light', '#F1F0FB');
document.documentElement.style.setProperty('--sholom-muted', '#6B7280');

// Créer un client pour React Query
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
