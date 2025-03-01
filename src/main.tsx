
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

// Créer un client pour React Query
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
