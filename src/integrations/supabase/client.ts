
import { createClient } from '@supabase/supabase-js';

// Créer un client Supabase avec l'URL et la clé d'API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yeizshpwaezgphfghugr.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaXpzaHB3YWV6Z3BoZmdodWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0MzE3NzAsImV4cCI6MjAyNjAwNzc3MH0.jVNiOFn1WKaELNhkzO4fYFx5lU9sOcE0TXSYxKzPrHs';

export const supabase = createClient(supabaseUrl, supabaseKey);
