
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Définir les types de données pour le contenu du site
export interface SiteContent {
  pages: {
    [key: string]: {
      title: string;
      sections: {
        id: string;
        title: string;
        content: string;
        type: 'text' | 'richtext' | 'image';
        imageUrl?: string;
      }[];
    };
  };
  navigation: {
    id: string;
    label: string;
    url: string;
    order: number;
    parent?: string;
  }[];
  publications: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    publishDate: string;
    author: string;
    featured: boolean;
    image?: string;
  }[];
}

// Données initiales de démo
const defaultContent: SiteContent = {
  pages: {
    home: {
      title: "Accueil",
      sections: [
        {
          id: "hero",
          title: "Section Héro",
          content: "Bienvenue sur Shalom Job Center, votre partenaire de confiance pour trouver un emploi ou un logement",
          type: "text"
        },
        {
          id: "feature",
          title: "Section Caractéristiques",
          content: "Nous nous distinguons par notre engagement à offrir des services de qualité supérieure",
          type: "text"
        }
      ]
    },
    about: {
      title: "À propos",
      sections: [
        {
          id: "mission",
          title: "Notre Mission",
          content: "Shalom Job Center a pour mission de mettre en relation employeurs et demandeurs d'emploi dans un cadre professionnel et efficace.",
          type: "richtext"
        },
        {
          id: "team",
          title: "Notre Équipe",
          content: "Notre équipe est composée de professionnels du recrutement avec plus de 10 ans d'expérience.",
          type: "text"
        }
      ]
    },
    contact: {
      title: "Contact",
      sections: [
        {
          id: "info",
          title: "Informations de contact",
          content: "N'hésitez pas à nous contacter pour toute question concernant nos services.",
          type: "text"
        }
      ]
    }
  },
  navigation: [
    { id: "nav-1", label: "Accueil", url: "/", order: 1 },
    { id: "nav-2", label: "Emplois", url: "/jobs", order: 2 },
    { id: "nav-3", label: "Logements", url: "/listings", order: 3 },
    { id: "nav-4", label: "À propos", url: "/about", order: 4 },
    { id: "nav-5", label: "Contact", url: "/contact", order: 5 }
  ],
  publications: [
    {
      id: "pub-1",
      title: "Comment trouver un emploi rapidement",
      slug: "trouver-emploi-rapidement",
      content: "Dans cet article, nous vous donnons des conseils pour trouver un emploi rapidement...",
      excerpt: "Conseils pour optimiser votre recherche d'emploi",
      publishDate: "2023-05-15",
      author: "Jean Dupont",
      featured: true,
      image: "/placeholder.svg"
    },
    {
      id: "pub-2",
      title: "Les tendances du marché immobilier",
      slug: "tendances-marche-immobilier",
      content: "Découvrez les dernières tendances du marché immobilier à Lomé...",
      excerpt: "Analyse du marché immobilier actuel",
      publishDate: "2023-06-20",
      author: "Marie Koumé",
      featured: false,
      image: "/placeholder.svg"
    }
  ]
};

export const useContentManagement = () => {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [activePageId, setActivePageId] = useState<string>("home");
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [activePublicationId, setActivePublicationId] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Charger le contenu depuis le localStorage au démarrage
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem("siteContent");
      if (savedContent) {
        setContent(JSON.parse(savedContent));
      }
    } catch (error) {
      console.error("Erreur lors du chargement du contenu:", error);
      // En cas d'erreur, utiliser le contenu par défaut
      setContent(defaultContent);
    }
  }, []);
  
  // Helpers pour mettre à jour les différentes parties du contenu
  const updatePageSection = (pageId: string, sectionId: string, updates: Partial<SiteContent['pages'][string]['sections'][0]>) => {
    setContent(prev => {
      const newContent = { ...prev };
      const pageIndex = newContent.pages[pageId].sections.findIndex(s => s.id === sectionId);
      
      if (pageIndex !== -1) {
        newContent.pages[pageId].sections[pageIndex] = {
          ...newContent.pages[pageId].sections[pageIndex],
          ...updates
        };
      }
      
      return newContent;
    });
  };
  
  const updateNavItem = (navId: string, updates: Partial<SiteContent['navigation'][0]>) => {
    setContent(prev => {
      const newContent = { ...prev };
      const navIndex = newContent.navigation.findIndex(n => n.id === navId);
      
      if (navIndex !== -1) {
        newContent.navigation[navIndex] = {
          ...newContent.navigation[navIndex],
          ...updates
        };
      }
      
      return newContent;
    });
  };
  
  const updatePublication = (pubId: string, updates: Partial<SiteContent['publications'][0]>) => {
    setContent(prev => {
      const newContent = { ...prev };
      const pubIndex = newContent.publications.findIndex(p => p.id === pubId);
      
      if (pubIndex !== -1) {
        newContent.publications[pubIndex] = {
          ...newContent.publications[pubIndex],
          ...updates
        };
      }
      
      return newContent;
    });
  };
  
  // Fonctions pour ajouter de nouveaux éléments
  const addPageSection = (pageId: string, section: SiteContent['pages'][string]['sections'][0]) => {
    setContent(prev => {
      const newContent = { ...prev };
      if (!newContent.pages[pageId]) {
        newContent.pages[pageId] = { title: pageId, sections: [] };
      }
      newContent.pages[pageId].sections.push(section);
      return newContent;
    });
  };
  
  const addNavItem = (navItem: Omit<SiteContent['navigation'][0], 'id'>) => {
    const newId = `nav-${Date.now()}`;
    setContent(prev => {
      return {
        ...prev,
        navigation: [
          ...prev.navigation,
          { ...navItem, id: newId }
        ]
      };
    });
    return newId;
  };
  
  const addPublication = (publication: Omit<SiteContent['publications'][0], 'id'>) => {
    const newId = `pub-${Date.now()}`;
    setContent(prev => {
      return {
        ...prev,
        publications: [
          ...prev.publications,
          { ...publication, id: newId }
        ]
      };
    });
    return newId;
  };
  
  // Fonctions pour supprimer des éléments
  const deletePageSection = (pageId: string, sectionId: string) => {
    setContent(prev => {
      const newContent = { ...prev };
      newContent.pages[pageId].sections = newContent.pages[pageId].sections.filter(
        section => section.id !== sectionId
      );
      return newContent;
    });
  };
  
  const deleteNavItem = (navId: string) => {
    setContent(prev => {
      return {
        ...prev,
        navigation: prev.navigation.filter(item => item.id !== navId)
      };
    });
  };
  
  const deletePublication = (pubId: string) => {
    setContent(prev => {
      return {
        ...prev,
        publications: prev.publications.filter(pub => pub.id !== pubId)
      };
    });
  };
  
  // Fonction pour sauvegarder tout le contenu
  const saveAllContent = async () => {
    setIsSaving(true);
    try {
      // Sauvegarder dans localStorage
      localStorage.setItem("siteContent", JSON.stringify(content));
      
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Contenu sauvegardé avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du contenu:", error);
      toast.error("Erreur lors de la sauvegarde du contenu");
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    content,
    activePageId,
    setActivePageId,
    activeSectionId,
    setActiveSectionId,
    activePublicationId,
    setActivePublicationId,
    isEditing,
    setIsEditing,
    isSaving,
    // Fonctions de mise à jour
    updatePageSection,
    updateNavItem,
    updatePublication,
    // Fonctions d'ajout
    addPageSection,
    addNavItem,
    addPublication,
    // Fonctions de suppression
    deletePageSection,
    deleteNavItem,
    deletePublication,
    // Sauvegarde
    saveAllContent
  };
};
