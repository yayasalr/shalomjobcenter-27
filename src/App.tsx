
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SiteSettingsProvider } from './hooks/settings';

// Créer un client QueryClient pour gérer les requêtes
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SiteSettingsProvider>
        <Router>
          <AppRoutes />
          <Toaster position="top-right" richColors closeButton />
        </Router>
      </SiteSettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
