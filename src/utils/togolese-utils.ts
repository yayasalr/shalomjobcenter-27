
// Constantes et utilitaires spécifiques au Togo

// Taux de conversion EUR to FCFA (fixe pour la zone CFA)
export const EUR_TO_FCFA_RATE = 655.957;

// Conversion d'un montant en euros vers FCFA
export const euroToFCFA = (amountEUR: number): number => {
  return Math.round(amountEUR * EUR_TO_FCFA_RATE);
};

// Formater un prix en FCFA avec séparateur de milliers
export const formatFCFA = (amount: number): string => {
  return amount.toLocaleString('fr-FR');
};

// Données pour les villes togolaises
export const TOGOLESE_CITIES = [
  'Lomé',
  'Sokodé',
  'Kara',
  'Kpalimé',
  'Atakpamé',
  'Bassar',
  'Tsévié',
  'Aného',
  'Mango',
  'Dapaong'
];

// Régions du Togo
export const TOGOLESE_REGIONS = [
  'Maritime',
  'Plateaux',
  'Centrale',
  'Kara',
  'Savanes'
];

// Préfectures du Togo
export const TOGOLESE_PREFECTURES = {
  'Maritime': ['Golfe', 'Lacs', 'Vo', 'Yoto', 'Zio', 'Avé'],
  'Plateaux': ['Ogou', 'Est-Mono', 'Haho', 'Kloto', 'Agou', 'Danyi', 'Wawa', 'Akébou', 'Amou', 'Moyen-Mono'],
  'Centrale': ['Tchaoudjo', 'Tchamba', 'Sotouboua', 'Blitta'],
  'Kara': ['Kozah', 'Binah', 'Doufelgou', 'Kéran', 'Bassar', 'Dankpen', 'Assoli'],
  'Savanes': ['Tone', 'Cinkassé', 'Oti', 'Tandjouaré', 'Kpendjal', 'Kpendjal-Ouest']
};

// Jours fériés au Togo
export const TOGOLESE_HOLIDAYS = [
  { date: '01-01', name: "Jour de l'An" },
  { date: '04-27', name: "Fête de l'Indépendance" },
  { date: '05-01', name: 'Fête du Travail' },
  { date: '08-15', name: "Assomption" },
  { date: '11-01', name: 'Toussaint' },
  { date: '12-25', name: 'Noël' }
];

// Format d'adresse togolaise
export const formatTogoleseAddress = (
  street: string,
  quartier: string,
  city: string = 'Lomé',
  postcode: string = '',
  country: string = 'Togo'
): string => {
  const parts = [street, quartier, city];
  if (postcode) parts.push(postcode);
  parts.push(country);
  return parts.filter(Boolean).join(', ');
};
